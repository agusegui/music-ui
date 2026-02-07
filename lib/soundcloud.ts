import "server-only";
import type { SCTrack, SCPlaylist } from "@/types/soundcloud";
import { PLAYLIST_URLS } from "./playlists.config";

const API_BASE = "https://api-v2.soundcloud.com";
const CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID!;

// --- Low-level helpers ---

async function scFetch<T>(url: string, revalidate = 3600): Promise<T> {
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}client_id=${CLIENT_ID}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`SoundCloud API ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function resolveUrl(url: string) {
  return scFetch<{ kind: string; id: number; [key: string]: unknown }>(
    `${API_BASE}/resolve?url=${encodeURIComponent(url)}`,
  );
}

async function getPlaylist(id: number) {
  return scFetch<RawPlaylist>(`${API_BASE}/playlists/${id}`);
}

async function getTrack(id: number) {
  return scFetch<RawTrack>(`${API_BASE}/tracks/${id}`);
}

export async function getStreamUrl(
  transcodingUrl: string,
): Promise<{ url: string }> {
  return scFetch<{ url: string }>(transcodingUrl, 0);
}

// --- Raw API types (superset of what we expose) ---

interface RawUser {
  urn: string;
  username: string;
  avatar_url: string | null;
}

interface RawTranscoding {
  url: string;
  format: {
    protocol: "hls" | "progressive";
    mime_type: string;
  };
  quality: "sq" | "hq";
}

interface RawTrack {
  urn: string | null;
  id: number;
  title: string;
  duration: number;
  artwork_url: string | null;
  user: RawUser;
  media?: {
    transcodings: RawTranscoding[];
  };
  access?: string;
}

interface RawPlaylist {
  urn: string | null;
  id: number;
  title: string;
  artwork_url: string | null;
  track_count: number;
  tracks: RawTrack[];
  user: RawUser;
  is_album: boolean;
}

// --- Mappers ---

function mapTrack(raw: RawTrack): SCTrack {
  return {
    urn: raw.urn ?? `soundcloud:tracks:${raw.id}`,
    title: raw.title,
    duration: raw.duration,
    artwork_url: raw.artwork_url,
    user: {
      urn: raw.user.urn,
      username: raw.user.username,
      avatar_url: raw.user.avatar_url,
    },
    media: {
      transcodings: (raw.media?.transcodings ?? []).map((t) => ({
        url: t.url,
        format: { protocol: t.format.protocol, mime_type: t.format.mime_type },
        quality: t.quality,
      })),
    },
    access: (raw.access as SCTrack["access"]) ?? "playable",
  };
}

function mapPlaylist(raw: RawPlaylist): SCPlaylist {
  return {
    urn: raw.urn ?? `soundcloud:playlists:${raw.id}`,
    title: raw.title,
    artwork_url: raw.artwork_url,
    track_count: raw.track_count,
    tracks: raw.tracks.map(mapTrack),
    user: {
      urn: raw.user.urn,
      username: raw.user.username,
      avatar_url: raw.user.avatar_url,
    },
    is_album: raw.is_album,
  };
}

// --- Hydration (SoundCloud returns partial track objects in playlists) ---

async function hydrateTracklist(tracks: RawTrack[]): Promise<RawTrack[]> {
  const needsHydration = tracks.filter(
    (t) => !t.media || t.media.transcodings.length === 0,
  );

  if (needsHydration.length === 0) return tracks;

  const results = await Promise.allSettled(
    needsHydration.map((t) => getTrack(t.id)),
  );

  const hydrated = new Map<number, RawTrack>();
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      hydrated.set(needsHydration[i].id, result.value);
    }
  });

  return tracks.map((t) => hydrated.get(t.id) ?? t);
}

// --- Public API ---

export async function resolvePlaylistUrl(url: string): Promise<SCPlaylist> {
  const resolved = await resolveUrl(url);
  const raw = await getPlaylist(resolved.id);
  raw.tracks = await hydrateTracklist(raw.tracks);
  return mapPlaylist(raw);
}

export async function getPlaylistByUrn(
  urn: string,
): Promise<SCPlaylist | undefined> {
  // urn format: "soundcloud:playlists:123456"
  const match = urn.match(/soundcloud:playlists:(\d+)/);
  if (!match) return undefined;
  try {
    const raw = await getPlaylist(Number(match[1]));
    raw.tracks = await hydrateTracklist(raw.tracks);
    return mapPlaylist(raw);
  } catch {
    return undefined;
  }
}

export async function getAllPlaylists(): Promise<SCPlaylist[]> {
  const results = await Promise.allSettled(
    PLAYLIST_URLS.map(resolvePlaylistUrl),
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<SCPlaylist> => r.status === "fulfilled",
    )
    .map((r) => r.value);
}
