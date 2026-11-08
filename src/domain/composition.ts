import { defaultTransform, type Composition, type Design, type Photo } from './types';

export function changeFrame(
  previous: Design | null,
  next: Design,
  composition: Composition,
): Composition {
  if (previous?.layout.id === next.layout.id) return composition;
  const ids =
    previous?.layout.slots.flatMap((slot) =>
      composition[slot.id] ? [composition[slot.id].photoId] : [],
    ) ?? [];
  return Object.fromEntries(
    next.layout.slots.flatMap((slot, index) =>
      ids[index] ? [[slot.id, { photoId: ids[index], transform: defaultTransform() }]] : [],
    ),
  );
}
export function assignToEmpty(
  frame: Design,
  composition: Composition,
  photos: Pick<Photo, 'id'>[],
): Composition {
  const next = { ...composition };
  const empty = frame.layout.slots.filter((slot) => !next[slot.id]);
  photos.forEach((photo, index) => {
    if (empty[index]) next[empty[index].id] = { photoId: photo.id, transform: defaultTransform() };
  });
  return next;
}
