import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Box sx={{ flex: 1, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};