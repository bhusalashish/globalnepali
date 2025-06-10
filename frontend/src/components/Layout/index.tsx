import { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Article,
  Event,
  People,
  Business,
  Dashboard,
  Login,
  PersonAdd,
  Logout,
} from '@mui/icons-material';
import type { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/');
  };

  const navigationItems = [
    { text: 'Articles', icon: <Article />, path: '/articles' },
    { text: 'Events', icon: <Event />, path: '/events' },
    { text: 'Volunteer', icon: <People />, path: '/volunteers' },
    { text: 'Sponsors', icon: <Business />, path: '/sponsors' },
    ...(user?.role === 'admin' ? [{ text: 'Admin', icon: <Dashboard />, path: '/admin' }] : []),
  ];

  const userMenuItems = isAuthenticated
    ? [
        ...(user?.role === 'admin'
          ? [
              { text: 'Admin Dashboard', icon: <Dashboard />, path: '/admin' },
              { text: 'Manage Users', icon: <PersonAdd />, path: '/admin/users' }
            ]
          : []),
        { text: 'Logout', icon: <Logout />, onClick: handleLogout },
      ]
    : [
        { text: 'Login', icon: <Login />, path: '/login' },
        { text: 'Register', icon: <PersonAdd />, path: '/register' },
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h6" 
        component={RouterLink}
        to="/"
        sx={{ 
          my: 2, 
          color: 'text.primary',
          textDecoration: 'none',
          fontWeight: 600,
          '&:hover': {
            color: 'primary.main',
          }
        }}
      >
        Global Nepali
      </Typography>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { bgcolor: 'action.hover' },
              ...(location.pathname === item.path && {
                color: 'primary.main',
                bgcolor: 'primary.lighter',
                fontWeight: 600,
              }),
            }}
          >
            <ListItemIcon 
              sx={location.pathname === item.path ? { color: 'primary.main' } : undefined}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.default',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  color: 'text.primary',
                  textDecoration: 'none',
                  flexGrow: { xs: 1, md: 0 },
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                Global Nepali
              </Typography>

              {!isMobile && (
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, ml: 4 }}>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.text}
                      component={RouterLink}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                        fontWeight: location.pathname === item.path ? 700 : 400,
                        '&:hover': { 
                          color: 'primary.main',
                          bgcolor: 'primary.lighter',
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
              )}

              <Box sx={{ flexGrow: 0 }}>
                {isAuthenticated ? (
                  <>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar
                          alt={user?.full_name}
                          src="/static/images/avatar/2.jpg"
                          sx={{ 
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                          }}
                        >
                          {user?.full_name?.[0]}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {userMenuItems.map((item) => (
                        <MenuItem
                          key={item.text}
                          onClick={() => {
                            if (item.onClick) {
                              item.onClick();
                            } else if (item.path) {
                              navigate(item.path);
                              handleCloseUserMenu();
                            }
                          }}
                          sx={{
                            minWidth: 200,
                            gap: 1,
                            ...(item.text.includes('Admin') && {
                              color: 'primary.main',
                            })
                          }}
                        >
                          <ListItemIcon sx={item.text.includes('Admin') ? { color: 'primary.main' } : undefined}>
                            {item.icon}
                          </ListItemIcon>
                          <Typography>{item.text}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {userMenuItems.map((item) => (
                      <Button
                        key={item.text}
                        component={RouterLink}
                        to={item.path!}
                        variant={item.text === 'Register' ? 'contained' : 'outlined'}
                        startIcon={item.icon}
                        sx={{
                          '&:hover': {
                            bgcolor: item.text === 'Register' ? 'primary.dark' : 'primary.lighter',
                          },
                        }}
                      >
                        {item.text}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            boxShadow: theme.shadows[2],
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {!isAdminRoute && (
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            bgcolor: 'background.default',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Global Nepali. All rights reserved.
            </Typography>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Layout; 