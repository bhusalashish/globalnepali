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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setCredentials } from '../../store/slices/authSlice';
import { buildApiUrl, API_ENDPOINTS } from '../../api/config';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const params = new URLSearchParams();
        params.append("username", formData.email);
        params.append("password", formData.password);

        const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            credentials: "include",
            body: params,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Login failed");
        }

        const data = await response.json();
        
        // Store auth data in Redux
        dispatch(setCredentials({
            token: data.access_token,
            user: data.user
        }));
        
        // Store token in localStorage
        localStorage.setItem("token", data.access_token);
        
        // Redirect to dashboard
        navigate("/dashboard");
    } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
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
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Sign in to continue to Global Nepali
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
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
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
                Don't have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                Sign up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 