import type { Photo } from '../../domain/types';
import { MAX_PHOTOS, MAX_SESSION_PIXELS } from './photos';

/** Keep one owned image per content hash, but one reference per selected occurrence. */
export function mergePhotos(existing: Photo[], incoming: Photo[]) {
  const added: Photo[] = [],
    assignments: Photo[] = [],
    discarded = new Set<Photo>();
  const byId = new Map(existing.map((photo) => [photo.id, photo]));
  const byContent = new Map(
    existing.filter((photo) => photo.fingerprint).map((photo) => [photo.fingerprint!, photo]),
  );
  let pixels = existing.reduce((total, photo) => total + photo.width * photo.height, 0),
    limited = false;
  for (const photo of incoming) {
    const known =
      byId.get(photo.id) ?? (photo.fingerprint ? byContent.get(photo.fingerprint) : undefined);
    if (known) {
      assignments.push(known);
      if (known !== photo) discarded.add(photo);
      continue;
    }
    if (
      existing.length + added.length >= MAX_PHOTOS ||
      pixels + photo.width * photo.height > MAX_SESSION_PIXELS
    ) {
      discarded.add(photo);
      limited = true;
      continue;
    }
    added.push(photo);
    assignments.push(photo);
    pixels += photo.width * photo.height;
    byId.set(photo.id, photo);
    if (photo.fingerprint) byContent.set(photo.fingerprint, photo);
  }
  return { added, assignments, discarded: [...discarded], limited };
}
