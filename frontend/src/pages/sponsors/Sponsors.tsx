import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

const sponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Nepal Airlines',
    logo: '/images/sponsors/nepal-airlines.png',
    description:
      'The flag carrier airline of Nepal, connecting the global Nepali community.',
    website: 'https://www.nepalairlines.com',
    tier: 'platinum',
  },
  {
    id: '2',
    name: 'Himalayan Bank',
    logo: '/images/sponsors/himalayan-bank.png',
    description:
      'A leading commercial bank in Nepal, facilitating international transactions.',
    website: 'https://www.himalayanbank.com',
    tier: 'gold',
  },
  {
    id: '3',
    name: 'Yeti Group',
    logo: '/images/sponsors/yeti-group.png',
    description:
      'A diversified business group with interests in hospitality and tourism.',
    website: 'https://www.yetigroup.com',
    tier: 'gold',
  },
  {
    id: '4',
    name: 'Tara Air',
    logo: '/images/sponsors/tara-air.png',
    description:
      'Connecting remote regions of Nepal with safe and reliable air service.',
    website: 'https://www.taraair.com',
    tier: 'silver',
  },
  {
    id: '5',
    name: 'Ncell',
    logo: '/images/sponsors/ncell.png',
    description:
      'Leading telecommunications provider in Nepal, keeping families connected.',
    website: 'https://www.ncell.com',
    tier: 'silver',
  },
  {
    id: '6',
    name: 'Buddha Air',
    logo: '/images/sponsors/buddha-air.png',
    description:
      'Domestic airline operator with the largest network in Nepal.',
    website: 'https://www.buddhaair.com',
    tier: 'bronze',
  },
];

const tierColors = {
  platinum: '#E5E4E2',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

const Sponsors = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    tier: '',
    message: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      company: '',
      contact: '',
      email: '',
      phone: '',
      tier: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    handleCloseDialog();
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
          Our Sponsors
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}
        >
          We are grateful to our sponsors who help us strengthen and support the
          Nepali community in the Bay Area. Their generous support makes our
          programs and initiatives possible.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenDialog}
          sx={{ mt: 4 }}
        >
          Become a Sponsor
        </Button>
      </Box>

      <Grid container spacing={4}>
        {sponsors.map((sponsor) => (
          <Grid key={sponsor.id} item xs={12} sm={6} md={4}>
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
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: tierColors[sponsor.tier],
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 140,
                  objectFit: 'contain',
                  p: 2,
                  backgroundColor: 'background.paper',
                }}
                image={sponsor.logo}
                alt={sponsor.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {sponsor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sponsor.description}
                </Typography>
                <Button
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Become a Sponsor</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Contact Person"
              name="contact"
              value={formData.contact}
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
              select
              label="Sponsorship Tier"
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="platinum">Platinum</MenuItem>
              <MenuItem value="gold">Gold</MenuItem>
              <MenuItem value="silver">Silver</MenuItem>
              <MenuItem value="bronze">Bronze</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sponsors; 