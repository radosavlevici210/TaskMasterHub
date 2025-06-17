import { Particle } from "@/types/simulation";
import { getParticleConfig } from "./ParticleTypes";

export class CollisionDetection {
  private static spatialGrid: Map<string, Particle[]> = new Map();
  private static gridSize = 50;

  static updateSpatialGrid(particles: Particle[]): void {
    this.spatialGrid.clear();
    
    for (const particle of particles) {
      const gridX = Math.floor(particle.x / this.gridSize);
      const gridY = Math.floor(particle.y / this.gridSize);
      const key = `${gridX},${gridY}`;
      
      if (!this.spatialGrid.has(key)) {
        this.spatialGrid.set(key, []);
      }
      this.spatialGrid.get(key)!.push(particle);
    }
  }

  static getNearbyParticles(particle: Particle): Particle[] {
    const gridX = Math.floor(particle.x / this.gridSize);
    const gridY = Math.floor(particle.y / this.gridSize);
    const nearby: Particle[] = [];

    // Check 3x3 grid around particle
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${gridX + dx},${gridY + dy}`;
        const cellParticles = this.spatialGrid.get(key);
        if (cellParticles) {
          nearby.push(...cellParticles);
        }
      }
    }

    return nearby.filter(p => p.id !== particle.id);
  }

  static checkCollision(particle1: Particle, particle2: Particle): boolean {
    const dx = particle1.x - particle2.x;
    const dy = particle1.y - particle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (particle1.size + particle2.size) / 2;
    
    return distance < minDistance;
  }

  static handleCollision(particle1: Particle, particle2: Particle): {
    result: 'elastic' | 'fusion' | 'decay' | 'annihilation';
    products?: Particle[];
  } {
    const config1 = getParticleConfig(particle1.type);
    const config2 = getParticleConfig(particle2.type);

    // Annihilation for particle-antiparticle pairs
    if (particle1.charge !== 0 && particle2.charge !== 0 && 
        particle1.charge === -particle2.charge) {
      return { result: 'annihilation' };
    }

    // Fusion for certain particle combinations
    if (this.canFuse(particle1, particle2)) {
      const fusionProduct = this.createFusionProduct(particle1, particle2);
      return { result: 'fusion', products: [fusionProduct] };
    }

    // Decay for unstable particles after collision
    if (particle1.age > particle1.lifespan * 0.8 || particle2.age > particle2.lifespan * 0.8) {
      const decayProducts = this.createDecayProducts(particle1, particle2);
      return { result: 'decay', products: decayProducts };
    }

    // Elastic collision (default)
    this.performElasticCollision(particle1, particle2);
    return { result: 'elastic' };
  }

  private static canFuse(particle1: Particle, particle2: Particle): boolean {
    // Simplified fusion rules
    return (
      (particle1.type === 'quark' && particle2.type === 'quark') ||
      (particle1.type === 'electron' && particle2.type === 'boson')
    );
  }

  private static createFusionProduct(particle1: Particle, particle2: Particle): Particle {
    // Create a new particle from fusion
    const centerX = (particle1.x + particle2.x) / 2;
    const centerY = (particle1.y + particle2.y) / 2;
    const totalMomentumX = particle1.mass * particle1.vx + particle2.mass * particle2.vx;
    const totalMomentumY = particle1.mass * particle1.vy + particle2.mass * particle2.vy;
    const totalMass = particle1.mass + particle2.mass;

    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'boson', // Fusion typically creates bosons
      x: centerX,
      y: centerY,
      vx: totalMomentumX / totalMass,
      vy: totalMomentumY / totalMass,
      mass: totalMass * 0.95, // Mass defect
      charge: particle1.charge + particle2.charge,
      energy: particle1.energy + particle2.energy,
      age: 0,
      lifespan: getParticleConfig('boson').lifespan,
      color: getParticleConfig('boson').color,
      size: getParticleConfig('boson').size,
      trail: []
    };
  }

  private static createDecayProducts(particle1: Particle, particle2: Particle): Particle[] {
    // Create decay products
    const products: Particle[] = [];
    const numProducts = Math.floor(Math.random() * 3) + 2; // 2-4 products

    for (let i = 0; i < numProducts; i++) {
      const angle = (Math.PI * 2 * i) / numProducts;
      const speed = Math.random() * 1e6;
      
      products.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'photon', // Decay often produces photons
        x: particle1.x,
        y: particle1.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        mass: getParticleConfig('photon').mass,
        charge: 0,
        energy: (particle1.energy + particle2.energy) / numProducts,
        age: 0,
        lifespan: getParticleConfig('photon').lifespan,
        color: getParticleConfig('photon').color,
        size: getParticleConfig('photon').size,
        trail: []
      });
    }

    return products;
  }

  private static performElasticCollision(particle1: Particle, particle2: Particle): void {
    // Conservation of momentum and energy
    const m1 = particle1.mass;
    const m2 = particle2.mass;
    const v1x = particle1.vx;
    const v1y = particle1.vy;
    const v2x = particle2.vx;
    const v2y = particle2.vy;

    // Calculate new velocities after elastic collision
    particle1.vx = ((m1 - m2) * v1x + 2 * m2 * v2x) / (m1 + m2);
    particle1.vy = ((m1 - m2) * v1y + 2 * m2 * v2y) / (m1 + m2);
    particle2.vx = ((m2 - m1) * v2x + 2 * m1 * v1x) / (m1 + m2);
    particle2.vy = ((m2 - m1) * v2y + 2 * m1 * v1y) / (m1 + m2);

    // Separate particles to prevent overlap
    const dx = particle1.x - particle2.x;
    const dy = particle1.y - particle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = (particle1.size + particle2.size) / 2 - distance;
    
    if (overlap > 0) {
      const separationX = (dx / distance) * overlap * 0.5;
      const separationY = (dy / distance) * overlap * 0.5;
      
      particle1.x += separationX;
      particle1.y += separationY;
      particle2.x -= separationX;
      particle2.y -= separationY;
    }
  }

  static processCollisions(particles: Particle[]): {
    collisions: number;
    particlesToRemove: string[];
    particlesToAdd: Particle[];
  } {
    this.updateSpatialGrid(particles);
    
    const collisions = new Set<string>();
    const particlesToRemove: string[] = [];
    const particlesToAdd: Particle[] = [];
    let collisionCount = 0;

    for (const particle of particles) {
      const nearby = this.getNearbyParticles(particle);
      
      for (const other of nearby) {
        const pairKey = [particle.id, other.id].sort().join('-');
        if (collisions.has(pairKey)) continue;
        
        if (this.checkCollision(particle, other)) {
          collisions.add(pairKey);
          collisionCount++;
          
          const result = this.handleCollision(particle, other);
          
          if (result.result === 'annihilation') {
            particlesToRemove.push(particle.id, other.id);
          } else if (result.result === 'fusion') {
            particlesToRemove.push(particle.id, other.id);
            if (result.products) {
              particlesToAdd.push(...result.products);
            }
          } else if (result.result === 'decay') {
            particlesToRemove.push(particle.id, other.id);
            if (result.products) {
              particlesToAdd.push(...result.products);
            }
          }
        }
      }
    }

    return { collisions: collisionCount, particlesToRemove, particlesToAdd };
  }
}
