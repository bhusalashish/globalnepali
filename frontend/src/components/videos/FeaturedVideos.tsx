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
} from '@mui/material';
import { PlayCircle, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Mock data - will be replaced with actual YouTube API data later
const mockVideos = [
  {
    id: '1',
    thumbnail: 'https://picsum.photos/seed/video1/800/450',
    title: 'Celebrating Nepali New Year 2024 in Bay Area',
    publishDate: '2 weeks ago',
    duration: '12:34',
    views: '1.2K',
  },
  {
    id: '2',
    thumbnail: 'https://picsum.photos/seed/video2/800/450',
    title: 'Traditional Nepali Dance Performance at Stanford',
    publishDate: '3 weeks ago',
    duration: '8:45',
    views: '856',
  },
  {
    id: '3',
    thumbnail: 'https://picsum.photos/seed/video3/800/450',
    title: 'Nepal Day Celebration 2024 - San Francisco',
    publishDate: '1 month ago',
    duration: '15:20',
    views: '2.1K',
  },
];

const FeaturedVideos = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handlePlayVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
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

        <Grid container spacing={4}>
          {mockVideos.map((video) => (
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
                      minHeight: '48px',
                      lineHeight: 1.4,
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
                      mt: 'auto',
                      pt: 1,
                      borderTop: '1px solid',
                      borderColor: 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 500,
                        opacity: 0.8,
                      }}
                    >
                      {video.publishDate}
                    </Typography>
                    <Typography variant="caption">•</Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 500,
                        opacity: 0.8,
                      }}
                    >
                      {video.views} views
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/videos')}
            endIcon={<ArrowForward />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
              boxShadow: '0 8px 24px rgba(26,35,126,0.3)',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(26,35,126,0.4)',
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