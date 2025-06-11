import { useState } from 'react';
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
  Chip,
} from '@mui/material';
import { PlayCircle, YouTube, PlaylistPlay } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  publishDate: string;
  duration: string;
  views: string;
}

interface Playlist {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  videoCount: number;
}

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
  {
    id: '4',
    thumbnail: 'https://picsum.photos/seed/video4/800/450',
    title: 'Nepali Food Festival 2024 Highlights',
    publishDate: '1 month ago',
    duration: '10:15',
    views: '1.5K',
  },
  {
    id: '5',
    thumbnail: 'https://picsum.photos/seed/video5/800/450',
    title: 'Interview with Successful Nepali Entrepreneurs',
    publishDate: '2 months ago',
    duration: '25:30',
    views: '3.2K',
  },
  {
    id: '6',
    thumbnail: 'https://picsum.photos/seed/video6/800/450',
    title: 'Dashain Celebration in Silicon Valley',
    publishDate: '3 months ago',
    duration: '18:45',
    views: '4.5K',
  },
  {
    id: '7',
    thumbnail: 'https://picsum.photos/seed/video7/800/450',
    title: 'Community Service Day - Helping Local Nepalese',
    publishDate: '3 months ago',
    duration: '14:20',
    views: '980',
  },
  {
    id: '8',
    thumbnail: 'https://picsum.photos/seed/video8/800/450',
    title: 'Nepali Language Classes for Kids',
    publishDate: '4 months ago',
    duration: '22:15',
    views: '2.8K',
  },
  {
    id: '9',
    thumbnail: 'https://picsum.photos/seed/video9/800/450',
    title: 'Cultural Exchange Program with Local Schools',
    publishDate: '4 months ago',
    duration: '16:40',
    views: '1.7K',
  }
];

const mockPlaylists = [
  {
    id: 'events',
    thumbnail: 'https://picsum.photos/seed/playlist1/800/450',
    title: 'Event Highlights',
    description: 'Watch highlights from our community events and celebrations',
    videoCount: 12,
  },
  {
    id: 'culture',
    thumbnail: 'https://picsum.photos/seed/playlist2/800/450',
    title: 'Cultural Programs',
    description: 'Traditional dances, music, and cultural performances',
    videoCount: 8,
  },
  {
    id: 'interviews',
    thumbnail: 'https://picsum.photos/seed/playlist3/800/450',
    title: 'Community Interviews',
    description: 'Inspiring stories from our community members',
    videoCount: 15,
  },
  {
    id: 'food',
    thumbnail: 'https://picsum.photos/seed/playlist4/800/450',
    title: 'Nepali Cuisine',
    description: 'Traditional recipes and food festival coverage',
    videoCount: 6,
  },
  {
    id: 'education',
    thumbnail: 'https://picsum.photos/seed/playlist5/800/450',
    title: 'Educational Content',
    description: 'Language classes, cultural workshops, and educational programs',
    videoCount: 10,
  },
  {
    id: 'youth',
    thumbnail: 'https://picsum.photos/seed/playlist6/800/450',
    title: 'Youth Programs',
    description: 'Activities and events for Nepali youth in the US',
    videoCount: 9,
  }
];

const VideosPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();

  const handlePlayVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
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
        {currentTab === 0 && (
          <Grid container spacing={4}>
            {mockVideos.map((video) => (
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
                      <Typography variant="caption">•</Typography>
                      <Typography variant="caption">{video.views} views</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {currentTab === 1 && (
          <Grid container spacing={4}>
            {mockPlaylists.map((playlist) => (
              <Grid item key={playlist.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      '& .playlist-thumbnail': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                  onClick={() => handlePlayVideo(playlist.id)}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      className="playlist-thumbnail"
                      component="img"
                      height="180"
                      image={playlist.thumbnail}
                      alt={playlist.title}
                      sx={{ transition: 'transform 0.6s ease' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        bgcolor: 'rgba(0,0,0,0.75)',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <PlaylistPlay fontSize="small" />
                      <Typography variant="caption">
                        {playlist.videoCount} videos
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {playlist.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {playlist.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {currentTab === 2 && (
          <Grid container spacing={4}>
            {mockVideos.slice(0, 6).map((video) => (
              <Grid item key={video.id} xs={12} sm={6} md={4}>
                {/* Same video card as All Videos tab */}
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
                      <Typography variant="caption">•</Typography>
                      <Typography variant="caption">{video.views} views</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default VideosPage; 