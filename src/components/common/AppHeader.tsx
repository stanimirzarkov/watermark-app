import { AppBar, Box, Toolbar, Typography } from '@mui/material';

export function AppHeader() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Watermark App
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
