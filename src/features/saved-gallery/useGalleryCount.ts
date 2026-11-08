import { useEffect, useState } from 'react';
import { GALLERY_CHANGED, listProjects } from './storage';

export function useGalleryCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    let sequence = 0;
    let timer: number | undefined;
    const update = async () => {
      const current = ++sequence;
      clearTimeout(timer);
      try {
        const projects = await listProjects();
        if (!alive || current !== sequence) return;
        setCount(projects.length);
        if (projects.length) {
          const next = Math.min(...projects.map((project) => project.expiresAt));
          timer = window.setTimeout(() => void update(), Math.max(1, next - Date.now()));
        }
      } catch {
        if (alive && current === sequence) setCount(null);
      }
    };
    const refresh = () => {
      void update();
    };
    const visible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const channel =
      typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(GALLERY_CHANGED) : null;
    if (channel) channel.onmessage = refresh;
    window.addEventListener(GALLERY_CHANGED, refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', visible);
    refresh();
    return () => {
      alive = false;
      clearTimeout(timer);
      channel?.close();
      window.removeEventListener(GALLERY_CHANGED, refresh);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', visible);
    };
  }, []);
  return count;
}
