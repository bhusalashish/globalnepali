import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Alert,
  useTheme,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { buildApiUrl, API_ENDPOINTS } from '../../api/config';
import { authenticatedFetch } from '../../api/authMiddleware';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface EventFormData {
  title: string;
  description: string;
  date: Date;
  location: string;
  image_url: string;
}

const NewEvent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: new Date(),
    location: '',
    image_url: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData((prev) => ({
        ...prev,
        date: newDate,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(buildApiUrl(API_ENDPOINTS.events), {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create event');
      }

      navigate('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/events')}
        sx={{ mb: 4 }}
      >
        Back to Events
      </Button>

      <Typography
        variant="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 6,
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
        Create New Event
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Event Date & Time"
                value={formData.date}
                onChange={handleDateChange}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              label="Image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              required
              helperText="Provide a URL for the event cover image"
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/events')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewEvent; 