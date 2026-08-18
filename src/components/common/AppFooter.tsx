import { Box, Container, Typography } from '@mui/material';

export function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © 2026 Watermark App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
