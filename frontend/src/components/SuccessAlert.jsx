import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SuccessAlert = ({ open, onClose, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity="success" 
        variant="filled"
        sx={{ 
          width: '100%',
          backgroundColor: '#4caf50',
          '& .MuiAlert-icon': {
            color: 'white'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessAlert; 