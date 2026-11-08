export type CaptureStatus =
  'ready' | 'countdown' | 'capturing' | 'interval' | 'paused' | 'reviewing';
export type CaptureState = {
  status: CaptureStatus;
  remaining: number;
  captured: number;
  total: number;
};
export class CaptureSession {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private token = 0;
  private inFlight = false;
  private resumeRequested = false;
  private settings = { count: 1, delay: 3, interval: 3 };
  state: CaptureState = { status: 'ready', remaining: 0, captured: 0, total: 1 };
  constructor(
    private capture: (isCurrent: () => boolean) => Promise<void>,
    private update: (state: CaptureState) => void,
    private failed: () => void,
  ) {}
  private emit(patch: Partial<CaptureState>) {
    this.state = { ...this.state, ...patch };
    this.update(this.state);
  }
  start(settings: { count: number; delay: number; interval: number }) {
    if (this.inFlight || ['countdown', 'capturing', 'interval'].includes(this.state.status)) return;
    this.cancelTimer();
    this.settings = {
      count: Math.max(1, Math.min(9, Math.round(settings.count))),
      delay: Math.max(0, Math.min(10, settings.delay)),
      interval: Math.max(1, Math.min(10, settings.interval)),
    };
    this.emit({ captured: 0, total: this.settings.count });
    this.schedule(this.settings.delay, 'countdown');
  }
  private cancelTimer() {
    this.token++;
    clearTimeout(this.timer);
  }
  private schedule(seconds: number, status: 'countdown' | 'interval') {
    const current = ++this.token;
    const deadline = performance.now() + seconds * 1000;
    const tick = () => {
      if (current !== this.token) return;
      const remaining = Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
      this.emit({ status, remaining });
      if (remaining === 0) void this.take(current);
      else this.timer = setTimeout(tick, Math.min(100, deadline - performance.now()));
    };
    tick();
  }
  private async take(current: number) {
    this.inFlight = true;
    const started = performance.now();
    this.emit({ status: 'capturing', remaining: 0 });
    try {
      await this.capture(() => current === this.token);
    } catch {
      if (current === this.token) {
        this.pause();
        this.failed();
      }
      return;
    } finally {
      this.inFlight = false;
      if (this.resumeRequested && this.state.status === 'paused') {
        this.resumeRequested = false;
        this.schedule(this.settings.delay, 'countdown');
      }
    }
    if (current !== this.token) return;
    const captured = this.state.captured + 1;
    this.emit({ captured });
    if (captured >= this.settings.count) this.emit({ status: 'reviewing' });
    else {
      const elapsed = (performance.now() - started) / 1000;
      this.schedule(
        elapsed < this.settings.interval
          ? this.settings.interval - elapsed
          : this.settings.interval,
        'interval',
      );
    }
  }
  pause() {
    if (!['countdown', 'capturing', 'interval'].includes(this.state.status)) return;
    this.cancelTimer();
    this.emit({ status: 'paused', remaining: 0 });
  }
  resume() {
    if (this.state.status !== 'paused') return;
    if (this.inFlight) this.resumeRequested = true;
    else this.schedule(this.settings.delay, 'countdown');
  }
  stop() {
    this.resumeRequested = false;
    this.cancelTimer();
    this.emit({ status: 'reviewing', remaining: 0 });
  }
  dispose() {
    this.resumeRequested = false;
    this.cancelTimer();
  }
}
