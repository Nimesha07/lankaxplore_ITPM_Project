import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  Chip,
  Rating
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Public,
  Edit,
  History,
  Favorite,
  Star,
  Bookmark,
  Settings,
  Security,
  Payment,
  Notifications,
  Help,
  AddLocation
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import DestinationManager from '../components/DestinationManager';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5001/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          setUser(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setSnackbar({
          open: true,
          message: 'Error loading user profile',
          severity: 'error',
        });
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/users/profile', user, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error',
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography variant="h6" color="error">
          User profile not found
        </Typography>
      </div>
    );
  }

  const renderProfileTab = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent className="flex flex-col items-center">
            <Avatar
              src={user.profileImage}
              alt={user.name}
              className="w-32 h-32 mb-4"
            />
            <Typography variant="h5" className="font-bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              className="mt-4"
              onClick={() => setActiveTab(1)}
            >
              Edit Profile
            </Button>
            {user.role === 'admin' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddLocation />}
                className="mt-4"
                onClick={() => navigate('/destinations/new')}
              >
                Add Destination
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Account Stats
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText primary="Bookings" secondary={user.recentBookings?.length || 0} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Reviews" secondary="12" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="Favorites" secondary="8" />
              </ListItem>
              {user.role === 'admin' && (
                <ListItem>
                  <ListItemIcon>
                    <AddLocation />
                  </ListItemIcon>
                  <ListItemText primary="Destinations Added" secondary="5" />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Recent Activity
            </Typography>
            <List>
              {user.recentBookings?.map((booking, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <History />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Booking for ${booking.destination?.name}`}
                    secondary={`${new Date(booking.createdAt).toLocaleDateString()} - ${booking.status}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderEditProfileTab = () => (
    <Card>
      <CardContent>
        <form onSubmit={handleUpdateProfile}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                InputProps={{
                  startAdornment: <Person className="mr-2" />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                InputProps={{
                  startAdornment: <Email className="mr-2" />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={user.phone || ''}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                InputProps={{
                  startAdornment: <Phone className="mr-2" />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={user.address || ''}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                InputProps={{
                  startAdornment: <LocationOn className="mr-2" />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                value={user.country || ''}
                onChange={(e) => setUser({ ...user, country: e.target.value })}
                InputProps={{
                  startAdornment: <Public className="mr-2" />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );

  const renderSettingsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Account Settings
            </Typography>
            <List>
              <ListItem button onClick={() => navigate('/profile/security')}>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Security" secondary="Change password and security settings" />
              </ListItem>
              <ListItem button onClick={() => navigate('/profile/notifications')}>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Notifications" secondary="Manage notification preferences" />
              </ListItem>
              <ListItem button onClick={() => navigate('/profile/payment')}>
                <ListItemIcon>
                  <Payment />
                </ListItemIcon>
                <ListItemText primary="Payment Methods" secondary="Manage payment information" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Help & Support
            </Typography>
            <List>
              <ListItem button onClick={() => navigate('/help')}>
                <ListItemIcon>
                  <Help />
                </ListItemIcon>
                <ListItemText primary="Help Center" secondary="Get help with your account" />
              </ListItem>
              <ListItem button onClick={() => navigate('/contact')}>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="Contact Support" secondary="Reach out to our support team" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Profile" icon={<Person />} />
            <Tab label="Edit Profile" icon={<Edit />} />
            <Tab label="Settings" icon={<Settings />} />
            <Tab label="My Destinations" icon={<AddLocation />} />
          </Tabs>
        </Box>

        {activeTab === 0 && renderProfileTab()}
        {activeTab === 1 && renderEditProfileTab()}
        {activeTab === 2 && renderSettingsTab()}
        {activeTab === 3 && <DestinationManager />}
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile; 