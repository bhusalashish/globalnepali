import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  IconButton,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { PlayCircle, YouTube, PlaylistPlay, Refresh } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchAllVideos, fetchPopular, fetchPlaylists, resetRetryCount } from '../../store/slices/videosSlice';
import type { Video, Playlist } from '../../api/youtube';

const VideosPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    allVideos,
    popularVideos,
    playlists,
  } = useSelector((state: RootState) => state.videos);

  useEffect(() => {
    // Load data based on current tab
    switch (currentTab) {
      case 0:
        if (allVideos.items.length === 0 && !allVideos.loading && !allVideos.hasConfigError && allVideos.retryCount < 3) {
          dispatch(fetchAllVideos());
        }
        break;
      case 1:
        if (playlists.items.length === 0 && !playlists.loading && !playlists.hasConfigError && playlists.retryCount < 3) {
          dispatch(fetchPlaylists());
        }
        break;
      case 2:
        if (popularVideos.items.length === 0 && !popularVideos.loading && !popularVideos.hasConfigError && popularVideos.retryCount < 3) {
          dispatch(fetchPopular());
        }
        break;
    }
  }, [currentTab, dispatch, allVideos.items.length, playlists.items.length, popularVideos.items.length, 
      allVideos.loading, playlists.loading, popularVideos.loading,
      allVideos.hasConfigError, playlists.hasConfigError, popularVideos.hasConfigError,
      allVideos.retryCount, playlists.retryCount, popularVideos.retryCount]);

  const handlePlayVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRetry = (section: 'allVideos' | 'popularVideos' | 'playlists') => {
    dispatch(resetRetryCount(section));
    switch (section) {
      case 'allVideos':
        dispatch(fetchAllVideos());
        break;
      case 'popularVideos':
        dispatch(fetchPopular());
        break;
      case 'playlists':
        dispatch(fetchPlaylists());
        break;
    }
  };

  const renderError = (error: string | null, section: 'allVideos' | 'popularVideos' | 'playlists') => {
    if (!error) return null;
    
    return (
      <Alert 
        severity="error" 
        sx={{ width: '100%', mt: 2 }}
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<Refresh />}
            onClick={() => handleRetry(section)}
          >
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  };

  const renderVideoGrid = (
    videos: Video[], 
    loading: boolean, 
    error: string | null,
    section: 'allVideos' | 'popularVideos'
  ) => {
    if (error) {
      return renderError(error, section);
    }

    if (loading) {
      return (
        <Grid container spacing={4}>
          {[...Array(9)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Grid container spacing={4}>
        {videos.map((video) => (
          <Grid item key={video.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  '& .video-thumbnail': {
                    transform: 'scale(1.1)',
                  },
                  '& .play-button': {
                    opacity: 1,
                  },
                },
              }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  className="video-thumbnail"
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ transition: 'transform 0.6s ease' }}
                />
                <IconButton
                  className="play-button"
                  onClick={() => handlePlayVideo(video.id)}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  <PlayCircle sx={{ fontSize: 48 }} />
                </IconButton>
                {video.duration && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.75)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {video.duration}
                  </Typography>
                )}
              </Box>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '48px',
                  }}
                >
                  {video.title}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="caption">{video.publishDate}</Typography>
                  {video.views && (
                    <>
                      <Typography variant="caption">•</Typography>
                      <Typography variant="caption">{video.views} views</Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return renderVideoGrid(allVideos.items, allVideos.loading, allVideos.error, 'allVideos');
      case 1:
        if (playlists.error) {
          return renderError(playlists.error, 'playlists');
        }
        if (playlists.loading) {
          return (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card>
                    <Skeleton variant="rectangular" height={180} />
                    <CardContent>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          );
        }
        return (
          <Grid container spacing={4}>
            {playlists.items.map((playlist: Playlist) => (
              <Grid item key={playlist.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => window.open(`https://www.youtube.com/playlist?list=${playlist.id}`, '_blank')}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={playlist.thumbnail}
                    alt={playlist.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {playlist.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {playlist.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlaylistPlay />
                      <Typography variant="body2">
                        {playlist.videoCount} videos
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return renderVideoGrid(popularVideos.items, popularVideos.loading, popularVideos.error, 'popularVideos');
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 4, md: 6 }, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <YouTube sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Our Videos
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Watch our latest events, cultural performances, and community highlights
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                minWidth: 120,
              },
            }}
          >
            <Tab label="All Videos" />
            <Tab label="Playlists" />
            <Tab label="Popular" />
          </Tabs>
        </Box>

        {/* Content */}
        {renderContent()}
      </Container>
    </Box>
  );
};

export default VideosPage; 