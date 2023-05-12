import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Header = ({ setDeleteMode }) => {
  return (
    <Box p={2} display="flex" justifyContent="space-between" alignItems="center" className="header">
      <Typography variant="h6" component="div">My Prompts</Typography>
      <IconButton
        edge="end"
        className="delete-button"
        aria-label="delete"
        color="inherit" 
        onClick={() => setDeleteMode(prev => !prev)}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

export default Header;
