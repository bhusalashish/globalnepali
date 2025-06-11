import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchYouTubeVideos, 
  fetchPopularVideos, 
  fetchChannelPlaylists,
  type Video,
  type Playlist 
} from '../../api/youtube';

interface ConfigError {
  message: string;
  isConfigError: true;
}

interface PaginatedState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  retryCount: number;
  hasConfigError: boolean;
  pageToken?: string;
  hasMore: boolean;
}

interface VideosState {
  latestVideos: PaginatedState<Video>;
  popularVideos: PaginatedState<Video>;
  playlists: PaginatedState<Playlist>;
}

const createInitialPaginatedState = (): PaginatedState<any> => ({
  items: [],
  loading: false,
  error: null,
  retryCount: 0,
  hasConfigError: false,
  hasMore: true
});

const initialState: VideosState = {
  latestVideos: createInitialPaginatedState(),
  popularVideos: createInitialPaginatedState(),
  playlists: createInitialPaginatedState(),
};

// Maximum number of retries for each section
const MAX_RETRIES = 3;

export const fetchLatestVideos = createAsyncThunk<
  { items: Video[]; nextPageToken?: string },
  { pageToken?: string } | undefined,
  { rejectValue: ConfigError | string }
>(
  'videos/fetchLatest',
  async (params, { getState, rejectWithValue }) => {
    const state = getState() as { videos: VideosState };
    
    if (state.videos.latestVideos.hasConfigError || state.videos.latestVideos.retryCount >= MAX_RETRIES) {
      return rejectWithValue('Maximum retries reached or configuration error');
    }

    try {
      const pageToken = params?.pageToken;
      return await fetchYouTubeVideos(9, pageToken);
    } catch (error) {
      if (error instanceof Error && error.name === 'YouTubeConfigError') {
        return rejectWithValue({ message: error.message, isConfigError: true });
      }
      throw error;
    }
  }
);

export const fetchPopular = createAsyncThunk<
  { items: Video[]; nextPageToken?: string },
  { pageToken?: string } | undefined,
  { rejectValue: ConfigError | string }
>(
  'videos/fetchPopular',
  async (params, { getState, rejectWithValue }) => {
    const state = getState() as { videos: VideosState };
    
    if (state.videos.popularVideos.hasConfigError || state.videos.popularVideos.retryCount >= MAX_RETRIES) {
      return rejectWithValue('Maximum retries reached or configuration error');
    }

    try {
      const pageToken = params?.pageToken;
      return await fetchPopularVideos(9, pageToken);
    } catch (error) {
      if (error instanceof Error && error.name === 'YouTubeConfigError') {
        return rejectWithValue({ message: error.message, isConfigError: true });
      }
      throw error;
    }
  }
);

export const fetchPlaylists = createAsyncThunk<
  { items: Playlist[]; nextPageToken?: string },
  { pageToken?: string } | undefined,
  { rejectValue: ConfigError | string }
>(
  'videos/fetchPlaylists',
  async (params, { getState, rejectWithValue }) => {
    const state = getState() as { videos: VideosState };
    
    if (state.videos.playlists.hasConfigError || state.videos.playlists.retryCount >= MAX_RETRIES) {
      return rejectWithValue('Maximum retries reached or configuration error');
    }

    try {
      const pageToken = params?.pageToken;
      return await fetchChannelPlaylists(9, pageToken);
    } catch (error) {
      if (error instanceof Error && error.name === 'YouTubeConfigError') {
        return rejectWithValue({ message: error.message, isConfigError: true });
      }
      throw error;
    }
  }
);

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    resetRetryCount: (state, action: { payload: 'latestVideos' | 'popularVideos' | 'playlists' }) => {
      state[action.payload].retryCount = 0;
      state[action.payload].hasConfigError = false;
    },
    resetList: (state, action: { payload: 'latestVideos' | 'popularVideos' | 'playlists' }) => {
      state[action.payload].items = [];
      state[action.payload].pageToken = undefined;
      state[action.payload].hasMore = true;
      state[action.payload].loading = false;
      state[action.payload].error = null;
    }
  },
  extraReducers: (builder) => {
    // Latest Videos
    builder
      .addCase(fetchLatestVideos.pending, (state) => {
        state.latestVideos.loading = true;
        state.latestVideos.error = null;
      })
      .addCase(fetchLatestVideos.fulfilled, (state, action) => {
        state.latestVideos.loading = false;
        state.latestVideos.items = state.latestVideos.items.concat(action.payload.items);
        state.latestVideos.pageToken = action.payload.nextPageToken;
        state.latestVideos.hasMore = !!action.payload.nextPageToken;
        state.latestVideos.retryCount = 0;
        state.latestVideos.hasConfigError = false;
      })
      .addCase(fetchLatestVideos.rejected, (state, action) => {
        state.latestVideos.loading = false;
        if (typeof action.payload === 'object' && action.payload && 'isConfigError' in action.payload) {
          state.latestVideos.error = (action.payload as ConfigError).message;
          state.latestVideos.hasConfigError = true;
        } else {
          state.latestVideos.error = action.error.message || 'Failed to fetch videos';
          state.latestVideos.retryCount += 1;
        }
      })
      // Popular Videos
      .addCase(fetchPopular.pending, (state) => {
        state.popularVideos.loading = true;
        state.popularVideos.error = null;
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.popularVideos.loading = false;
        state.popularVideos.items = state.popularVideos.items.concat(action.payload.items);
        state.popularVideos.pageToken = action.payload.nextPageToken;
        state.popularVideos.hasMore = !!action.payload.nextPageToken;
        state.popularVideos.retryCount = 0;
        state.popularVideos.hasConfigError = false;
      })
      .addCase(fetchPopular.rejected, (state, action) => {
        state.popularVideos.loading = false;
        if (typeof action.payload === 'object' && action.payload && 'isConfigError' in action.payload) {
          state.popularVideos.error = (action.payload as ConfigError).message;
          state.popularVideos.hasConfigError = true;
        } else {
          state.popularVideos.error = action.error.message || 'Failed to fetch popular videos';
          state.popularVideos.retryCount += 1;
        }
      })
      // Playlists
      .addCase(fetchPlaylists.pending, (state) => {
        state.playlists.loading = true;
        state.playlists.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.playlists.loading = false;
        state.playlists.items = state.playlists.items.concat(action.payload.items);
        state.playlists.pageToken = action.payload.nextPageToken;
        state.playlists.hasMore = !!action.payload.nextPageToken;
        state.playlists.retryCount = 0;
        state.playlists.hasConfigError = false;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.playlists.loading = false;
        if (typeof action.payload === 'object' && action.payload && 'isConfigError' in action.payload) {
          state.playlists.error = (action.payload as ConfigError).message;
          state.playlists.hasConfigError = true;
        } else {
          state.playlists.error = action.error.message || 'Failed to fetch playlists';
          state.playlists.retryCount += 1;
        }
      });
  },
});

export const { resetRetryCount, resetList } = videosSlice.actions;
export default videosSlice.reducer; 