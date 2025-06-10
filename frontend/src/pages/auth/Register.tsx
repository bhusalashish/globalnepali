import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setCredentials } from '../../store/slices/authSlice';
import { register } from '../../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      setError('Invalid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data) {
        // Store user data in Redux
        dispatch(setCredentials(response.data));
        navigate('/');
      }
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (typeof err.response?.data === 'string') {
        setError(err.response.data);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Join the Global Nepali community
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="full_name"
                  label="Full Name"
                  name="full_name"
                  autoComplete="name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 