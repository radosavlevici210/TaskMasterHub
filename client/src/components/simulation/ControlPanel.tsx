import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticleType, SimulationConfig } from "@/types/simulation";
import { Atom, Magnet, Rocket, Zap } from "lucide-react";

interface ControlPanelProps {
  config: SimulationConfig;
  particleCountByType: Record<ParticleType, number>;
  selectedParticleType: ParticleType;
  onConfigChange: (config: Partial<SimulationConfig>) => void;
  onParticleTypeSelect: (type: ParticleType) => void;
  onLoadScenario: (scenario: string) => void;
}

const PARTICLE_TYPE_CONFIG = {
  photon: { color: 'text-quantum-green', bgColor: 'bg-quantum-green', name: 'Photons', description: 'Light particles' },
  electron: { color: 'text-quantum-purple', bgColor: 'bg-quantum-purple', name: 'Electrons', description: 'Charged particles' },
  quark: { color: 'text-quantum-cyan', bgColor: 'bg-quantum-cyan', name: 'Quarks', description: 'Fundamental' },
  boson: { color: 'text-quantum-orange', bgColor: 'bg-quantum-orange', name: 'Bosons', description: 'Force carriers' },
  darkmatter: { color: 'text-gray-400', bgColor: 'bg-gray-400', name: 'Dark Matter', description: 'Invisible mass' },
  neutrino: { color: 'text-quantum-yellow', bgColor: 'bg-quantum-yellow', name: 'Neutrinos', description: 'Ghost particles' }
};

const SCENARIOS = [
  { id: 'bigbang', name: 'Big Bang', description: 'Universal expansion', icon: '💥' },
  { id: 'blackhole', name: 'Black Hole', description: 'Gravitational collapse', icon: '⚫' },
  { id: 'accelerator', name: 'Particle Accelerator', description: 'High-energy collisions', icon: '⚡' },
  { id: 'galaxy', name: 'Galaxy Formation', description: 'Cosmic evolution', icon: '🌌' }
];

export function ControlPanel({
  config,
  particleCountByType,
  selectedParticleType,
  onConfigChange,
  onParticleTypeSelect,
  onLoadScenario
}: ControlPanelProps) {
  return (
    <div className="absolute left-4 top-24 bottom-4 w-80 z-20">
      <div className="glass-panel rounded-2xl p-6 h-full overflow-y-auto space-y-6">
        {/* Particle Types Section */}
        <div>
          <h3 className="font-quantum text-lg font-bold text-quantum-cyan mb-4 flex items-center">
            <Atom className="w-5 h-5 mr-2" />
            Particle Types
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.entries(PARTICLE_TYPE_CONFIG).map(([type, typeConfig]) => (
              <div
                key={type}
                className={`glass-panel rounded-xl p-3 cursor-pointer transition-all duration-200 group ${
                  selectedParticleType === type 
                    ? `bg-opacity-20 ${typeConfig.bgColor.replace('bg-', 'bg-opacity-20 ')}` 
                    : `hover:bg-opacity-10 ${typeConfig.bgColor.replace('bg-', 'hover:bg-opacity-10 ')}`
                }`}
                onClick={() => onParticleTypeSelect(type as ParticleType)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-4 h-4 ${typeConfig.bgColor} rounded-full group-hover:animate-pulse-glow`}></div>
                  <Badge variant="secondary" className={`text-xs font-mono ${typeConfig.color}`}>
                    {particleCountByType[type as ParticleType]}
                  </Badge>
                </div>
                <div className="text-sm font-medium">{typeConfig.name}</div>
                <div className="text-xs text-gray-400">{typeConfig.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Physics Controls */}
        <div>
          <h3 className="font-quantum text-lg font-bold text-quantum-purple mb-4 flex items-center">
            <Magnet className="w-5 h-5 mr-2" />
            Physics Settings
          </h3>
          
          {/* Gravity Strength */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Gravity Strength</label>
              <span className="text-xs font-mono text-quantum-cyan">
                {config.gravityStrength.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[config.gravityStrength]}
              onValueChange={([value]) => onConfigChange({ gravityStrength: value })}
              min={0}
              max={2}
              step={0.01}
              className="w-full"
            />
          </div>
          
          {/* Electromagnetic Force */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">EM Force</label>
              <span className="text-xs font-mono text-quantum-purple">
                {config.emForce.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[config.emForce]}
              onValueChange={([value]) => onConfigChange({ emForce: value })}
              min={0}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
          
          {/* Temperature */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Temperature (K)</label>
              <span className="text-xs font-mono text-quantum-orange">
                {config.temperature.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[config.temperature]}
              onValueChange={([value]) => onConfigChange({ temperature: value })}
              min={0}
              max={10000}
              step={100}
              className="w-full"
            />
          </div>
          
          {/* Collision Detection Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Collision Detection</span>
            <Switch
              checked={config.collisionDetection}
              onCheckedChange={(checked) => onConfigChange({ collisionDetection: checked })}
            />
          </div>
          
          {/* Energy Conservation Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Energy Conservation</span>
            <Switch
              checked={config.energyConservation}
              onCheckedChange={(checked) => onConfigChange({ energyConservation: checked })}
            />
          </div>
        </div>
        
        {/* Preset Scenarios */}
        <div>
          <h3 className="font-quantum text-lg font-bold text-quantum-orange mb-4 flex items-center">
            <Rocket className="w-5 h-5 mr-2" />
            Scenarios
          </h3>
          
          <div className="space-y-2">
            {SCENARIOS.map((scenario) => (
              <Button
                key={scenario.id}
                variant="ghost"
                className="w-full glass-panel rounded-lg p-3 hover:bg-quantum-orange hover:bg-opacity-20 transition-all duration-200 text-left justify-start h-auto"
                onClick={() => onLoadScenario(scenario.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium flex items-center">
                      <span className="mr-2">{scenario.icon}</span>
                      {scenario.name}
                    </div>
                    <div className="text-xs text-gray-400">{scenario.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
