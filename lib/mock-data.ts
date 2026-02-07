import type { SCPlaylist, SCTrack, SCUser } from "@/types/soundcloud";

const userJade: SCUser = {
  urn: "soundcloud:users:1001",
  username: "Jade Robinson",
  avatar_url: null,
};

const userNova: SCUser = {
  urn: "soundcloud:users:1002",
  username: "Nova Synthesis",
  avatar_url: null,
};

const userEcho: SCUser = {
  urn: "soundcloud:users:1003",
  username: "Echo Chamber",
  avatar_url: null,
};

function track(
  id: number,
  title: string,
  user: SCUser,
  durationMs: number,
): SCTrack {
  return {
    urn: `soundcloud:tracks:${id}`,
    title,
    duration: durationMs,
    artwork_url: null,
    user,
    media: { transcodings: [] },
    access: "playable",
  };
}

const morningTapes: SCPlaylist = {
  urn: "soundcloud:playlists:2001",
  title: "Morning Tapes",
  artwork_url: null,
  track_count: 8,
  is_album: false,
  user: userJade,
  tracks: [
    track(3001, "Golden Hour", userJade, 234000),
    track(3002, "Soft Landing", userJade, 198000),
    track(3003, "Window Light", userJade, 276000),
    track(3004, "Paper Cranes", userJade, 212000),
    track(3005, "Ceramic", userJade, 185000),
    track(3006, "Daybreak", userJade, 248000),
    track(3007, "Terrace", userJade, 301000),
    track(3008, "Slow Dissolve", userJade, 267000),
  ],
};

const digitalDreams: SCPlaylist = {
  urn: "soundcloud:playlists:2002",
  title: "Digital Dreams",
  artwork_url: null,
  track_count: 6,
  is_album: true,
  user: userNova,
  tracks: [
    track(3101, "Boot Sequence", userNova, 195000),
    track(3102, "Neon Drift", userNova, 320000),
    track(3103, "Data Stream", userNova, 258000),
    track(3104, "Pulse Width", userNova, 283000),
    track(3105, "Synthetic Memory", userNova, 347000),
    track(3106, "Shutdown Lullaby", userNova, 224000),
  ],
};

const deepCuts: SCPlaylist = {
  urn: "soundcloud:playlists:2003",
  title: "Deep Cuts",
  artwork_url: null,
  track_count: 10,
  is_album: false,
  user: userEcho,
  tracks: [
    track(3201, "Undertow", userEcho, 265000),
    track(3202, "Marble Halls", userEcho, 312000),
    track(3203, "Fathom", userEcho, 198000),
    track(3204, "Cavern", userEcho, 275000),
    track(3205, "Silt", userEcho, 187000),
    track(3206, "Pressure Point", userEcho, 342000),
    track(3207, "Abyssal Plain", userEcho, 290000),
    track(3208, "Thermal Vent", userEcho, 228000),
    track(3209, "Benthic", userEcho, 315000),
    track(3210, "Resurface", userEcho, 256000),
  ],
};

export const playlists: SCPlaylist[] = [morningTapes, digitalDreams, deepCuts];

export function getPlaylistByUrn(urn: string): SCPlaylist | undefined {
  return playlists.find((p) => p.urn === urn);
}
