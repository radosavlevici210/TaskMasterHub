import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SimulationStats, PerformanceStats } from "@/types/simulation";
import { Zap, Calculator, Gauge, Download, Video, FileText, Image } from "lucide-react";

interface StatsPanelProps {
  stats: SimulationStats | null;
  performanceStats: PerformanceStats;
  onExportGIF: () => void;
  onExportMP4: () => void;
  onExportData: () => void;
}

export function StatsPanel({
  stats,
  performanceStats,
  onExportGIF,
  onExportMP4,
  onExportData
}: StatsPanelProps) {
  const formatScientific = (value: number): string => {
    if (value === 0) return '0';
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    return `${mantissa.toFixed(2)} × 10${exponent >= 0 ? '⁺' : '⁻'}${Math.abs(exponent)}`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1e6) {
      return formatScientific(value);
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div className="absolute right-4 top-24 bottom-4 w-72 z-20">
      <div className="glass-panel rounded-2xl p-6 h-full overflow-y-auto space-y-6">
        {/* Energy Statistics */}
        <div>
          <h3 className="font-quantum text-lg font-bold text-quantum-green mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Energy Stats
          </h3>
          
          {stats && (
            <>
              {/* Total Energy */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Energy</span>
                  <span className="text-sm font-mono text-quantum-green">
                    {formatScientific(stats.totalEnergy)} J
                  </span>
                </div>
                <Progress 
                  value={Math.min((stats.totalEnergy / 1e16) * 100, 100)} 
                  className="h-2"
                />
              </div>
              
              {/* Kinetic Energy */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Kinetic</span>
                  <span className="text-sm font-mono text-quantum-yellow">
                    {formatScientific(stats.kineticEnergy)} J
                  </span>
                </div>
                <Progress 
                  value={stats.totalEnergy > 0 ? (stats.kineticEnergy / stats.totalEnergy) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              {/* Potential Energy */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Potential</span>
                  <span className="text-sm font-mono text-quantum-orange">
                    {formatScientific(stats.potentialEnergy)} J
                  </span>
                </div>
                <Progress 
                  value={stats.totalEnergy > 0 ? (stats.potentialEnergy / stats.totalEnergy) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </>
          )}
        </div>
        
        {/* Physics Metrics */}
        <div>
          <h3 className="font-quantum text-lg font-bold text-quantum-blue mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Physics Metrics
          </h3>
          
          {stats && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Collisions/sec</span>
                <span className="text-sm font-mono text-quantum-cyan">
                  {formatNumber(stats.collisionsPerSec)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Avg Velocity</span>
                <span className="text-sm font-mono text-quantum-green">
                  {formatScientific(stats.avgVelocity)} m/s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Max Velocity</span>
                <span className="text-sm font-mono text-quantum-orange">
                  {formatScientific(stats.maxVelocity)} m/s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Entropy</span>
                <span className="text-sm font-mono text-quantum-purple">
                  {formatScientific(stats.entropy)} J/K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">System Age</span>
                <span className="text-sm font-mono text-quantum-yellow">
                  {stats.systemAge.toFixed(1)} s
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Performance Monitor */}
        <div>
          <h3 className="font-quantum text-lg font-bold text-quantum-purple mb-4 flex items-center">
            <Gauge className="w-5 h-5 mr-2" />
            Performance
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">GPU Usage</span>
              <span className="text-sm font-mono text-quantum-green">
                {performanceStats.gpuUsage}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Memory</span>
              <span className="text-sm font-mono text-quantum-blue">
                {performanceStats.memoryUsage.toFixed(1)} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">Render Time</span>
              <span className="text-sm font-mono text-quantum-orange">
                {performanceStats.renderTime.toFixed(1)} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-300">FPS</span>
              <span className="text-sm font-mono text-quantum-cyan">
                {performanceStats.fps}
              </span>
            </div>
          </div>
          
          {/* FPS Graph Placeholder */}
          <div className="mt-4 h-20 glass-panel rounded-lg flex items-center justify-center">
            <div className="text-xs text-gray-400 font-mono">
              Performance Graph
            </div>
          </div>
        </div>
        
        {/* Export Controls */}
        <div>
          <h3 className="font-quantum text-lg font-bold text-quantum-cyan mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export
          </h3>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportMP4}
              className="w-full glass-panel rounded-lg p-2 hover:bg-quantum-cyan hover:bg-opacity-20 transition-all duration-200 text-sm justify-start"
            >
              <Video className="w-4 h-4 mr-2" />
              Export as MP4
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={onExportGIF}
              className="w-full glass-panel rounded-lg p-2 hover:bg-quantum-green hover:bg-opacity-20 transition-all duration-200 text-sm justify-start"
            >
              <Image className="w-4 h-4 mr-2" />
              Export as GIF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportData}
              className="w-full glass-panel rounded-lg p-2 hover:bg-quantum-purple hover:bg-opacity-20 transition-all duration-200 text-sm justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
