import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { VideoCall } from '@mui/icons-material';

interface JoinScreenProps {
  onJoin: (userName: string) => void;
}

export default function JoinScreen({ onJoin }: JoinScreenProps) {
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onJoin(userName.trim());
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <VideoCall sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              MyChat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tu nombre para unirte a la videollamada
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Tu nombre"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ej: Juan"
              sx={{ mb: 2 }}
              autoFocus
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={!userName.trim()}
            >
              Unirse a la videollamada
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

