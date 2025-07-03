import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';


export const SinginContainer = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  //background: 'linear-gradient(135deg, #ece9f7 0%, #cfd9df 100%)',
});

export const SinginTitle = styled('h2')({
  marginBottom: 20,
  fontWeight: 900,
  color: '#3210b1',
  letterSpacing: 1,
});

export const SinginForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: 500,
  padding: 32,
  borderRadius: 16,
  background: 'rgba(255,255,255,0.95)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  gap: 16,
});

export const SinginLabel = styled('label')({
  fontWeight: 700,
  marginBottom: 4,
  color: '#222',
});

export const SinginInput = styled('input')({
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 16,
  marginBottom: 12,
  background: '#f7f7fa',
  transition: 'border 0.2s',
  ':focus': {
    border: '1.5px solid #3210b1',
    outline: 'none',
  },
});

export const SinginButton = styled('button')({
  marginTop: 12,
  padding: '12px 0',
  borderRadius: 8,
  border: 'none',
  background: 'linear-gradient(90deg, #3210b1 0%, #6a82fb 100%)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 17,
  cursor: 'pointer',
  boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
  transition: 'background 0.2s',
  ':hover': {
    background: 'linear-gradient(90deg, #6a82fb 0%, #3210b1 100%)',
  },
});

export const RegisterButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 500,
  color: theme.palette.primary.main,
  textTransform: 'none',
}));
