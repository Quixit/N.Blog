import React, { Component } from 'react';
import Home from './front/Home';
import Blog from './front/Blog';
import Page from './front/Page';
import Admin from './admin/Admin';
import Menu from './controls/Menu';
import { Theme } from './Theme';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <Router>
          <div>
            <Menu />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/admin" component={Admin} />
              <Route path="/blog/:slug" component={Blog} />
              <Route path="/:slug" component={Page} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
