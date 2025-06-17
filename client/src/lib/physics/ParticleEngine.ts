import { Particle, GravityWell, SimulationConfig, SimulationStats, ParticleType } from "@/types/simulation";
import { PhysicsCalculations } from "./PhysicsCalculations";
import { CollisionDetection } from "./CollisionDetection";
import { createParticle, getParticleConfig } from "./ParticleTypes";

export class ParticleEngine {
  private particles: Particle[] = [];
  private gravityWells: GravityWell[] = [];
  private config: SimulationConfig;
  private lastUpdateTime = 0;
  private collisionCount = 0;
  private startTime = Date.now();

  constructor(config: SimulationConfig) {
    this.config = { ...config };
    this.initializeParticles();
  }

  private initializeParticles(): void {
    this.particles = [];
    
    Object.entries(this.config.particleCount).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        const particle = this.createRandomParticle(type as ParticleType);
        this.particles.push(particle);
      }
    });
  }

  private createRandomParticle(type: ParticleType): Particle {
    const x = Math.random() * 1920; // Assume canvas size
    const y = Math.random() * 1080;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1e5;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    return createParticle(type, x, y, vx, vy);
  }

  updateConfig(newConfig: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  addGravityWell(x: number, y: number, strength: number = 1000): GravityWell {
    const well: GravityWell = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      strength,
      radius: 200,
      active: true
    };
    this.gravityWells.push(well);
    return well;
  }

  removeGravityWell(id: string): void {
    this.gravityWells = this.gravityWells.filter(well => well.id !== id);
  }

  updateGravityWell(id: string, x: number, y: number): void {
    const well = this.gravityWells.find(w => w.id === id);
    if (well) {
      well.x = x;
      well.y = y;
    }
  }

  addParticles(type: ParticleType, count: number, x?: number, y?: number): void {
    for (let i = 0; i < count; i++) {
      const particle = x !== undefined && y !== undefined
        ? createParticle(type, x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50)
        : this.createRandomParticle(type);
      this.particles.push(particle);
    }
  }

  removeParticlesInArea(x: number, y: number, radius: number): number {
    const initialCount = this.particles.length;
    this.particles = this.particles.filter(particle => {
      const dx = particle.x - x;
      const dy = particle.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance > radius;
    });
    return initialCount - this.particles.length;
  }

  update(currentTime: number): void {
    const deltaTime = currentTime - this.lastUpdateTime;
    if (deltaTime <= 0) return;

    this.lastUpdateTime = currentTime;
    const scaledDeltaTime = deltaTime * 0.001; // Convert to seconds

    // Update particle physics
    for (const particle of this.particles) {
      PhysicsCalculations.updateParticlePhysics(
        particle,
        this.particles,
        this.gravityWells,
        this.config,
        scaledDeltaTime
      );

      // Update particle trails
      this.updateParticleTrail(particle);

      // Handle particle aging and decay
      this.handleParticleLifecycle(particle);
    }

    // Handle collisions if enabled
    if (this.config.collisionDetection) {
      const collisionResult = CollisionDetection.processCollisions(this.particles);
      this.collisionCount += collisionResult.collisions;

      // Remove particles marked for removal
      this.particles = this.particles.filter(
        particle => !collisionResult.particlesToRemove.includes(particle.id)
      );

      // Add new particles from collisions
      this.particles.push(...collisionResult.particlesToAdd);
    }

    // Handle boundary conditions
    this.handleBoundaries();

    // Remove dead particles
    this.particles = this.particles.filter(particle => 
      particle.age < particle.lifespan && 
      !isNaN(particle.x) && 
      !isNaN(particle.y)
    );
  }

  private updateParticleTrail(particle: Particle): void {
    const config = getParticleConfig(particle.type);
    
    // Add current position to trail
    particle.trail.unshift({
      x: particle.x,
      y: particle.y,
      opacity: 1.0
    });

    // Maintain trail length and fade opacity
    while (particle.trail.length > config.trailLength) {
      particle.trail.pop();
    }

    // Update trail opacity
    particle.trail.forEach((point, index) => {
      point.opacity = 1.0 - (index / config.trailLength);
    });
  }

  private handleParticleLifecycle(particle: Particle): void {
    // Handle particle decay
    if (particle.age > particle.lifespan && particle.lifespan !== Infinity) {
      // Mark for removal (will be handled in main update loop)
      particle.age = particle.lifespan + 1;
    }

    // Handle energy-based effects
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    particle.energy = 0.5 * particle.mass * speed * speed;
  }

  private handleBoundaries(): void {
    const canvasWidth = 1920; // These should be passed in or configurable
    const canvasHeight = 1080;

    for (const particle of this.particles) {
      // Wrap around boundaries or reflect
      if (particle.x < 0) {
        particle.x = canvasWidth;
      } else if (particle.x > canvasWidth) {
        particle.x = 0;
      }

      if (particle.y < 0) {
        particle.y = canvasHeight;
      } else if (particle.y > canvasHeight) {
        particle.y = 0;
      }
    }
  }

  getStats(): SimulationStats {
    const totalEnergy = PhysicsCalculations.calculateTotalEnergy(this.particles);
    const kineticEnergy = this.particles.reduce((sum, p) => sum + p.energy, 0);
    const potentialEnergy = totalEnergy - kineticEnergy;
    const entropy = PhysicsCalculations.calculateEntropy(this.particles);
    const avgVelocity = PhysicsCalculations.calculateAverageVelocity(this.particles);
    const maxVelocity = PhysicsCalculations.calculateMaxVelocity(this.particles);
    const systemAge = (Date.now() - this.startTime) / 1000;

    return {
      particleCount: this.particles.length,
      totalEnergy,
      kineticEnergy,
      potentialEnergy,
      temperature: this.config.temperature,
      entropy,
      collisionsPerSec: this.collisionCount,
      avgVelocity,
      maxVelocity,
      systemAge
    };
  }

  getParticles(): Particle[] {
    return [...this.particles];
  }

  getGravityWells(): GravityWell[] {
    return [...this.gravityWells];
  }

  getParticleCountByType(): Record<ParticleType, number> {
    const counts: Record<ParticleType, number> = {
      photon: 0,
      electron: 0,
      quark: 0,
      boson: 0,
      darkmatter: 0,
      neutrino: 0
    };

    for (const particle of this.particles) {
      counts[particle.type]++;
    }

    return counts;
  }

  reset(): void {
    this.particles = [];
    this.gravityWells = [];
    this.collisionCount = 0;
    this.startTime = Date.now();
    this.initializeParticles();
  }

  clear(): void {
    this.particles = [];
    this.gravityWells = [];
    this.collisionCount = 0;
  }
}
