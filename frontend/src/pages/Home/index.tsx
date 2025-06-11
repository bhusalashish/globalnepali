import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Event,
  Article,
  People,
  Business,
  ArrowForward,
  LocationOn,
  ChevronRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FeaturedVideos from '../../components/videos/FeaturedVideos';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      title: 'Cultural Events',
      description: 'Join vibrant celebrations, festivals, and community gatherings',
      icon: <Event fontSize="large" />,
      path: '/events',
      color: theme.palette.primary.main,
    },
    {
      title: 'Community Stories',
      description: 'Read and share inspiring stories from our community',
      icon: <Article fontSize="large" />,
      path: '/articles',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Volunteer',
      description: 'Make an impact through meaningful volunteer opportunities',
      icon: <People fontSize="large" />,
      path: '/volunteers',
      color: theme.palette.primary.dark,
    },
    {
      title: 'Business Network',
      description: 'Connect with Nepali businesses and entrepreneurs',
      icon: <Business fontSize="large" />,
      path: '/sponsors',
      color: theme.palette.secondary.dark,
    },
  ];

  const upcomingEvents = [
    {
      title: 'Networking Mixer',
      date: 'May 15, 2024',
      location: 'San Francisco, CA',
      description: 'Connect with fellow Nepal students and professionals',
      image: '/images/events/networking.jpg',
    },
    {
      title: 'Career Workshop',
      date: 'May 22, 2024',
      location: 'San Jose, CA',
      description: 'Learn job search strategies and resume tips',
      image: '/images/events/career.jpg',
    },
    {
      title: 'Cultural Celebration',
      date: 'June 5, 2024',
      location: 'Mountain View, CA',
      description: 'Celebrate Nepali culture with music, dance, and food',
      image: '/images/events/cultural.jpg',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          overflow: 'hidden',
          pt: { xs: 12, md: 0 },
          pb: { xs: 16, md: 20 },
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url(/images/pattern.png)',
            backgroundSize: '500px',
          }}
        />

        {/* Diagonal Shape */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: '#f8f9fa',
            transform: 'skewY(-3deg)',
            transformOrigin: 'bottom left',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid 
            container 
            spacing={{ xs: 6, md: 8 }} 
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h1"
                  color="white"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.75rem', lg: '4.5rem' },
                    lineHeight: 1.1,
                    mb: 3,
                    position: 'relative',
                  }}
                >
                  Helping Nepalese
                  <Typography
                    component="span"
                    variant="inherit"
                    display="block"
                    sx={{
                      color: '#FFD700',
                      mt: 1,
                    }}
                  >
                    Thrive in the United States
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  color="rgba(255,255,255,0.9)"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '540px',
                  }}
                >
                  Join our vibrant community of Nepali students and professionals. Get access to resources, events, and networking opportunities.
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ mt: 4 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={() => navigate('/events')}
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.8,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      backgroundColor: '#FFD700',
                      color: '#1a237e',
                      '&:hover': {
                        backgroundColor: '#FFC700',
                      },
                    }}
                  >
                    Explore Events
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 1.8,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.6)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                    onClick={() => navigate('/register')}
                  >
                    Join Community
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={5}
              sx={{
                position: 'relative',
                display: { xs: 'none', md: 'block' },
              }}
            >
              {/* Decorative Elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: -20,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255,215,0,0.2)',
                  zIndex: 0,
                }}
              />
              
              {/* Main Image with Frame */}
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    bottom: -20,
                    left: -20,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    zIndex: 0,
                  },
                }}
              >
                <Box
                  component="img"
                  src="/images/hero-illustration.png"
                  alt="Nepali students"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '600px',
                    borderRadius: '16px',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg)',
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10, mt: -10, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                onClick={() => navigate(feature.path)}
                sx={{
                  height: '100%',
                  p: 4,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    borderColor: feature.color,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      width: 64,
                      height: 64,
                      color: feature.color,
                      border: '2px solid',
                      borderColor: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{
                    fontWeight: 700,
                    color: feature.color,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  paragraph
                  sx={{ mb: 3 }}
                >
                  {feature.description}
                </Typography>
                <Button
                  endIcon={<ChevronRight />}
                  sx={{ 
                    color: feature.color,
                    '&:hover': {
                      backgroundColor: `${feature.color}10`,
                    },
                  }}
                >
                  Learn More
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Events Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: theme.palette.primary.main,
                  borderRadius: '2px',
                },
              }}
            >
              Upcoming Events
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ 
                mt: 4,
                mb: 2,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Join us for these exciting community events
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {upcomingEvents.map((event) => (
              <Grid item key={event.title} xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      '& .event-image': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '66%',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      className="event-image"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.6s ease',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                      >
                        {event.date}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        mb: 2,
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 3 }}
                    >
                      {event.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      <LocationOn
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main, mr: 1 }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      >
                        {event.location}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/events')}
              endIcon={<ArrowForward />}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                boxShadow: '0 8px 24px rgba(26,35,126,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(26,35,126,0.4)',
                },
              }}
            >
              View All Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Videos Section */}
      <Box 
        sx={{ 
          bgcolor: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            bgcolor: '#f8f9fa',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            bgcolor: 'white',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <FeaturedVideos />
        </Box>
      </Box>

      {/* Get Involved Section */}
      <Box
        sx={{
          bgcolor: 'white',
          py: { xs: 10, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/pattern.png)',
            backgroundSize: '400px',
            opacity: 0.05,
            transform: 'rotate(-3deg) scale(1.2)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Make a Difference in Our Community
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Join us in making a difference in the lives of Nepalese in the US. Sign up to volunteer and support our programs.
              </Typography>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => navigate('/volunteer')}
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Sign Up to Volunteer
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/volunteer-illustration.png"
                alt="Volunteer"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: { xs: 'none', md: 'block' },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 