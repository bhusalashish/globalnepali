import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
  IconButton,
  Skeleton,
  Alert,
} from '@mui/material';
import { PlayCircle, ArrowForward, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopular, resetRetryCount } from '../../store/slices/videosSlice';
import type { AppDispatch, RootState } from '../../store/store';


const FeaturedVideos = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const { items: videos, loading, error, hasConfigError, retryCount } = useSelector(
    (state: RootState) => state.videos.popularVideos
  );

  useEffect(() => {
    if (videos.length === 0 && !loading && !hasConfigError && retryCount < 3) {
      dispatch(fetchPopular());
    }
  }, [dispatch, videos.length, loading, hasConfigError, retryCount]);

  const handlePlayVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const handleRetry = () => {
    dispatch(resetRetryCount('popularVideos'));
    dispatch(fetchPopular());
  };

  const renderContent = () => {
    if (error) {
      return (
        <Alert 
          severity="error" 
          sx={{ width: '100%', mt: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      );
    }

    if (loading) {
      return (
        <Grid container spacing={4}>
          {[...Array(3)].map((_, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Skeleton variant="rectangular" height={220} />
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
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
        {videos.slice(0, 3).map((video) => (
          <Grid item key={video.id} xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  '& .video-thumbnail': {
                    transform: 'scale(1.1)',
                  },
                  '& .play-button': {
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1.1)',
                  },
                },
              }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  className="video-thumbnail"
                  component="img"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{
                    height: 220,
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
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
                    backdropFilter: 'blur(4px)',
                    opacity: 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                      transform: 'translate(-50%, -50%) scale(1.2)',
                    },
                  }}
                >
                  <PlayCircle sx={{ fontSize: 48 }} />
                </IconButton>
                {video.duration && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: 'rgba(0,0,0,0.75)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {video.duration}
                  </Box>
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    mb: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '2.75em',
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
                    fontSize: '0.875rem',
                  }}
                >
                  <Typography variant="body2">{video.publishDate}</Typography>
                  {video.views && (
                    <>
                      <Typography variant="body2">•</Typography>
                      <Typography variant="body2">{video.views} views</Typography>
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

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              position: 'relative',
              display: 'inline-block',
              background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                borderRadius: '2px',
              },
            }}
          >
            Featured Videos
          </Typography>
          <Typography
            variant="h5"
            sx={{ 
              mt: 4,
              mb: 2,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              color: 'text.secondary',
              opacity: 0.9,
            }}
          >
            Watch our latest community events and cultural highlights
          </Typography>
        </Box>

        {renderContent()}

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/videos')}
            sx={{
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                background: 'linear-gradient(45deg, rgba(26,35,126,0.1) 30%, rgba(13,71,161,0.1) 90%)',
              },
            }}
          >
            View All Videos
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedVideos; 