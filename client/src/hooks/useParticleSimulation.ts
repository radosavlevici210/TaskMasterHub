import { useState, useEffect, useRef, useCallback } from "react";
import { ParticleEngine } from "@/lib/physics/ParticleEngine";
import { SimulationConfig, SimulationStats, PerformanceStats, InteractionMode, ParticleType, GravityWell } from "@/types/simulation";
import { ExportManager } from "@/lib/simulation/ExportManager";
import { getScenarioPreset } from "@/lib/simulation/ScenarioPresets";

const DEFAULT_CONFIG: SimulationConfig = {
  gravityStrength: 0.75,
  emForce: 1.2,
  temperature: 2847,
  collisionDetection: true,
  energyConservation: false,
  particleCount: {
    photon: 342,
    electron: 186,
    quark: 98,
    boson: 73,
    darkmatter: 548,
    neutrino: 1394
  }
};

export function useParticleSimulation(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [isRunning, setIsRunning] = useState(true);
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<SimulationStats | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    fps: 60,
    renderTime: 16.67,
    gpuUsage: 0,
    memoryUsage: 0
  });
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('gravity');
  const [selectedParticleType, setSelectedParticleType] = useState<ParticleType>('photon');

  const engineRef = useRef<ParticleEngine | null>(null);
  const exportManagerRef = useRef<ExportManager | null>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'stats_update') {
            // Handle real-time stats updates from server
            console.log('Received stats update:', data.data);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Initialize simulation engine
  useEffect(() => {
    if (!canvasRef.current) return;

    engineRef.current = new ParticleEngine(config);
    exportManagerRef.current = new ExportManager(canvasRef.current);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef]);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    if (!engineRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update performance stats
    frameCountRef.current++;
    if (currentTime - lastFpsUpdateRef.current >= 1000) {
      const fps = frameCountRef.current / ((currentTime - lastFpsUpdateRef.current) / 1000);
      setPerformanceStats(prev => ({
        ...prev,
        fps: Math.round(fps),
        renderTime: 1000 / fps
      }));
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = currentTime;
    }

    // Update simulation
    if (isRunning) {
      engineRef.current.update(currentTime);
      
      // Update stats
      const simulationStats = engineRef.current.getStats();
      setStats(simulationStats);

      // Send stats to WebSocket if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'simulation_stats',
          data: simulationStats
        }));
      }
    }

    // Render
    render(ctx, canvas);

    // Capture frame for recording if needed
    if (exportManagerRef.current) {
      exportManagerRef.current.captureFrame();
    }

    lastFrameTimeRef.current = currentTime;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isRunning, canvasRef]);

  // Start animation loop
  useEffect(() => {
    if (canvasRef.current && engineRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  const render = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!engineRef.current) return;

    // Clear canvas with space background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, 'hsl(0, 0%, 4%)');
    gradient.addColorStop(0.5, 'hsl(240, 29%, 13%)');
    gradient.addColorStop(1, 'hsl(220, 50%, 18%)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render gravity wells
    const gravityWells = engineRef.current.getGravityWells();
    for (const well of gravityWells) {
      renderGravityWell(ctx, well);
    }

    // Render particles
    const particles = engineRef.current.getParticles();
    for (const particle of particles) {
      renderParticle(ctx, particle);
    }
  }, []);

  const renderGravityWell = useCallback((ctx: CanvasRenderingContext2D, well: GravityWell) => {
    if (!well.active) return;

    // Create gravitational lensing effect
    const gradient = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, well.radius);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(well.x - well.radius, well.y - well.radius, well.radius * 2, well.radius * 2);

    // Draw well center
    ctx.beginPath();
    ctx.arc(well.x, well.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#00FFFF';
    ctx.fill();
    
    // Add glow effect
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(well.x, well.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const renderParticle = useCallback((ctx: CanvasRenderingContext2D, particle: any) => {
    // Render particle trail
    if (particle.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
      
      for (let i = 1; i < particle.trail.length; i++) {
        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
      }
      
      ctx.strokeStyle = particle.color;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = particle.size * 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Render particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = particle.size * 2;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  // Simulation controls
  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
    }
  }, []);

  const clearSimulation = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.clear();
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    if (engineRef.current) {
      engineRef.current.updateConfig(updatedConfig);
    }
  }, [config]);

  const loadScenario = useCallback((scenarioName: string) => {
    const preset = getScenarioPreset(scenarioName);
    if (!preset || !engineRef.current) return;

    // Apply configuration
    updateConfig(preset.config);
    
    // Reset simulation
    engineRef.current.reset();
    
    // Apply setup actions
    if (preset.setupActions) {
      for (const action of preset.setupActions) {
        if (action.type === 'addGravityWell') {
          engineRef.current.addGravityWell(
            action.params.x,
            action.params.y,
            action.params.strength
          );
        } else if (action.type === 'addParticleBurst') {
          engineRef.current.addParticles(
            action.params.type,
            action.params.count,
            action.params.x,
            action.params.y
          );
        }
      }
    }
  }, [updateConfig]);

  // Mouse interaction handlers
  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (!engineRef.current) return;

    switch (interactionMode) {
      case 'gravity':
        engineRef.current.addGravityWell(x, y);
        break;
      case 'create':
        engineRef.current.addParticles(selectedParticleType, 10, x, y);
        break;
      case 'destroy':
        engineRef.current.removeParticlesInArea(x, y, 50);
        break;
      case 'measure':
        // TODO: Implement measurement tools
        break;
    }
  }, [interactionMode, selectedParticleType]);

  const handleCanvasMouseMove = useCallback((x: number, y: number, isPressed: boolean) => {
    if (!engineRef.current || !isPressed) return;

    if (interactionMode === 'gravity') {
      // Update existing gravity well position if dragging
      const wells = engineRef.current.getGravityWells();
      const lastWell = wells[wells.length - 1];
      if (lastWell) {
        engineRef.current.updateGravityWell(lastWell.id, x, y);
      }
    }
  }, [interactionMode]);

  // Export functions
  const exportAsGIF = useCallback(async () => {
    if (!exportManagerRef.current) return;
    
    try {
      const blob = await exportManagerRef.current.exportAsGIF({
        format: 'gif',
        duration: 10,
        quality: 'medium',
        includeStats: false
      });
      
      const filename = exportManagerRef.current.generateFileName('gif');
      await exportManagerRef.current.downloadFile(blob, filename);
    } catch (error) {
      console.error('Failed to export GIF:', error);
    }
  }, []);

  const exportAsMP4 = useCallback(async () => {
    if (!exportManagerRef.current) return;
    
    try {
      const blob = await exportManagerRef.current.exportAsMP4({
        format: 'mp4',
        duration: 10,
        quality: 'high',
        includeStats: false
      });
      
      const filename = exportManagerRef.current.generateFileName('mp4');
      await exportManagerRef.current.downloadFile(blob, filename);
    } catch (error) {
      console.error('Failed to export MP4:', error);
    }
  }, []);

  const exportData = useCallback(() => {
    if (!exportManagerRef.current || !engineRef.current || !stats) return;
    
    const particles = engineRef.current.getParticles();
    const dataJson = exportManagerRef.current.exportSimulationData(particles, stats, {
      format: 'json',
      duration: 0,
      quality: 'high',
      includeStats: true
    });
    
    const blob = new Blob([dataJson], { type: 'application/json' });
    const filename = exportManagerRef.current.generateFileName('json');
    exportManagerRef.current.downloadFile(blob, filename);
  }, [stats]);

  return {
    // State
    isRunning,
    config,
    stats,
    performanceStats,
    interactionMode,
    selectedParticleType,
    
    // Controls
    toggleSimulation,
    resetSimulation,
    clearSimulation,
    updateConfig,
    loadScenario,
    setInteractionMode,
    setSelectedParticleType,
    
    // Interaction
    handleCanvasClick,
    handleCanvasMouseMove,
    
    // Export
    exportAsGIF,
    exportAsMP4,
    exportData,
    
    // Utilities
    getParticleCountByType: () => engineRef.current?.getParticleCountByType() ?? {
      photon: 0, electron: 0, quark: 0, boson: 0, darkmatter: 0, neutrino: 0
    }
  };
}
