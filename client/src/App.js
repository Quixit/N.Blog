import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import React, { Component } from 'react';
import Routes from './routes';
import { Theme } from './theme';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <Routes />
      </MuiThemeProvider>
    );
  }
}

export default App;
