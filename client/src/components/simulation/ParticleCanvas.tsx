import { useEffect, useRef } from "react";
import { useParticleSimulation } from "@/hooks/useParticleSimulation";

interface ParticleCanvasProps {
  onSimulationData?: (data: any) => void;
}

export function ParticleCanvas({ onSimulationData }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  
  const simulation = useParticleSimulation(canvasRef);

  // Handle canvas resize
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current!;
      const container = containerRef.current!;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Set CSS dimensions to match
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Pass simulation data to parent component
  useEffect(() => {
    if (onSimulationData) {
      onSimulationData({
        stats: simulation.stats,
        performanceStats: simulation.performanceStats,
        isRunning: simulation.isRunning,
        particleCountByType: simulation.getParticleCountByType(),
        controls: {
          toggleSimulation: simulation.toggleSimulation,
          resetSimulation: simulation.resetSimulation,
          clearSimulation: simulation.clearSimulation,
          updateConfig: simulation.updateConfig,
          loadScenario: simulation.loadScenario,
          setInteractionMode: simulation.setInteractionMode,
          setSelectedParticleType: simulation.setSelectedParticleType,
          exportAsGIF: simulation.exportAsGIF,
          exportAsMP4: simulation.exportAsMP4,
          exportData: simulation.exportData
        },
        config: simulation.config,
        interactionMode: simulation.interactionMode,
        selectedParticleType: simulation.selectedParticleType
      });
    }
  }, [simulation, onSimulationData]);

  // Mouse event handlers
  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    isMouseDownRef.current = true;
    const coords = getCanvasCoordinates(event);
    simulation.handleCanvasClick(coords.x, coords.y);
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event);
    simulation.handleCanvasMouseMove(coords.x, coords.y, isMouseDownRef.current);
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
  };

  // Touch event handlers for mobile
  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      
      simulation.handleCanvasClick(x, y);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      
      simulation.handleCanvasMouseMove(x, y, true);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 particle-cursor"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-gradient-to-br from-space-deep via-space-matter to-space-void"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />
      
      {/* Particle trails overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle-trail absolute w-2 h-32 rounded-full opacity-60" style={{ top: '20%', left: '15%', transform: 'rotate(45deg)' }}></div>
        <div className="particle-trail absolute w-1 h-20 rounded-full opacity-40" style={{ top: '60%', left: '80%', transform: 'rotate(-30deg)' }}></div>
        <div className="particle-trail absolute w-3 h-40 rounded-full opacity-70" style={{ top: '40%', left: '50%', transform: 'rotate(90deg)' }}></div>
      </div>
    </div>
  );
}
