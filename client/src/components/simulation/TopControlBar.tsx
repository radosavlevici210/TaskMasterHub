import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Settings } from "lucide-react";

interface TopControlBarProps {
  isRunning: boolean;
  fps: number;
  particleCount: number;
  onPause: () => void;
  onReset: () => void;
  onSettings: () => void;
}

export function TopControlBar({
  isRunning,
  fps,
  particleCount,
  onPause,
  onReset,
  onSettings
}: TopControlBarProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-20">
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-quantum-cyan to-quantum-purple rounded-lg flex items-center justify-center quantum-glow">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 border-2 border-white rounded-full animate-quantum-spin"></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            <div>
              <h1 className="font-quantum text-xl font-bold text-quantum-cyan">Quantum Simulator</h1>
              <p className="text-xs text-gray-400 font-mono">v2.0 Advanced Physics</p>
            </div>
          </div>
          
          {/* Simulation Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-quantum-green animate-pulse-glow' : 'bg-gray-500'}`}></div>
              <span className={`text-sm font-mono ${isRunning ? 'text-quantum-green' : 'text-gray-400'}`}>
                {isRunning ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <div className="text-sm font-mono text-gray-300">
              FPS: <span className="text-quantum-cyan">{fps}</span>
            </div>
            <div className="text-sm font-mono text-gray-300">
              Particles: <span className="text-quantum-yellow">{particleCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Main Controls */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPause}
            className="glass-panel rounded-lg px-4 py-2 hover:bg-quantum-cyan hover:bg-opacity-20 transition-all duration-200"
          >
            {isRunning ? (
              <Pause className="w-4 h-4 text-quantum-cyan" />
            ) : (
              <Play className="w-4 h-4 text-quantum-cyan" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="glass-panel rounded-lg px-4 py-2 hover:bg-quantum-orange hover:bg-opacity-20 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 text-quantum-orange" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="glass-panel rounded-lg px-4 py-2 hover:bg-quantum-purple hover:bg-opacity-20 transition-all duration-200"
          >
            <Settings className="w-4 h-4 text-quantum-purple" />
          </Button>
        </div>
      </div>
    </div>
  );
}
