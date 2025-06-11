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

interface VideosState {
  allVideos: {
    items: Video[];
    loading: boolean;
    error: string | null;
    retryCount: number;
    hasConfigError: boolean;
  };
  popularVideos: {
    items: Video[];
    loading: boolean;
    error: string | null;
    retryCount: number;
    hasConfigError: boolean;
  };
  playlists: {
    items: Playlist[];
    loading: boolean;
    error: string | null;
    retryCount: number;
    hasConfigError: boolean;
  };
}

const initialState: VideosState = {
  allVideos: { items: [], loading: false, error: null, retryCount: 0, hasConfigError: false },
  popularVideos: { items: [], loading: false, error: null, retryCount: 0, hasConfigError: false },
  playlists: { items: [], loading: false, error: null, retryCount: 0, hasConfigError: false },
};

// Maximum number of retries for each section
const MAX_RETRIES = 3;

export const fetchAllVideos = createAsyncThunk<Video[], void, { rejectValue: ConfigError | string }>(
  'videos/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { videos: VideosState };
    
    // Don't retry if we've hit config errors or max retries
    if (state.videos.allVideos.hasConfigError || state.videos.allVideos.retryCount >= MAX_RETRIES) {
      return rejectWithValue('Maximum retries reached or configuration error');
    }

    try {
      return await fetchYouTubeVideos(9);
    } catch (error) {
      // Check if error is an Error object with a name property
      if (error instanceof Error && error.name === 'YouTubeConfigError') {
        return rejectWithValue({ message: error.message, isConfigError: true });
      }
      throw error;
    }
  }
);

export const fetchPopular = createAsyncThunk<Video[], void, { rejectValue: ConfigError | string }>(
  'videos/fetchPopular',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { videos: VideosState };
    
    if (state.videos.popularVideos.hasConfigError || state.videos.popularVideos.retryCount >= MAX_RETRIES) {
      return rejectWithValue('Maximum retries reached or configuration error');
    }

    try {
      return await fetchPopularVideos(9);
    } catch (error) {
      if (error instanceof Error && error.name === 'YouTubeConfigError') {
        return rejectWithValue({ message: error.message, isConfigError: true });
      }
      throw error;
    }
  }
);

export const fetchPlaylists = createAsyncThunk<Playlist[], void, { rejectValue: ConfigError | string }>(
  'videos/fetchPlaylists',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { videos: VideosState };
    
    if (state.videos.playlists.hasConfigError || state.videos.playlists.retryCount >= MAX_RETRIES) {
      return rejectWithValue('Maximum retries reached or configuration error');
    }

    try {
      return await fetchChannelPlaylists(6);
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
    resetRetryCount: (state, action: { payload: 'allVideos' | 'popularVideos' | 'playlists' }) => {
      state[action.payload].retryCount = 0;
      state[action.payload].hasConfigError = false;
    }
  },
  extraReducers: (builder) => {
    // All Videos
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.allVideos.loading = true;
        state.allVideos.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.allVideos.loading = false;
        state.allVideos.items = action.payload;
        state.allVideos.retryCount = 0;
        state.allVideos.hasConfigError = false;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.allVideos.loading = false;
        if (typeof action.payload === 'object' && action.payload && 'isConfigError' in action.payload) {
          state.allVideos.error = (action.payload as ConfigError).message;
          state.allVideos.hasConfigError = true;
        } else {
          state.allVideos.error = action.error.message || 'Failed to fetch videos';
          state.allVideos.retryCount += 1;
        }
      })
      // Popular Videos
      .addCase(fetchPopular.pending, (state) => {
        state.popularVideos.loading = true;
        state.popularVideos.error = null;
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.popularVideos.loading = false;
        state.popularVideos.items = action.payload;
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
        state.playlists.items = action.payload;
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

export const { resetRetryCount } = videosSlice.actions;
export default videosSlice.reducer; 