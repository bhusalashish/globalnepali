import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  CalendarToday,
} from '@mui/icons-material';
import type { RootState } from '../../store/store';

interface DashboardStats {
  totalMembers: number;
  activeEvents: number;
  publishedArticles: number;
  sponsors: number;
  recentMembers: Array<{
    id: string;
    name: string;
    joinedAt: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
  }>;
}

const mockStats: DashboardStats = {
  totalMembers: 1250,
  activeEvents: 8,
  publishedArticles: 45,
  sponsors: 12,
  recentMembers: [
    { id: '1', name: 'Aarav Sharma', joinedAt: '2024-03-15' },
    { id: '2', name: 'Priya Patel', joinedAt: '2024-03-14' },
    { id: '3', name: 'Raj Kumar', joinedAt: '2024-03-13' },
    { id: '4', name: 'Maya Singh', joinedAt: '2024-03-12' },
  ],
  upcomingEvents: [
    { id: '1', title: 'Nepali New Year Celebration', date: '2024-04-14' },
    { id: '2', title: 'Cultural Workshop', date: '2024-03-25' },
    { id: '3', title: 'Community Meetup', date: '2024-03-30' },
    { id: '4', title: 'Food Festival', date: '2024-04-06' },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        gap={2}
      >
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => fetchStats()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* Header Section */}
        <Card
          sx={{
            p: 3,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            backgroundImage: 'linear-gradient(120deg, #2563eb, #1e40af)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome to Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Monitor and manage your organization's activities
          </Typography>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.lighter' }}>
                      <PeopleIcon color="primary" />
                    </Avatar>
                    <Typography color="text.secondary" variant="body2">
                      Total Members
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalMembers}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'success.lighter' }}>
                      <EventIcon color="success" />
                    </Avatar>
                    <Typography color="text.secondary" variant="body2">
                      Active Events
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.activeEvents}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'info.lighter' }}>
                      <ArticleIcon color="info" />
                    </Avatar>
                    <Typography color="text.secondary" variant="body2">
                      Published Articles
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.publishedArticles}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'warning.lighter' }}>
                      <BusinessIcon color="warning" />
                    </Avatar>
                    <Typography color="text.secondary" variant="body2">
                      Sponsors
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.sponsors}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Activity and Actions Section */}
        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Recent Members
                </Typography>
                <List>
                  {stats.recentMembers.map((member, index) => (
                    <Box key={member.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{member.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={new Date(member.joinedAt).toLocaleDateString()}
                        />
                      </ListItem>
                      {index < stats.recentMembers.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<EventIcon />}
                    onClick={() => navigate('/admin/events/new')}
                    fullWidth
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.lighter',
                      },
                    }}
                  >
                    Create Event
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArticleIcon />}
                    onClick={() => navigate('/admin/articles/new')}
                    fullWidth
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      borderColor: 'info.main',
                      color: 'info.main',
                      '&:hover': {
                        borderColor: 'info.dark',
                        bgcolor: 'info.lighter',
                      },
                    }}
                  >
                    Write Article
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<NotificationsIcon />}
                    onClick={() => navigate('/admin/announcements/new')}
                    fullWidth
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      borderColor: 'warning.main',
                      color: 'warning.main',
                      '&:hover': {
                        borderColor: 'warning.dark',
                        bgcolor: 'warning.lighter',
                      },
                    }}
                  >
                    Send Announcement
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Events */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Upcoming Events
                </Typography>
                <List>
                  {stats.upcomingEvents.map((event, index) => (
                    <Box key={event.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.lighter' }}>
                            <CalendarToday color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={event.title}
                          secondary={new Date(event.date).toLocaleDateString()}
                        />
                      </ListItem>
                      {index < stats.upcomingEvents.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Dashboard; 