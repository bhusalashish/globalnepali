import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Person as VolunteerIcon,
  LocationOn,
  Schedule,
} from '@mui/icons-material';

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  commitment: string;
  category: string;
  contact: {
    email: string;
    phone: string;
  };
}

const opportunities: VolunteerOpportunity[] = [
  {
    id: '1',
    title: 'Community Event Organizer',
    description:
      'Help organize and coordinate cultural events, festivals, and community gatherings. Work with our events team to create memorable experiences for the Nepali community.',
    requirements: [
      'Strong organizational skills',
      'Experience in event planning',
      'Excellent communication',
      'Available on weekends',
    ],
    location: 'San Francisco Bay Area',
    commitment: '5-10 hours per week',
    category: 'Events',
    contact: {
      email: 'events@globalnepali.org',
      phone: '(555) 123-4567',
    },
  },
  {
    id: '2',
    title: 'Cultural Program Instructor',
    description:
      'Share your knowledge of Nepali culture, language, music, or dance by teaching classes to community members. Help preserve and promote our rich cultural heritage.',
    requirements: [
      'Expertise in Nepali arts/culture',
      'Teaching experience preferred',
      'Patient and enthusiastic',
      'Bilingual (Nepali/English)',
    ],
    location: 'San Jose, CA',
    commitment: '4-6 hours per week',
    category: 'Education',
    contact: {
      email: 'education@globalnepali.org',
      phone: '(555) 234-5678',
    },
  },
  {
    id: '3',
    title: 'Community Outreach Coordinator',
    description:
      'Connect with Nepali families and individuals in the Bay Area. Help newcomers integrate into the community and access available resources and support services.',
    requirements: [
      'Strong interpersonal skills',
      'Knowledge of community resources',
      'Valid drivers license',
      'Flexible schedule',
    ],
    location: 'Bay Area (Multiple locations)',
    commitment: '8-12 hours per week',
    category: 'Outreach',
    contact: {
      email: 'outreach@globalnepali.org',
      phone: '(555) 345-6789',
    },
  },
];

const Volunteers = () => {
  const theme = useTheme();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<VolunteerOpportunity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleApply = (opportunity: VolunteerOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleClose = () => {
    setSelectedOpportunity(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px',
            },
          }}
        >
          Volunteer Opportunities
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}
        >
          Join our community of dedicated volunteers and make a difference in the
          Bay Area Nepali community. We have various opportunities for you to
          contribute your skills and time.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {opportunities.map((opportunity) => (
          <Grid key={opportunity.id} item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <VolunteerIcon
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Chip
                    label={opportunity.category}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    }}
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  {opportunity.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    mb: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {opportunity.description}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2">{opportunity.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2">
                      {opportunity.commitment}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleApply(opportunity)}
                >
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedOpportunity}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          Apply for {selectedOpportunity?.title}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Volunteers; 