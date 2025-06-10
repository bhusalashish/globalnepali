import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  useTheme,
  useMediaQuery,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  People as VolunteerIcon,
  Business as SponsorIcon,
  Dashboard as DashboardIcon,
  PersonAdd,
  ExitToApp,
} from '@mui/icons-material';
import type { RootState } from '../../store/store';

const drawerWidth = 280;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Users', icon: <PersonAdd />, path: '/admin/users' },
    { text: 'Events', icon: <EventIcon />, path: '/admin/events' },
    { text: 'Articles', icon: <ArticleIcon />, path: '/admin/articles' },
    { text: 'Volunteers', icon: <VolunteerIcon />, path: '/admin/volunteers' },
    { text: 'Sponsors', icon: <SponsorIcon />, path: '/admin/sponsors' },
  ];

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40,
            bgcolor: 'primary.main'
          }}
        >
          {user?.name?.[0] || 'A'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.name || 'Admin User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administrator
          </Typography>
        </Box>
      </Box>
      
      <List sx={{ px: 2, py: 3, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ mb: 1 }}
          >
            <Button
              fullWidth
              startIcon={item.icon}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
              sx={{
                justifyContent: 'flex-start',
                px: 2,
                py: 1.5,
                borderRadius: 2,
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                },
                ...(location.pathname === item.path && {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  },
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }),
              }}
            >
              {item.text}
            </Button>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<ExitToApp />}
          onClick={() => {
            // Handle logout
          }}
          sx={{
            py: 1.5,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'error.main',
              color: 'white',
              '& .MuiSvgIcon-root': {
                color: 'white'
              }
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="text.primary">
            {menuItems.find(item => location.pathname.startsWith(item.path))?.text || 'Admin'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: theme.shadows[1],
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 