import { notFound } from "next/navigation";
import { getPlaylistByUrn } from "@/lib/soundcloud";
import { PlaylistContent } from "@/components/playlist-content";

interface PlaylistPageProps {
  params: Promise<{ urn: string }>;
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { urn } = await params;
  const decodedUrn = decodeURIComponent(urn);
  const playlist = await getPlaylistByUrn(decodedUrn);

  if (!playlist) {
    notFound();
  }

  return <PlaylistContent playlist={playlist} />;
}
