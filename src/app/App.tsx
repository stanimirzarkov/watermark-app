import { Box } from '@mui/material';

import { AppFooter } from '@/components/common/AppFooter';
import { AppHeader } from '@/components/common/AppHeader';
import { HomePage } from '@/pages/HomePage';

export function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppHeader />

      <Box component="main" sx={{ flex: 1 }}>
        <HomePage />
      </Box>

      <AppFooter />
    </Box>
  );
}
