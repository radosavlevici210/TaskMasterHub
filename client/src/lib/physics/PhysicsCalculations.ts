import { Particle, GravityWell, SimulationConfig } from "@/types/simulation";

export class PhysicsCalculations {
  private static readonly G = 6.67430e-11; // Gravitational constant
  private static readonly k = 8.9875e9; // Coulomb's constant
  private static readonly c = 299792458; // Speed of light

  static calculateGravitationalForce(
    particle1: Particle,
    particle2: Particle
  ): { fx: number; fy: number } {
    const dx = particle2.x - particle1.x;
    const dy = particle2.y - particle1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 1e-10) return { fx: 0, fy: 0 };
    
    const force = (this.G * particle1.mass * particle2.mass) / (distance * distance);
    const fx = force * (dx / distance);
    const fy = force * (dy / distance);
    
    return { fx, fy };
  }

  static calculateElectromagneticForce(
    particle1: Particle,
    particle2: Particle
  ): { fx: number; fy: number } {
    if (particle1.charge === 0 || particle2.charge === 0) {
      return { fx: 0, fy: 0 };
    }
    
    const dx = particle2.x - particle1.x;
    const dy = particle2.y - particle1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 1e-10) return { fx: 0, fy: 0 };
    
    const force = (this.k * particle1.charge * particle2.charge) / (distance * distance);
    const fx = -force * (dx / distance); // Repulsive for like charges
    const fy = -force * (dy / distance);
    
    return { fx, fy };
  }

  static calculateGravityWellForce(
    particle: Particle,
    well: GravityWell
  ): { fx: number; fy: number } {
    if (!well.active) return { fx: 0, fy: 0 };
    
    const dx = well.x - particle.x;
    const dy = well.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 1 || distance > well.radius) return { fx: 0, fy: 0 };
    
    const force = (well.strength * particle.mass) / (distance * distance);
    const fx = force * (dx / distance);
    const fy = force * (dy / distance);
    
    return { fx, fy };
  }

  static updateParticlePhysics(
    particle: Particle,
    allParticles: Particle[],
    gravityWells: GravityWell[],
    config: SimulationConfig,
    deltaTime: number
  ): void {
    let totalFx = 0;
    let totalFy = 0;

    // Calculate forces from other particles
    for (const otherParticle of allParticles) {
      if (otherParticle.id === particle.id) continue;

      // Gravitational force
      const gravForce = this.calculateGravitationalForce(particle, otherParticle);
      totalFx += gravForce.fx * config.gravityStrength;
      totalFy += gravForce.fy * config.gravityStrength;

      // Electromagnetic force
      const emForce = this.calculateElectromagneticForce(particle, otherParticle);
      totalFx += emForce.fx * config.emForce;
      totalFy += emForce.fy * config.emForce;
    }

    // Calculate forces from gravity wells
    for (const well of gravityWells) {
      const wellForce = this.calculateGravityWellForce(particle, well);
      totalFx += wellForce.fx;
      totalFy += wellForce.fy;
    }

    // Apply thermal motion
    const thermalEnergy = config.temperature * 1.380649e-23; // Boltzmann constant
    const thermalVelocity = Math.sqrt(2 * thermalEnergy / particle.mass);
    totalFx += (Math.random() - 0.5) * thermalVelocity * 0.1;
    totalFy += (Math.random() - 0.5) * thermalVelocity * 0.1;

    // Update velocity based on acceleration
    const ax = totalFx / particle.mass;
    const ay = totalFy / particle.mass;
    
    particle.vx += ax * deltaTime;
    particle.vy += ay * deltaTime;

    // Apply relativistic effects for high-speed particles
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (speed > this.c * 0.1) {
      const gamma = 1 / Math.sqrt(1 - (speed * speed) / (this.c * this.c));
      particle.vx /= gamma;
      particle.vy /= gamma;
    }

    // Update position
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    // Update energy
    particle.energy = 0.5 * particle.mass * (particle.vx * particle.vx + particle.vy * particle.vy);

    // Update age
    particle.age += deltaTime;
  }

  static calculateTotalEnergy(particles: Particle[]): number {
    return particles.reduce((total, particle) => total + particle.energy, 0);
  }

  static calculateEntropy(particles: Particle[]): number {
    // Simplified entropy calculation based on velocity distribution
    const avgEnergy = this.calculateTotalEnergy(particles) / particles.length;
    return particles.reduce((entropy, particle) => {
      const energyRatio = particle.energy / avgEnergy;
      return entropy - energyRatio * Math.log(energyRatio + 1e-10);
    }, 0);
  }

  static calculateAverageVelocity(particles: Particle[]): number {
    const totalSpeed = particles.reduce((total, particle) => {
      return total + Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    }, 0);
    return totalSpeed / particles.length;
  }

  static calculateMaxVelocity(particles: Particle[]): number {
    return Math.max(...particles.map(particle => 
      Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
    ));
  }
}
