export type MusicCollection =
  | 'lofi'
  | 'english-songs'
  | 'english-songs-instrumental'
  | 'kpop-instrumental'
  | 'kpop-songs';

export type NoiseKind = 'rain' | 'brown' | 'pink';

export interface AudioTrack {
  id: string;
  label: string;
  src: string;
}

export interface MusicTrack extends AudioTrack {
  kind: 'music';
  collection: MusicCollection;
  collectionLabel: string;
}

export interface NoiseTrack extends AudioTrack {
  kind: 'noise';
  noiseKind: NoiseKind;
}

const audioModules = import.meta.glob('../../assets/audio/**/*.{mp3,wav,m4a,ogg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const collectionLabels: Record<MusicCollection, string> = {
  lofi: 'Lo-fi',
  'english-songs': 'English songs',
  'english-songs-instrumental': 'English instrumentals',
  'kpop-instrumental': 'K-pop instrumentals',
  'kpop-songs': 'K-pop songs',
};

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanFileLabel(path: string) {
  const filename = path.split('/').at(-1) ?? path;
  return filename
    .replace(/\.(mp3|wav|m4a|ogg)$/i, '')
    .replace(/\(chosic\.com\)/gi, '')
    .replace(/[-_ ]*chosic\.com_?/gi, '')
    .replace(/\s*\(\d+\)$/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectNoiseKind(path: string): NoiseKind | undefined {
  const lower = path.toLowerCase();
  if (lower.includes('rain')) return 'rain';
  if (lower.includes('brown')) return 'brown';
  if (lower.includes('pink')) return 'pink';
  return undefined;
}

function noiseLabel(kind: NoiseKind) {
  if (kind === 'rain') return 'Soft rain';
  if (kind === 'brown') return 'Brown noise';
  return 'Pink noise';
}

const discoveredMusic: MusicTrack[] = [];
const discoveredNoise: NoiseTrack[] = [];

for (const [path, src] of Object.entries(audioModules)) {
  const parts = path.split('/');
  const folder = parts.at(-2);

  if (folder === 'noise') {
    const noiseKind = detectNoiseKind(path);
    if (!noiseKind) continue;
    discoveredNoise.push({
      id: `noise-${noiseKind}-${slug(cleanFileLabel(path))}`,
      kind: 'noise',
      label: noiseLabel(noiseKind),
      noiseKind,
      src,
    });
    continue;
  }

  if (!folder || !(folder in collectionLabels)) continue;
  const collection = folder as MusicCollection;
  const label = cleanFileLabel(path);
  discoveredMusic.push({
    id: `music-${collection}-${slug(label)}`,
    kind: 'music',
    label,
    collection,
    collectionLabel: collectionLabels[collection],
    src,
  });
}

const uniqueMusic = new Map<string, MusicTrack>();
for (const track of [...discoveredMusic].sort((a, b) => a.label.localeCompare(b.label))) {
  const key = track.label.toLowerCase();
  if (!uniqueMusic.has(key)) uniqueMusic.set(key, track);
}

export const musicTracks = [...uniqueMusic.values()];
export const noiseTracks = [...discoveredNoise].sort((a, b) => a.label.localeCompare(b.label));

export function findMusicTrack(id: string | null | undefined) {
  return musicTracks.find((track) => track.id === id);
}

export function findNoiseTrack(id: string | null | undefined) {
  const exact = noiseTracks.find((track) => track.id === id);
  if (exact) return exact;

  const legacyKinds: Record<string, NoiseKind> = {
    rain: 'rain',
    'brown-noise': 'brown',
    brown: 'brown',
    'pink-noise': 'pink',
    pink: 'pink',
  };
  const kind = id ? legacyKinds[id] : undefined;
  return kind ? noiseTracks.find((track) => track.noiseKind === kind) : undefined;
}
