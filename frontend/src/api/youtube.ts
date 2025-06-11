const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishDate: string;
  duration?: string;
  views?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
}

export async function fetchYouTubeVideos(maxResults = 9): Promise<Video[]> {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch YouTube videos");
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    publishDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
  }));
}

export async function fetchPopularVideos(maxResults = 9): Promise<Video[]> {
  // First get video IDs
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=id&maxResults=${maxResults}&type=video&order=viewCount`;
  
  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) throw new Error("Failed to fetch popular videos");
  
  const searchData = await searchResponse.json();
  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
  
  // Then get full video details including statistics
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`;
  
  const videosResponse = await fetch(videosUrl);
  if (!videosResponse.ok) throw new Error("Failed to fetch video details");
  
  const videosData = await videosResponse.json();
  return videosData.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    publishDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
    views: formatViewCount(item.statistics.viewCount),
    duration: formatDuration(item.contentDetails.duration),
  }));
}

export async function fetchChannelPlaylists(maxResults = 6): Promise<Playlist[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,contentDetails&maxResults=${maxResults}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch playlists");
  
  const data = await response.json();
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high.url,
    videoCount: item.contentDetails.itemCount,
  }));
}

export async function fetchPlaylistVideos(playlistId: string, maxResults = 9): Promise<Video[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch playlist videos");
  
  const data = await response.json();
  return data.items.map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
    publishDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
  }));
}

// Utility functions
function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return count;
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '00:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  const parts = [
    hours || null,
    minutes.padStart(2, '0') || '00',
    seconds.padStart(2, '0') || '00'
  ].filter(Boolean);

  return parts.join(':');
}
