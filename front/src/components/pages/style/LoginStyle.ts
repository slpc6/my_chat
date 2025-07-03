import { styled } from '@mui/material/styles';
import { Box, Paper, Button, TextField } from '@mui/material';

export const LoginContainer = styled(Box)(({}) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
 // background: 'linear-gradient(135deg,rgb(50, 14, 177) 0%,rgb(253, 253, 253) 100%)',
}));

export const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.95)',
}));

export const LoginForm = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const StyledTextField = styled(TextField)(({}) => ({
  background: '#f7f7fa',
  borderRadius: 8,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
  textTransform: 'none',
}));

export const RegisterButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 500,
  color: theme.palette.primary.main,
  textTransform: 'none',
}));
