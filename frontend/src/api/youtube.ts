import { withRetry } from '../utils/retry';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

// Custom error for API configuration issues
export class YouTubeConfigError extends Error {
  isRetryable = false;
  constructor(message: string) {
    super(message);
    this.name = 'YouTubeConfigError';
  }
}

// Validate API configuration
function validateConfig() {
  if (!API_KEY) {
    throw new YouTubeConfigError('YouTube API key is missing. Please check your environment variables.');
  }
  if (!CHANNEL_ID) {
    throw new YouTubeConfigError('YouTube Channel ID is missing. Please check your environment variables.');
  }
}

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

export interface YouTubeResponse<T> {
  items: T[];
  nextPageToken?: string;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    
    // Handle specific YouTube API errors
    if (data?.error?.code === 403) {
      throw new YouTubeConfigError('Invalid YouTube API key. Please check your configuration.');
    }
    if (data?.error?.code === 404) {
      throw new YouTubeConfigError('YouTube channel not found. Please check your channel ID.');
    }
    
    const error = new Error(data?.error?.message || 'Failed to fetch from YouTube API');
    error.isRetryable = response.status >= 500 || response.status === 429;
    throw error;
  }
  return response.json();
}

export const fetchYouTubeVideos = async (maxResults: number = 9, pageToken?: string): Promise<YouTubeResponse<Video>> => {
  try {
    const tokenParam = pageToken ? `&pageToken=${pageToken}` : '';
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video${tokenParam}&key=${API_KEY}`
    );
    const data = await handleResponse(response);

    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const statsData = await handleResponse(statsResponse);

    return {
      items: data.items.map((item: any, index: number) => {
        const stats = statsData.items[index];
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          publishDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
          views: formatViewCount(stats.statistics.viewCount),
          duration: formatDuration(stats.contentDetails.duration),
        };
      }),
      nextPageToken: data.nextPageToken
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('API key')) {
      const configError = new Error('YouTube API key not configured');
      configError.name = 'YouTubeConfigError';
      throw configError;
    }
    throw error;
  }
};

export const fetchPopularVideos = async (maxResults: number = 9, pageToken?: string): Promise<YouTubeResponse<Video>> => {
  try {
    const tokenParam = pageToken ? `&pageToken=${pageToken}` : '';
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=viewCount&type=video${tokenParam}&key=${API_KEY}`
    );
    const data = await handleResponse(response);

    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const statsData = await handleResponse(statsResponse);

    return {
      items: data.items.map((item: any, index: number) => {
        const stats = statsData.items[index];
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          publishDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
          views: formatViewCount(stats.statistics.viewCount),
          duration: formatDuration(stats.contentDetails.duration),
        };
      }),
      nextPageToken: data.nextPageToken
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('API key')) {
      const configError = new Error('YouTube API key not configured');
      configError.name = 'YouTubeConfigError';
      throw configError;
    }
    throw error;
  }
};

export const fetchChannelPlaylists = async (maxResults: number = 9, pageToken?: string): Promise<YouTubeResponse<Playlist>> => {
  try {
    const tokenParam = pageToken ? `&pageToken=${pageToken}` : '';
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=${maxResults}${tokenParam}&key=${API_KEY}`
    );
    const data = await handleResponse(response);

    return {
      items: data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        videoCount: item.contentDetails.itemCount,
      })),
      nextPageToken: data.nextPageToken
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('API key')) {
      const configError = new Error('YouTube API key not configured');
      configError.name = 'YouTubeConfigError';
      throw configError;
    }
    throw error;
  }
};

export async function fetchPlaylistVideos(playlistId: string, maxResults = 9): Promise<Video[]> {
  validateConfig();
  
  return withRetry(async () => {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    return data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      publishDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
    }));
  });
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
