import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f5f5f5"
      px={2}>
      <Typography variant="h1" color="primary" fontWeight="bold" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Box>
  );
}

