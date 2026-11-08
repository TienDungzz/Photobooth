import type { Composition, Design, Photo } from '../../domain/types';
import { frames, layouts, composeDesign } from '../frame-catalog/catalog';
import { releasePhoto } from '../photo-library';

export const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
export const GALLERY_CHANGED = 'photobooth-gallery-changed';
function notifyGallery() {
  window.dispatchEvent(new Event(GALLERY_CHANGED));
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(GALLERY_CHANGED);
    channel.postMessage('changed');
    channel.close();
  }
}
type StoredPhoto = { id: string; blob: Blob; fingerprint?: string };
export type SavedProject = {
  version: 1;
  id: string;
  savedAt: number;
  expiresAt: number;
  frameId: string;
  layoutId: string;
  composition: Composition;
  photos: StoredPhoto[];
  result: File;
};

async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('photobooth-gallery', 1);
    let finished = false;
    const timer = window.setTimeout(() => {
      finished = true;
      reject(new Error('Storage unavailable'));
    }, 5000);
    request.onupgradeneeded = () => request.result.createObjectStore('projects', { keyPath: 'id' });
    request.onerror = request.onblocked = () => {
      finished = true;
      clearTimeout(timer);
      reject(new Error('Storage unavailable'));
    };
    request.onsuccess = () => {
      clearTimeout(timer);
      if (finished) request.result.close();
      else {
        finished = true;
        resolve(request.result);
      }
    };
  });
}

async function transact<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const db = await database();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction('projects', mode);
      const timer = window.setTimeout(() => transaction.abort(), 10_000);
      let request: IDBRequest<T>;
      try {
        request = run(transaction.objectStore('projects'));
      } catch (cause) {
        clearTimeout(timer);
        transaction.abort();
        reject(cause);
        return;
      }
      transaction.oncomplete = () => {
        clearTimeout(timer);
        resolve(request.result);
      };
      transaction.onabort = transaction.onerror = () => {
        clearTimeout(timer);
        reject(transaction.error ?? new Error('Storage failed'));
      };
    });
  } finally {
    db.close();
  }
}

export async function listProjects(now = Date.now()): Promise<SavedProject[]> {
  const records = await transact<SavedProject[]>('readwrite', (store) => {
    const request = store.getAll();
    request.onsuccess = () => {
      for (const record of request.result as SavedProject[]) {
        if (record.version !== 1 || !Number.isFinite(record.expiresAt) || record.expiresAt <= now)
          store.delete(record.id);
      }
    };
    return request;
  });
  const active = records
    .filter((record) => record.version === 1 && record.expiresAt > now)
    .sort((a, b) => b.savedAt - a.savedAt);
  if (active.length !== records.length) notifyGallery();
  return active;
}

export async function saveProject(
  frame: Design,
  photos: Photo[],
  composition: Composition,
  result: File,
) {
  // Prune before writing; expiry is never extended by viewing the gallery.
  await listProjects();
  const storedPhotos = await Promise.all(
    photos.map(async (photo): Promise<StoredPhoto> => {
      let blob = photo.blob;
      if (!blob) {
        const response = await fetch(photo.url);
        if (!response.ok) throw new Error('Photo unavailable');
        blob = await response.blob();
      }
      return { id: photo.id, fingerprint: photo.fingerprint, blob };
    }),
  );
  const savedAt = Date.now();
  const outputHash = Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', await result.arrayBuffer())),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
  const snapshot = JSON.stringify({
    frameId: frame.id,
    layoutId: frame.layout.id,
    composition,
    photos: storedPhotos.map((photo) => ({ id: photo.id, fingerprint: photo.fingerprint })),
    outputHash,
  });
  const id = Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(snapshot))),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
  const record: SavedProject = {
    version: 1,
    id,
    savedAt,
    expiresAt: savedAt + RETENTION_MS,
    frameId: frame.id,
    layoutId: frame.layout.id,
    composition,
    photos: storedPhotos,
    result,
  };
  await transact('readwrite', (store) => store.put(record));
  notifyGallery();
}

export async function deleteProject(id: string) {
  await transact('readwrite', (store) => store.delete(id));
  notifyGallery();
}

export async function restoreProject(record: SavedProject) {
  if (record.expiresAt <= Date.now()) throw new Error('Expired');
  const frame = frames.find((item) => item.id === record.frameId);
  const layout = layouts.find((item) => item.id === record.layoutId);
  if (!frame || !layout) throw new Error('Design unavailable');
  const photos: Photo[] = [];
  try {
    for (const stored of record.photos) {
      const url = URL.createObjectURL(stored.blob);
      const image = new Image();
      image.src = url;
      try {
        await image.decode();
      } catch (cause) {
        URL.revokeObjectURL(url);
        throw cause;
      }
      photos.push({
        id: stored.id,
        fingerprint: stored.fingerprint,
        blob: stored.blob,
        url,
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    }
    return { frame: composeDesign(frame, layout), photos, composition: record.composition };
  } catch (cause) {
    photos.forEach(releasePhoto);
    throw cause;
  }
}
