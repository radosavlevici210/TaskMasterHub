import { SimulationConfig, ParticleType } from "@/types/simulation";

export interface ScenarioPreset {
  name: string;
  description: string;
  config: SimulationConfig;
  setupActions?: Array<{
    type: 'addGravityWell' | 'addParticleBurst';
    params: any;
  }>;
}

export const SCENARIO_PRESETS: Record<string, ScenarioPreset> = {
  bigbang: {
    name: "Big Bang",
    description: "Universal expansion from a singularity",
    config: {
      gravityStrength: 0.1,
      emForce: 2.0,
      temperature: 15000,
      collisionDetection: true,
      energyConservation: true,
      particleCount: {
        photon: 1000,
        electron: 200,
        quark: 150,
        boson: 50,
        darkmatter: 300,
        neutrino: 800
      }
    },
    setupActions: [
      {
        type: 'addGravityWell',
        params: { x: 960, y: 540, strength: -5000 } // Repulsive center
      }
    ]
  },

  blackhole: {
    name: "Black Hole",
    description: "Gravitational collapse and event horizon",
    config: {
      gravityStrength: 3.0,
      emForce: 0.5,
      temperature: 2000,
      collisionDetection: true,
      energyConservation: false,
      particleCount: {
        photon: 300,
        electron: 100,
        quark: 50,
        boson: 20,
        darkmatter: 500,
        neutrino: 200
      }
    },
    setupActions: [
      {
        type: 'addGravityWell',
        params: { x: 960, y: 540, strength: 15000 } // Massive attractive center
      }
    ]
  },

  accelerator: {
    name: "Particle Accelerator",
    description: "High-energy particle collisions",
    config: {
      gravityStrength: 0.1,
      emForce: 3.0,
      temperature: 50000,
      collisionDetection: true,
      energyConservation: true,
      particleCount: {
        photon: 100,
        electron: 500,
        quark: 300,
        boson: 100,
        darkmatter: 50,
        neutrino: 150
      }
    },
    setupActions: [
      {
        type: 'addParticleBurst',
        params: { x: 200, y: 540, type: 'electron', count: 50, energy: 'high' }
      },
      {
        type: 'addParticleBurst',
        params: { x: 1720, y: 540, type: 'electron', count: 50, energy: 'high' }
      }
    ]
  },

  galaxy: {
    name: "Galaxy Formation",
    description: "Cosmic structure formation over time",
    config: {
      gravityStrength: 1.5,
      emForce: 0.3,
      temperature: 3000,
      collisionDetection: false,
      energyConservation: true,
      particleCount: {
        photon: 400,
        electron: 150,
        quark: 100,
        boson: 30,
        darkmatter: 800,
        neutrino: 500
      }
    },
    setupActions: [
      {
        type: 'addGravityWell',
        params: { x: 480, y: 270, strength: 8000 }
      },
      {
        type: 'addGravityWell',
        params: { x: 1440, y: 270, strength: 6000 }
      },
      {
        type: 'addGravityWell',
        params: { x: 960, y: 810, strength: 7000 }
      }
    ]
  },

  quantum_foam: {
    name: "Quantum Foam",
    description: "Virtual particle creation and annihilation",
    config: {
      gravityStrength: 0.05,
      emForce: 4.0,
      temperature: 100000,
      collisionDetection: true,
      energyConservation: false,
      particleCount: {
        photon: 2000,
        electron: 300,
        quark: 500,
        boson: 200,
        darkmatter: 100,
        neutrino: 1000
      }
    }
  },

  neutron_star: {
    name: "Neutron Star",
    description: "Ultra-dense matter under extreme gravity",
    config: {
      gravityStrength: 5.0,
      emForce: 1.0,
      temperature: 1000000,
      collisionDetection: true,
      energyConservation: true,
      particleCount: {
        photon: 200,
        electron: 800,
        quark: 1000,
        boson: 50,
        darkmatter: 200,
        neutrino: 1500
      }
    },
    setupActions: [
      {
        type: 'addGravityWell',
        params: { x: 960, y: 540, strength: 25000 }
      }
    ]
  }
};

export function getScenarioPreset(name: string): ScenarioPreset | undefined {
  return SCENARIO_PRESETS[name];
}

export function getAllScenarioNames(): string[] {
  return Object.keys(SCENARIO_PRESETS);
}

export function createCustomScenario(
  name: string,
  description: string,
  config: SimulationConfig
): ScenarioPreset {
  return {
    name,
    description,
    config: { ...config }
  };
}
