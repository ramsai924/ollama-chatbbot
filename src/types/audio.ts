export interface AudioData {
    dataArray: Uint8Array;
    bufferLength: number;
    isActive: boolean;
}

export interface VisualizerSettings {
    colorTheme: 'rainbow' | 'ocean' | 'fire' | 'pulse';
    sensitivity: number;
    particleCount: number;
    particleSize: number;
    baseRadius: number;
    rotationSpeed: number;
  }
  
export type AudioVisualizerProps = {
  settings: VisualizerSettings;
  audioData: AudioData;
  enabled: boolean;
  };