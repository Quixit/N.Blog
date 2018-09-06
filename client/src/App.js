import React, { Component } from 'react';
import Client from './api/ApiClient';
import Admin from './admin/Admin';
import Front from './front/Front';
import { Theme } from './Theme';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <Router>
          <div>
            <Route exact path="/" component={Front} />
            <Route path="/admin" component={Admin} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
