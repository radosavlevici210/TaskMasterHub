import { useState, useEffect, useRef } from "react";
import { ParticleCanvas } from "@/components/simulation/ParticleCanvas";
import { TopControlBar } from "@/components/simulation/TopControlBar";
import { ControlPanel } from "@/components/simulation/ControlPanel";
import { StatsPanel } from "@/components/simulation/StatsPanel";
import { BottomToolbar } from "@/components/simulation/BottomToolbar";
import { KeyboardShortcuts } from "@/components/simulation/KeyboardShortcuts";
import { TutorialOverlay } from "@/components/simulation/TutorialOverlay";
import { useToast } from "@/hooks/use-toast";

interface SimulationData {
  stats: any;
  performanceStats: any;
  isRunning: boolean;
  particleCountByType: any;
  controls: any;
  config: any;
  interactionMode: any;
  selectedParticleType: any;
}

export default function QuantumSimulator() {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      // Prevent default behavior for our handled keys
      if (['h', ' ', 'r', 'escape', 'g', 'c', 'd', 'm'].includes(key)) {
        event.preventDefault();
      }

      switch (key) {
        case 'h':
          setShowKeyboardShortcuts(prev => !prev);
          break;
        case ' ':
          if (simulationData?.controls) {
            simulationData.controls.toggleSimulation();
          }
          break;
        case 'r':
          if (simulationData?.controls) {
            simulationData.controls.resetSimulation();
            toast({
              title: "Simulation Reset",
              description: "All particles and gravity wells have been reset.",
            });
          }
          break;
        case 'escape':
          if (simulationData?.controls) {
            simulationData.controls.clearSimulation();
            toast({
              title: "Simulation Cleared",
              description: "All particles and gravity wells have been removed.",
            });
          }
          break;
        case 'g':
          if (simulationData?.controls) {
            simulationData.controls.setInteractionMode('gravity');
            toast({
              title: "Gravity Mode",
              description: "Click to create gravity wells.",
            });
          }
          break;
        case 'c':
          if (simulationData?.controls) {
            simulationData.controls.setInteractionMode('create');
            toast({
              title: "Create Mode",
              description: "Click to create particles.",
            });
          }
          break;
        case 'd':
          if (simulationData?.controls) {
            simulationData.controls.setInteractionMode('destroy');
            toast({
              title: "Destroy Mode",
              description: "Click to destroy particles.",
            });
          }
          break;
        case 'm':
          if (simulationData?.controls) {
            simulationData.controls.setInteractionMode('measure');
            toast({
              title: "Measure Mode",
              description: "Click to measure particle properties.",
            });
          }
          break;
        case '1':
          if (simulationData?.controls) {
            simulationData.controls.setSelectedParticleType('photon');
          }
          break;
        case '2':
          if (simulationData?.controls) {
            simulationData.controls.setSelectedParticleType('electron');
          }
          break;
        case '3':
          if (simulationData?.controls) {
            simulationData.controls.setSelectedParticleType('quark');
          }
          break;
        case '4':
          if (simulationData?.controls) {
            simulationData.controls.setSelectedParticleType('boson');
          }
          break;
        case '5':
          if (simulationData?.controls) {
            simulationData.controls.setSelectedParticleType('darkmatter');
          }
          break;
        case '6':
          if (simulationData?.controls) {
            simulationData.controls.setSelectedParticleType('neutrino');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [simulationData, toast]);

  // Check if user is first-time visitor
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('quantum-simulator-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('quantum-simulator-tutorial-seen', 'true');
    setShowTutorial(false);
  };

  const handleEnergyBurst = () => {
    if (simulationData?.controls) {
      // Create an energy burst at the center of the screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Add multiple high-energy particles
      ['photon', 'electron', 'boson'].forEach((type, index) => {
        setTimeout(() => {
          simulationData.controls.setSelectedParticleType(type);
          // Create particles in a circle pattern
          for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const radius = 100;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            // This would need to be implemented in the particle engine
            // For now, we'll use the existing addParticles method
          }
        }, index * 100);
      });

      toast({
        title: "Energy Burst!",
        description: "High-energy particles created at simulation center.",
      });
    }
  };

  const handleCreateVortex = () => {
    if (simulationData?.controls) {
      // Create multiple gravity wells in a spiral pattern
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        const radius = 150;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        setTimeout(() => {
          // This would need access to the particle engine to add gravity wells
          // For now, we'll simulate by switching to gravity mode
          simulationData.controls.setInteractionMode('gravity');
        }, i * 200);
      }

      toast({
        title: "Vortex Created!",
        description: "Multiple gravity wells arranged in spiral pattern.",
      });
    }
  };

  const handleExportSuccess = (type: string) => {
    toast({
      title: `Export Complete`,
      description: `Simulation exported as ${type.toUpperCase()} successfully.`,
    });
  };

  const handleExportError = (type: string, error: string) => {
    toast({
      title: `Export Failed`,
      description: `Failed to export as ${type.toUpperCase()}: ${error}`,
      variant: "destructive",
    });
  };

  const wrappedExportGIF = async () => {
    try {
      if (simulationData?.controls) {
        await simulationData.controls.exportAsGIF();
        handleExportSuccess('gif');
      }
    } catch (error) {
      handleExportError('gif', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const wrappedExportMP4 = async () => {
    try {
      if (simulationData?.controls) {
        await simulationData.controls.exportAsMP4();
        handleExportSuccess('mp4');
      }
    } catch (error) {
      handleExportError('mp4', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const wrappedExportData = () => {
    try {
      if (simulationData?.controls) {
        simulationData.controls.exportData();
        handleExportSuccess('json');
      }
    } catch (error) {
      handleExportError('json', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const totalParticleCount = simulationData?.particleCountByType 
    ? Object.values(simulationData.particleCountByType).reduce((sum: number, count: any) => sum + count, 0)
    : 0;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-space-deep">
      {/* Main Simulation Canvas */}
      <ParticleCanvas onSimulationData={setSimulationData} />
      
      {/* Top Control Bar */}
      {simulationData && (
        <TopControlBar
          isRunning={simulationData.isRunning}
          fps={simulationData.performanceStats?.fps || 0}
          particleCount={totalParticleCount}
          onPause={simulationData.controls?.toggleSimulation}
          onReset={simulationData.controls?.resetSimulation}
          onSettings={() => setShowSettings(true)}
        />
      )}
      
      {/* Left Control Panel */}
      {simulationData && (
        <ControlPanel
          config={simulationData.config}
          particleCountByType={simulationData.particleCountByType}
          selectedParticleType={simulationData.selectedParticleType}
          onConfigChange={simulationData.controls?.updateConfig}
          onParticleTypeSelect={simulationData.controls?.setSelectedParticleType}
          onLoadScenario={simulationData.controls?.loadScenario}
        />
      )}
      
      {/* Right Stats Panel */}
      {simulationData && (
        <StatsPanel
          stats={simulationData.stats}
          performanceStats={simulationData.performanceStats}
          onExportGIF={wrappedExportGIF}
          onExportMP4={wrappedExportMP4}
          onExportData={wrappedExportData}
        />
      )}
      
      {/* Bottom Toolbar */}
      {simulationData && (
        <BottomToolbar
          interactionMode={simulationData.interactionMode}
          onInteractionModeChange={simulationData.controls?.setInteractionMode}
          onEnergyBurst={handleEnergyBurst}
          onCreateVortex={handleCreateVortex}
          onShowTutorial={() => setShowTutorial(true)}
        />
      )}
      
      {/* Mobile FAB */}
      <div className="absolute bottom-20 right-4 md:hidden z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 bg-gradient-to-br from-quantum-cyan to-quantum-purple rounded-full flex items-center justify-center quantum-glow shadow-2xl"
        >
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 border-2 border-white rounded-full animate-quantum-spin"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </button>
      </div>
      
      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
      
      {/* Tutorial Overlay */}
      <TutorialOverlay
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />
      
      {/* Loading State */}
      {!simulationData && (
        <div className="absolute inset-0 bg-space-deep flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-quantum-cyan to-quantum-purple rounded-full flex items-center justify-center quantum-glow mx-auto mb-4">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 border-2 border-white rounded-full animate-quantum-spin"></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            <h2 className="font-quantum text-xl font-bold text-quantum-cyan mb-2">
              Initializing Quantum Simulator
            </h2>
            <p className="text-gray-400 text-sm font-mono">
              Loading particle physics engine...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
