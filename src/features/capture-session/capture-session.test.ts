import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaptureSession } from './capture-session';

describe('capture scheduler', () => {
  it('does not commit an in-flight frame after cancellation', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    let finish: (() => void) | undefined;
    let committed = 0;
    const session = new CaptureSession(
      async (isCurrent) => {
        await new Promise<void>((resolve) => {
          finish = resolve;
        });
        if (isCurrent()) committed++;
      },
      () => {},
      () => {},
    );
    session.start({ count: 2, delay: 0, interval: 1 });
    session.stop();
    finish?.();
    await vi.advanceTimersByTimeAsync(10000);
    expect(committed).toBe(0);
    expect(session.state.status).toBe('reviewing');
    session.dispose();
  });
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] }));
  afterEach(() => vi.useRealTimers());
  it('captures at 5,8,11,14 seconds without duplicate starts', async () => {
    const times: number[] = [];
    const capture = vi.fn(async () => {
      times.push(performance.now());
    });
    const session = new CaptureSession(
      capture,
      () => {},
      () => {},
    );
    session.start({ count: 4, delay: 5, interval: 3 });
    session.start({ count: 4, delay: 5, interval: 3 });
    await vi.advanceTimersByTimeAsync(14000);
    expect(times).toEqual([5000, 8000, 11000, 14000]);
    expect(session.state.status).toBe('reviewing');
    session.dispose();
  });
  it('zero delay captures once immediately', async () => {
    const capture = vi.fn(async () => {});
    const session = new CaptureSession(
      capture,
      () => {},
      () => {},
    );
    session.start({ count: 1, delay: 0, interval: 1 });
    await vi.advanceTimersByTimeAsync(0);
    expect(capture).toHaveBeenCalledTimes(1);
    expect(session.state.status).toBe('reviewing');
  });
  it('cancel after two shots prevents the third', async () => {
    const capture = vi.fn(async () => {});
    const session = new CaptureSession(
      capture,
      () => {},
      () => {},
    );
    session.start({ count: 4, delay: 1, interval: 1 });
    await vi.advanceTimersByTimeAsync(2000);
    session.stop();
    await vi.advanceTimersByTimeAsync(10000);
    expect(capture).toHaveBeenCalledTimes(2);
    expect(session.state.captured).toBe(2);
  });
  it('pause cancels deadline and resume starts a new countdown', async () => {
    const capture = vi.fn(async () => {});
    const session = new CaptureSession(
      capture,
      () => {},
      () => {},
    );
    session.start({ count: 2, delay: 3, interval: 1 });
    await vi.advanceTimersByTimeAsync(1000);
    session.pause();
    await vi.advanceTimersByTimeAsync(10000);
    expect(capture).not.toHaveBeenCalled();
    session.resume();
    await vi.advanceTimersByTimeAsync(2999);
    expect(capture).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(capture).toHaveBeenCalledTimes(1);
    session.dispose();
  });
  it('failed capture pauses instead of retrying in a loop', async () => {
    const failed = vi.fn();
    const session = new CaptureSession(
      async () => {
        throw new Error('Disconnected');
      },
      () => {},
      failed,
    );
    session.start({ count: 9, delay: 0, interval: 1 });
    await vi.advanceTimersByTimeAsync(10000);
    expect(session.state.status).toBe('paused');
    expect(failed).toHaveBeenCalledTimes(1);
  });
});
