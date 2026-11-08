export type Locale = 'vi' | 'en';
export type Theme = 'light' | 'dark' | 'system';
export type Category = 'single' | 'strip' | 'grid' | 'editorial' | 'scrapbook';
export type Style = 'minimal' | 'pastel' | 'film';
export type Slot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  mask:
    | 'rect'
    | 'rounded'
    | 'ellipse'
    | 'heart'
    | 'star'
    | 'arch'
    | 'stamp'
    | 'blob'
    | 'cutout'
    | 'torn'
    | 'apple'
    | 'scallop'
    | 'bear'
    | 'side-left'
    | 'side-right'
    | 'wavy';
  treatment?:
    | 'browser'
    | 'polaroid'
    | 'ticket'
    | 'lace'
    | 'filigree'
    | 'star-curtain'
    | 'glow-hearts'
    | 'glow-flowers';
};
export type Layout = {
  id: string;
  name: { vi: string; en: string };
  category: Category;
  width: number;
  height: number;
  slots: Slot[];
};
export type Frame = {
  artwork?: {
    atlas?: string;
    title: string;
    subtitle: string;
    theme:
      | 'coquette'
      | 'chrome'
      | 'memo'
      | 'cinema'
      | 'ballet'
      | 'herbarium'
      | 'seaside'
      | 'cherry'
      | 'afterhours'
      | 'playdate'
      | 'zine'
      | 'nocturne'
      | 'halloween'
      | 'vow'
      | 'passport'
      | 'mixtape'
      | 'poster'
      | 'comic'
      | 'vinyl'
      | 'blueprint'
      | 'receipt'
      | 'quilt'
      | 'orbit'
      | 'picnic-tiger'
      | 'punk-star'
      | 'candy-sky'
      | 'field-notes'
      | 'luminous'
      | 'denim-bunny'
      | 'marquee'
      | 'ivory-night'
      | 'cloud-curtain'
      | 'rose-haze'
      | 'firefly-bloom';
  };
  id: string;
  name: { vi: string; en: string };
  pattern:
    | 'garden'
    | 'lace'
    | 'scrapbook'
    | 'stars'
    | 'film'
    | 'plain'
    | 'hearts'
    | 'bows'
    | 'tulips'
    | 'daisies'
    | 'sakura'
    | 'cherries'
    | 'leaves'
    | 'vines'
    | 'moon'
    | 'clouds'
    | 'sun'
    | 'rainbow'
    | 'confetti'
    | 'balloons'
    | 'checks'
    | 'dots'
    | 'stripes'
    | 'postage'
    | 'artdeco'
    | 'diamonds'
    | 'waves'
    | 'scallops';
  collection:
    'romance' | 'botanical' | 'celebration' | 'celestial' | 'retro' | 'geometric' | 'minimal';
  color: 'cream' | 'pink' | 'green' | 'blue' | 'purple' | 'dark';
  variant?: 'classic' | 'scattered' | 'corners';
  style: Style;
  background: string;
  ink: string;
  accent: string;
  stamp: string;
};
// A renderable design combines two independent selections. This is not a catalog frame.
export type Design = Frame & { layout: Layout };
export type Photo = {
  blob?: Blob;
  id: string;
  fingerprint?: string;
  url: string;
  image: HTMLImageElement;
  width: number;
  height: number;
};
export type Transform = { zoom: number; x: number; y: number; rotation: number; mirrored: boolean };
export type Assignment = { photoId: string; transform: Transform };
export type Composition = Record<string, Assignment>;
export const defaultTransform = (): Transform => ({
  zoom: 1,
  x: 0,
  y: 0,
  rotation: 0,
  mirrored: false,
});
