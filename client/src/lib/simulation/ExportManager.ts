import { Particle, SimulationStats, ExportOptions } from "@/types/simulation";

export class ExportManager {
  private canvas: HTMLCanvasElement;
  private recordedFrames: ImageData[] = [];
  private isRecording = false;
  private recordingStartTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  startRecording(): void {
    this.recordedFrames = [];
    this.isRecording = true;
    this.recordingStartTime = Date.now();
  }

  stopRecording(): void {
    this.isRecording = false;
  }

  captureFrame(): void {
    if (!this.isRecording) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.recordedFrames.push(imageData);
  }

  async exportAsGIF(options: ExportOptions): Promise<Blob> {
    // This would require a GIF encoding library like gif.js
    // For now, we'll create a placeholder implementation
    
    const canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not create canvas context');

    // Create a simple animated GIF placeholder
    // In a real implementation, you'd use a library like gif.js
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create GIF blob');
        }
      }, 'image/gif');
    });
  }

  async exportAsMP4(options: ExportOptions): Promise<Blob> {
    // This would require WebCodecs API or a library like MediaRecorder
    // For now, we'll create a placeholder implementation
    
    if (!('MediaRecorder' in window)) {
      throw new Error('MediaRecorder not supported in this browser');
    }

    return new Promise((resolve, reject) => {
      const stream = this.canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error('MediaRecorder error'));
      };

      mediaRecorder.start();
      
      // Stop recording after specified duration
      setTimeout(() => {
        mediaRecorder.stop();
      }, options.duration * 1000);
    });
  }

  exportSimulationData(
    particles: Particle[],
    stats: SimulationStats,
    options: ExportOptions
  ): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      particles: particles.map(particle => ({
        id: particle.id,
        type: particle.type,
        position: { x: particle.x, y: particle.y },
        velocity: { x: particle.vx, y: particle.vy },
        mass: particle.mass,
        charge: particle.charge,
        energy: particle.energy,
        age: particle.age
      })),
      statistics: options.includeStats ? stats : null,
      metadata: {
        particleCount: particles.length,
        exportTime: Date.now(),
        version: '2.0'
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportAsImage(format: 'png' | 'jpeg' = 'png'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      }, `image/${format}`, 0.9);
    });
  }

  generateFileName(format: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `quantum-simulation-${timestamp}.${format}`;
  }

  getRecordingInfo(): { 
    isRecording: boolean; 
    frameCount: number; 
    duration: number; 
  } {
    return {
      isRecording: this.isRecording,
      frameCount: this.recordedFrames.length,
      duration: this.isRecording ? (Date.now() - this.recordingStartTime) / 1000 : 0
    };
  }
}
