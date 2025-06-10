import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Skeleton,
  useTheme,
  CardActions,
  Stack,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  People,
  AccessTime,
  Add as AddIcon,
} from '@mui/icons-material';

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered_count: number;
  is_registered: boolean;
  category: string;
}

const Events = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/v1/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/v1/events/${eventId}/register`, {
        method: 'POST',
      });
      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  is_registered: !event.is_registered,
                  registered_count: event.is_registered
                    ? event.registered_count - 1
                    : event.registered_count + 1,
                }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Failed to register for event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const LoadingSkeleton = () => (
    <Grid item xs={12} md={6}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: '100%', sm: 280 },
            height: { xs: 200, sm: '100%' },
          }}
        />
        <Box sx={{ flex: 1 }}>
          <CardContent>
            <Skeleton variant="text" height={32} width="80%" />
            <Skeleton variant="text" height={20} width="40%" />
            <Skeleton variant="text" height={60} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" height={24} width="60%" />
              <Skeleton variant="text" height={24} width="50%" />
            </Box>
          </CardContent>
          <CardActions>
            <Skeleton variant="rectangular" width={120} height={36} />
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );

  const canCreateEvent = user && ['admin', 'editor'].includes(user.role);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-16px',
              left: 0,
              width: '80px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px',
            },
          }}
        >
          Upcoming Events
        </Typography>
        {canCreateEvent && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/events/new')}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Create Event
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {loading
          ? Array.from(new Array(4)).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          : events.map((event) => (
              <Grid item key={event.id} xs={12} md={6}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: '100%', sm: 280 },
                      height: { xs: 200, sm: '100%' },
                    }}
                    image={event.image_url}
                    alt={event.title}
                  />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Chip
                        label={event.category}
                        size="small"
                        sx={{
                          mb: 2,
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                        }}
                      />
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {event.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday
                            fontSize="small"
                            sx={{ color: theme.palette.primary.main }}
                          />
                          <Typography variant="body2">
                            {formatDate(event.date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime
                            fontSize="small"
                            sx={{ color: theme.palette.primary.main }}
                          />
                          <Typography variant="body2">{event.time}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn
                            fontSize="small"
                            sx={{ color: theme.palette.primary.main }}
                          />
                          <Typography variant="body2">{event.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People
                            fontSize="small"
                            sx={{ color: theme.palette.primary.main }}
                          />
                          <Typography variant="body2">
                            {event.registered_count} / {event.capacity} registered
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                      <Button
                        variant={event.is_registered ? 'outlined' : 'contained'}
                        fullWidth
                        onClick={() => handleRegister(event.id)}
                        disabled={
                          !event.is_registered &&
                          event.registered_count >= event.capacity
                        }
                      >
                        {event.is_registered
                          ? 'Cancel Registration'
                          : event.registered_count >= event.capacity
                          ? 'Event Full'
                          : 'Register Now'}
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default Events; 