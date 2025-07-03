import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

export const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
}));

export const MainContainer = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.up('lg')]: {
    maxWidth: '100%',
  },
}));