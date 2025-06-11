declare global {
  interface Window {
    env: {
      REACT_APP_YOUTUBE_API_KEY: string;
    }
  }
}

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = '@globalnepalimedia';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
}

interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
  description: string;
}

export const fetchPopularVideos = async (): Promise<YouTubeVideo[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=3&order=viewCount&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const statsData = await statsResponse.json();

    return data.items.map((item: any, index: number) => {
      const stats = statsData.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        views: formatViewCount(stats.statistics.viewCount),
        duration: formatDuration(stats.contentDetails.duration),
      };
    });
  } catch (error) {
    console.error('Error fetching popular videos:', error);
    return [];
  }
};

export const fetchPlaylists = async (): Promise<YouTubePlaylist[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      videoCount: item.contentDetails.itemCount,
      description: item.snippet.description,
    }));
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

export const fetchPlaylistVideos = async (playlistId: string): Promise<YouTubeVideo[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    const videoIds = data.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const statsData = await statsResponse.json();

    return data.items.map((item: any, index: number) => {
      const stats = statsData.items[index];
      return {
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        views: formatViewCount(stats.statistics.viewCount),
        duration: formatDuration(stats.contentDetails.duration),
      };
    });
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    return [];
  }
};

// Helper functions
const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return viewCount;
};

const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = '';
  if (hours) {
    result += `${hours}:`;
    result += `${minutes.padStart(2, '0')}:`;
  } else if (minutes) {
    result += `${minutes}:`;
  } else {
    result += '0:';
  }
  result += seconds.padStart(2, '0');

  return result;
}; 