export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      console.log('[AudioRecorder] 🎤 Requesting microphone access...');
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('[AudioRecorder] 🎵 Creating AudioContext at 24kHz...');
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });

      console.log('[AudioRecorder] ✓ Actual sample rate:', this.audioContext.sampleRate, 'Hz');

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = new Float32Array(inputData);
        
        // Calculate audio energy to verify we're capturing sound
        const energy = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
        
        if (energy > 0.001) {
          console.log('[AudioRecorder] 📊 Audio chunk:', audioData.length, 'samples, energy:', energy.toFixed(4));
        }
        
        this.onAudioData(audioData);
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      console.log('[AudioRecorder] ✓ Started successfully');
    } catch (error) {
      console.error('[AudioRecorder] ✗ Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    console.log('[AudioRecorder] Stopping...');
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
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
    console.log('[AudioRecorder] ✓ Stopped');
  }
}

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    console.log('[AudioQueue] ➕ Added chunk, queue size:', this.queue.length);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      console.log('[AudioQueue] ✓ Queue empty, playback stopped');
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;
    console.log(`[AudioQueue] 🔊 Playing chunk (${audioData.length} bytes), ${this.queue.length} remaining`);

    try {
      const wavData = this.createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      console.log(`[AudioQueue] ✓ Decoded: ${audioBuffer.duration.toFixed(2)}s @ ${audioBuffer.sampleRate}Hz`);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        console.log('[AudioQueue] ✓ Chunk finished');
        this.playNext();
      };
      source.start(0);
    } catch (error) {
      console.error('[AudioQueue] ✗ Error playing audio:', error);
      this.playNext();
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    // Convert bytes to 16-bit samples (little-endian)
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    // Create WAV header
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  }

  clear() {
    this.queue = [];
    this.isPlaying = false;
    console.log('[AudioQueue] Cleared');
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  // Convert Float32Array to Int16Array (PCM16 format - little-endian)
  const int16Array = new Int16Array(float32Array.length);
  
  for (let i = 0; i < float32Array.length; i++) {
    // Clamp value between -1 and 1
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    // Convert to 16-bit PCM
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Create Uint8Array from Int16Array buffer (preserves little-endian byte order)
  const uint8Array = new Uint8Array(int16Array.buffer);
  
  // Convert to base64 in chunks to avoid stack overflow
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

export class AmbientVoiceProcessor {
  private ws: WebSocket | null = null;
  private audioRecorder: AudioRecorder | null = null;
  private audioQueue: AudioQueue | null = null;
  private audioContext: AudioContext | null = null;
  private isListening = false;

  constructor(
    private onMessage: (message: any) => void,
    private onListeningChange: (listening: boolean) => void
  ) {}

  async connect() {
    try {
      console.log('[AmbientVoice] 🔌 Connecting...');
      
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      this.audioQueue = new AudioQueue(this.audioContext);

      const wsUrl = `wss://ourfwvlbeokoxfgftyrs.supabase.co/functions/v1/ambient-voice-processor`;
      console.log('[AmbientVoice] 🌐 WebSocket URL:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[AmbientVoice] ✓ Connected to ambient voice processor');
        this.startAudioRecording();
      };

      this.ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('[AmbientVoice] 📨 Message:', data.type);

        // Handle audio playback
        if (data.type === 'response.audio.delta') {
          console.log('[AmbientVoice] 🎵 Audio chunk received:', data.delta?.length || 0, 'chars');
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          console.log('[AmbientVoice] 🔊 Adding', bytes.length, 'bytes to queue');
          await this.audioQueue?.addToQueue(bytes);
        } else if (data.type === 'response.audio.done') {
          console.log('[AmbientVoice] ✓ Audio response complete');
        } else if (data.type === 'response.function_call_arguments.done') {
          console.log('[AmbientVoice] ⚡ Function call:', data);
          this.handleFunctionCall(data);
        }

        // Forward all messages to handler
        this.onMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('[AmbientVoice] ✗ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('[AmbientVoice] 🔌 WebSocket closed');
        this.cleanup();
      };

    } catch (error) {
      console.error('[AmbientVoice] ✗ Failed to connect:', error);
      throw error;
    }
  }

  private async startAudioRecording() {
    try {
      console.log('[AmbientVoice] 🎤 Starting audio recording...');
      
      this.audioRecorder = new AudioRecorder((audioData) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const encoded = encodeAudioForAPI(audioData);
          
          // Only log occasionally to avoid spam
          if (Math.random() < 0.01) {
            console.log('[AmbientVoice] 📤 Sending audio:', audioData.length, 'samples →', encoded.length, 'base64 chars');
          }
          
          this.ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encoded
          }));
        }
      });

      await this.audioRecorder.start();
      this.isListening = true;
      this.onListeningChange(true);
      console.log('[AmbientVoice] ✓ Audio recording started');
    } catch (error) {
      console.error('[AmbientVoice] ✗ Failed to start audio recording:', error);
      throw error;
    }
  }

  private handleFunctionCall(data: any) {
    const { call_id, arguments: args } = data;
    const parsedArgs = JSON.parse(args);
    
    console.log('[AmbientVoice] 📋 Function call parsed:', parsedArgs);
    
    // Emit navigation events or documentation events
    this.onMessage({
      type: 'ambient_function_call',
      call_id,
      function: parsedArgs
    });
  }

  sendTextMessage(text: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[AmbientVoice] 💬 Sending text message:', text);
      
      const event = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text }]
        }
      };
      
      this.ws.send(JSON.stringify(event));
      this.ws.send(JSON.stringify({ type: 'response.create' }));
    }
  }

  disconnect() {
    console.log('[AmbientVoice] 🔌 Disconnecting...');
    this.cleanup();
  }

  private cleanup() {
    this.audioRecorder?.stop();
    this.audioRecorder = null;
    this.audioQueue?.clear();
    this.audioQueue = null;
    this.ws?.close();
    this.ws = null;
    this.audioContext?.close();
    this.audioContext = null;
    this.isListening = false;
    this.onListeningChange(false);
    console.log('[AmbientVoice] ✓ Cleanup complete');
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get listening() {
    return this.isListening;
  }
}
