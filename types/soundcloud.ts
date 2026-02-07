export interface SCUser {
  urn: string;
  username: string;
  avatar_url: string | null;
}

export interface SCTranscoding {
  url: string;
  format: {
    protocol: "hls" | "progressive";
    mime_type: string;
  };
  quality: "sq" | "hq";
}

export interface SCTrack {
  urn: string;
  title: string;
  duration: number; // milliseconds
  artwork_url: string | null;
  user: SCUser;
  media: {
    transcodings: SCTranscoding[];
  };
  access: "playable" | "preview" | "blocked";
}

export interface SCPlaylist {
  urn: string;
  title: string;
  artwork_url: string | null;
  track_count: number;
  tracks: SCTrack[];
  user: SCUser;
  is_album: boolean;
}
