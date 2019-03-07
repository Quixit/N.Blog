import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import React, { Component } from 'react';
import Routes from './Routes';
import { Theme } from './Theme';

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
