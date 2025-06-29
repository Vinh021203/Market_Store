// utils/audioUtils.ts - Enhanced version
export class AudioGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.log("Web Audio API not supported");
    }
  }

  // ✅ Âm thanh thanh toán thành công (Ting-ting)
  createSuccessSound = () => {
    if (!this.audioContext) return;

    const createTone = (
      frequency: number,
      startTime: number,
      duration: number,
      volume = 0.3,
    ) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      // Kết nối nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      // Cấu hình oscillator (tạo âm thanh)
      oscillator.type = "sine"; // Âm thanh mềm mại
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // Cấu hình volume (fade out)
      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      // Phát âm thanh
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = this.audioContext.currentTime;
    // Tạo melody "ting-ting-ting" như notification iPhone
    createTone(800, now, 0.15, 0.4); // Âm cao đầu tiên
    createTone(1000, now + 0.1, 0.15, 0.3); // Âm cao hơn
    createTone(1200, now + 0.2, 0.2, 0.25); // Âm cao nhất
  };

  // ✅ Âm thanh lỗi (Buzz sound)
  createErrorSound = () => {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Âm thanh lỗi - tần số thấp, harsh
    oscillator.type = "sawtooth"; // Âm thanh khó chịu hơn
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);

    // Volume pattern cho âm thanh warning
    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.6,
    );

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.6);
  };

  // ✅ Âm thanh notification nhẹ
  createNotificationSound = () => {
    if (!this.audioContext) return;

    const createBeep = (
      frequency: number,
      startTime: number,
      duration: number,
    ) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.type = "triangle"; // Âm thanh trung tính
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = this.audioContext.currentTime;
    createBeep(600, now, 0.1); // Single beep nhẹ
  };

  // ✅ Âm thanh click button
  createClickSound = () => {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.05,
    );

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.05);
  };

  // ✅ Âm thanh loading/processing
  createProcessingSound = () => {
    if (!this.audioContext) return;

    const createPulse = (frequency: number, startTime: number) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // Tạo hiệu ứng pulse
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.1);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.1);
    };

    const now = this.audioContext.currentTime;
    // Tạo 3 pulse liên tiếp
    createPulse(400, now);
    createPulse(500, now + 0.15);
    createPulse(600, now + 0.3);
  };

  // ✅ Âm thanh coin/money (cho payment)
  createCoinSound = () => {
    if (!this.audioContext) return;

    const createCoin = (
      frequency: number,
      startTime: number,
      duration: number,
    ) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.type = "sine";
      // Tạo hiệu ứng "rơi" của đồng xu
      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * 0.7,
        startTime + duration,
      );

      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = this.audioContext.currentTime;
    createCoin(1200, now, 0.3);
    createCoin(800, now + 0.1, 0.4);
  };

  // ✅ Cleanup method
  destroy = () => {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  };
}

// ✅ Singleton instance
export const audioGenerator = new AudioGenerator();

// ✅ Convenience functions
export const createSuccessSound = () => audioGenerator.createSuccessSound();
export const createErrorSound = () => audioGenerator.createErrorSound();
export const createNotificationSound = () =>
  audioGenerator.createNotificationSound();
export const createClickSound = () => audioGenerator.createClickSound();
export const createProcessingSound = () =>
  audioGenerator.createProcessingSound();
export const createCoinSound = () => audioGenerator.createCoinSound();
