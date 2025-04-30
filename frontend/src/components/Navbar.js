import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Typography,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  useTheme
} from '@mui/material';
import { 
  Person,
  Logout,
  Settings,
  Notifications,
  Favorite,
  Bookmark
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    handleMenuClose();
    navigate('/');
  };

  const menuItems = [
    { 
      label: 'Home', 
      path: '/'
    },
    { 
      label: 'Destinations', 
      path: '/destinations'
    },
    { 
      label: 'Experiences', 
      path: '/experiences'
    },
    { 
      label: 'About', 
      path: '/about'
    },
    { 
      label: 'Contact', 
      path: '/contact'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const renderDesktopMenu = () => (
    <motion.div 
      className="hidden md:flex items-center space-x-6"
      variants={containerVariants}
    >
      {menuItems.map((item) => (
        <motion.div
          key={item.label}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={item.path}
            className="text-white hover:text-primary-light transition-colors font-bold py-2"
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user?.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/favorites'); }}>
        <ListItemIcon>
          <Favorite fontSize="small" />
        </ListItemIcon>
        <ListItemText>Favorites</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/bookmarks'); }}>
        <ListItemIcon>
          <Bookmark fontSize="small" />
        </ListItemIcon>
        <ListItemText>Bookmarks</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <Logout fontSize="small" sx={{ color: 'error.main' }} />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchor}
      open={Boolean(notificationsAnchor)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>
      </Box>
      <Divider />
      <MenuItem>
        <ListItemText 
          primary="No new notifications"
          secondary="You're all caught up!"
        />
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar 
      position="sticky" 
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(203, 96, 64, 0.9)',
      }}
    >
      <Toolbar className="justify-between">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="text-2xl font-bold text-white hover:text-primary-light transition-colors">
            LankaXplore
          </Link>
        </motion.div>

        {renderDesktopMenu()}

        {/* Auth Buttons - Desktop and Mobile */}
        <motion.div 
          className="flex items-center space-x-4"
          variants={containerVariants}
        >
          {isLoggedIn ? (
            <>
              <motion.div variants={itemVariants}>
                <IconButton
                  onClick={handleNotificationsOpen}
                  className="text-white hover:text-primary-light"
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Badge badgeContent={0} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleProfileMenuOpen}
              >
                <Typography variant="body1" className="text-white hidden md:block">
                  {user?.username}
                </Typography>
                <Avatar 
                  src={user?.avatar} 
                  alt={user?.username}
                  sx={{
                    bgcolor: theme.palette.primary.light,
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                    },
                  }}
                >
                  {(user?.username?.charAt(0) || 'U').toUpperCase()}
                </Avatar>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <Link
                  to="/login"
                  className="relative px-4 py-2 text-white rounded-lg overflow-hidden group transition-all duration-300"
                  component={motion.div}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="absolute inset-0 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300"></span>
                  <span className="relative z-10 font-medium">Login</span>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  to="/signup"
                  className="relative px-4 py-2 bg-white text-[#257180] rounded-lg overflow-hidden group transition-all duration-300"
                  component={motion.div}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="absolute inset-0 bg-[#257180] opacity-10 group-hover:opacity-20 transition-all duration-300"></span>
                  <span className="relative z-10 font-medium">Sign Up</span>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </Toolbar>
      {renderProfileMenu}
      {renderNotificationsMenu}
    </AppBar>
  );
};

export default Navbar; 