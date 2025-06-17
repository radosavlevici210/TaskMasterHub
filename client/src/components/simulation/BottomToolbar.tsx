import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InteractionMode } from "@/types/simulation";
import { MousePointer, Plus, X, Ruler, Zap, Tornado, HelpCircle } from "lucide-react";

interface BottomToolbarProps {
  interactionMode: InteractionMode;
  onInteractionModeChange: (mode: InteractionMode) => void;
  onEnergyBurst: () => void;
  onCreateVortex: () => void;
  onShowTutorial: () => void;
}

export function BottomToolbar({
  interactionMode,
  onInteractionModeChange,
  onEnergyBurst,
  onCreateVortex,
  onShowTutorial
}: BottomToolbarProps) {
  const interactionModes = [
    { id: 'gravity' as const, icon: MousePointer, color: 'text-quantum-cyan', label: 'Gravity Wells' },
    { id: 'create' as const, icon: Plus, color: 'text-quantum-green', label: 'Create Particles' },
    { id: 'destroy' as const, icon: X, color: 'text-quantum-orange', label: 'Destroy Particles' },
    { id: 'measure' as const, icon: Ruler, color: 'text-quantum-purple', label: 'Measurement Tools' }
  ];

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center space-x-4">
          {/* Interaction Modes */}
          <div className="flex items-center space-x-2">
            {interactionModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = interactionMode === mode.id;
              
              return (
                <Button
                  key={mode.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onInteractionModeChange(mode.id)}
                  className={`glass-panel rounded-lg p-3 hover:bg-opacity-30 transition-all duration-200 ${
                    isActive 
                      ? `bg-opacity-20 ${mode.color.replace('text-', 'bg-').replace('quantum-', 'quantum-')}`
                      : `hover:${mode.color.replace('text-', 'bg-').replace('quantum-', 'quantum-')}`
                  }`}
                  title={mode.label}
                >
                  <Icon className={`w-4 h-4 ${mode.color}`} />
                </Button>
              );
            })}
          </div>
          
          <Separator orientation="vertical" className="h-8 bg-gray-600" />
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEnergyBurst}
              className="glass-panel rounded-lg px-4 py-2 hover:bg-quantum-yellow hover:bg-opacity-20 transition-all duration-200 text-sm font-medium"
            >
              <Zap className="w-4 h-4 mr-2 text-quantum-yellow" />
              Energy Burst
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateVortex}
              className="glass-panel rounded-lg px-4 py-2 hover:bg-gray-400 hover:bg-opacity-20 transition-all duration-200 text-sm font-medium"
            >
              <Tornado className="w-4 h-4 mr-2 text-gray-400" />
              Vortex
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowTutorial}
              className="glass-panel rounded-lg px-4 py-2 hover:bg-quantum-blue hover:bg-opacity-20 transition-all duration-200 text-sm font-medium"
            >
              <HelpCircle className="w-4 h-4 mr-2 text-quantum-blue" />
              Tutorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
