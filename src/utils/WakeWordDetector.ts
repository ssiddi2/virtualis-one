export class WakeWordDetector {
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isListening = false;
  private wakeWords = ['hey virtualis', 'virtualis', 'ambient emr'];
  private confidenceBuffer: number[] = [];
  private transcriptionBuffer = '';

  constructor(private onWakeWordDetected: () => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.processAudioForWakeWord(inputData);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      this.isListening = true;

      console.log('Wake word detection started');
    } catch (error) {
      console.error('Failed to start wake word detection:', error);
      throw error;
    }
  }

  private processAudioForWakeWord(audioData: Float32Array) {
    // Simple energy-based voice activity detection
    const energy = this.calculateEnergy(audioData);
    
    if (energy > 0.01) { // Voice activity threshold
      // In a real implementation, this would use a proper wake word detection model
      // For demo purposes, we'll use a simplified approach
      this.detectWakeWordInBuffer();
    }
  }

  private calculateEnergy(audioData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    return Math.sqrt(sum / audioData.length);
  }

  private detectWakeWordInBuffer() {
    // Simulate wake word detection confidence
    const confidence = Math.random();
    this.confidenceBuffer.push(confidence);
    
    // Keep only last 10 values
    if (this.confidenceBuffer.length > 10) {
      this.confidenceBuffer.shift();
    }

    // Check if average confidence is high enough
    const avgConfidence = this.confidenceBuffer.reduce((a, b) => a + b, 0) / this.confidenceBuffer.length;
    
    if (avgConfidence > 0.7) {
      console.log('Wake word detected with confidence:', avgConfidence);
      this.onWakeWordDetected();
      this.confidenceBuffer = []; // Reset after detection
    }
  }

  stop() {
    this.isListening = false;
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  get isActive() {
    return this.isListening;
  }
}
