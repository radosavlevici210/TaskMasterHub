export interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  charge: number;
  energy: number;
  age: number;
  lifespan: number;
  color: string;
  size: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
}

export type ParticleType = 'photon' | 'electron' | 'quark' | 'boson' | 'darkmatter' | 'neutrino';

export interface GravityWell {
  id: string;
  x: number;
  y: number;
  strength: number;
  radius: number;
  active: boolean;
}

export interface SimulationConfig {
  gravityStrength: number;
  emForce: number;
  temperature: number;
  collisionDetection: boolean;
  energyConservation: boolean;
  particleCount: Record<ParticleType, number>;
  preset?: string;
}

export interface SimulationStats {
  particleCount: number;
  totalEnergy: number;
  kineticEnergy: number;
  potentialEnergy: number;
  temperature: number;
  entropy: number;
  collisionsPerSec: number;
  avgVelocity: number;
  maxVelocity: number;
  systemAge: number;
}

export interface PerformanceStats {
  fps: number;
  renderTime: number;
  gpuUsage: number;
  memoryUsage: number;
}

export type InteractionMode = 'gravity' | 'create' | 'destroy' | 'measure';

export type ScenarioType = 'bigbang' | 'blackhole' | 'accelerator' | 'galaxy';

export interface ExportOptions {
  format: 'mp4' | 'gif' | 'json';
  duration: number;
  quality: 'low' | 'medium' | 'high';
  includeStats: boolean;
}
