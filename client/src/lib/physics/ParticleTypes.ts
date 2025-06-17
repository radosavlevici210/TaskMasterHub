import { ParticleType } from "@/types/simulation";

export const PARTICLE_CONFIGS = {
  photon: {
    mass: 0,
    charge: 0,
    color: '#10FF10',
    size: 2,
    maxSpeed: 299792458, // Speed of light (scaled)
    lifespan: Infinity,
    trailLength: 8,
    glowIntensity: 0.8
  },
  electron: {
    mass: 9.109e-31,
    charge: -1,
    color: '#8B5CF6',
    size: 3,
    maxSpeed: 2e8,
    lifespan: Infinity,
    trailLength: 6,
    glowIntensity: 0.6
  },
  quark: {
    mass: 2.3e-30,
    charge: 2/3,
    color: '#00FFFF',
    size: 2.5,
    maxSpeed: 1.5e8,
    lifespan: 1e-24,
    trailLength: 4,
    glowIntensity: 0.7
  },
  boson: {
    mass: 1.25e-25,
    charge: 0,
    color: '#FF6B35',
    size: 4,
    maxSpeed: 1e8,
    lifespan: 1e-22,
    trailLength: 5,
    glowIntensity: 0.9
  },
  darkmatter: {
    mass: 5e-27,
    charge: 0,
    color: '#888888',
    size: 1.5,
    maxSpeed: 5e7,
    lifespan: Infinity,
    trailLength: 3,
    glowIntensity: 0.3
  },
  neutrino: {
    mass: 2e-36,
    charge: 0,
    color: '#FFE66D',
    size: 1,
    maxSpeed: 2.9e8,
    lifespan: Infinity,
    trailLength: 10,
    glowIntensity: 0.4
  }
} as const;

export function getParticleConfig(type: ParticleType) {
  return PARTICLE_CONFIGS[type];
}

export function createParticle(
  type: ParticleType,
  x: number,
  y: number,
  vx: number = 0,
  vy: number = 0
) {
  const config = getParticleConfig(type);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    x,
    y,
    vx,
    vy,
    mass: config.mass,
    charge: config.charge,
    energy: 0.5 * config.mass * (vx * vx + vy * vy),
    age: 0,
    lifespan: config.lifespan,
    color: config.color,
    size: config.size,
    trail: []
  };
}
