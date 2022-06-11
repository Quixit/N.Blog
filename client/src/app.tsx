import { ThemeProvider, CssBaseline, StyledEngineProvider } from "@mui/material";

import React, { Component } from 'react';
import Routes from './routes';
import { theme } from './theme';

class App extends Component {
  render() {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
        </ThemeProvider >
      </StyledEngineProvider>
    );
  }
}

export default App;
