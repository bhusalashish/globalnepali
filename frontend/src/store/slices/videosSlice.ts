import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchYouTubeVideos, 
  fetchPopularVideos, 
  fetchChannelPlaylists,
  type Video,
  type Playlist 
} from '../../api/youtube';

interface VideosState {
  allVideos: {
    items: Video[];
    loading: boolean;
    error: string | null;
  };
  popularVideos: {
    items: Video[];
    loading: boolean;
    error: string | null;
  };
  playlists: {
    items: Playlist[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: VideosState = {
  allVideos: { items: [], loading: false, error: null },
  popularVideos: { items: [], loading: false, error: null },
  playlists: { items: [], loading: false, error: null },
};

export const fetchAllVideos = createAsyncThunk(
  'videos/fetchAll',
  async () => await fetchYouTubeVideos(9)
);

export const fetchPopular = createAsyncThunk(
  'videos/fetchPopular',
  async () => await fetchPopularVideos(9)
);

export const fetchPlaylists = createAsyncThunk(
  'videos/fetchPlaylists',
  async () => await fetchChannelPlaylists(6)
);

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {},
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
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.allVideos.loading = false;
        state.allVideos.error = action.error.message || 'Failed to fetch videos';
      })
      // Popular Videos
      .addCase(fetchPopular.pending, (state) => {
        state.popularVideos.loading = true;
        state.popularVideos.error = null;
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.popularVideos.loading = false;
        state.popularVideos.items = action.payload;
      })
      .addCase(fetchPopular.rejected, (state, action) => {
        state.popularVideos.loading = false;
        state.popularVideos.error = action.error.message || 'Failed to fetch popular videos';
      })
      // Playlists
      .addCase(fetchPlaylists.pending, (state) => {
        state.playlists.loading = true;
        state.playlists.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.playlists.loading = false;
        state.playlists.items = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.playlists.loading = false;
        state.playlists.error = action.error.message || 'Failed to fetch playlists';
      });
  },
});

export default videosSlice.reducer; 