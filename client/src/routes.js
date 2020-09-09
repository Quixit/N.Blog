import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import React, { Component } from 'react';
import Home from './front/home';
import Blog from './front/blog';
import Page from './front/page';
import Admin from './admin/admin';
import Menu from './controls/menu';
import GenericDialog from './controls/genericDialog';

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverError : ''
    };
  }
  serverError(value) {
    console.log('seterror');
    this.setState({ serverError: 'a'});
    console.log(this.state.serverError);
  }
  render() {
    return (
      <Router>
        <div>
        <GenericDialog
          open={ this.state.serverError !== '' }
          handleClose={r => this.setState({serverError : ''})}
          title="Request Error"
          text={"There has been an error processing your request. " + this.state.serverError}
        />
          <Menu serverError={this.serverError} />
          <Switch>
            <Route exact path="/" render={(props) => <Home {...props} serverError={this.serverError}/>}  />
            <Route exact path="/admin" render={(props) => <Admin {...props} serverError={this.serverError}/>} />
            <Route path="/blog/:slug" render={(props) => <Blog {...props} serverError={this.serverError}/>} />
            <Route path="/:slug" onChange={(a) => console.log('ent3r')} render={(props) => <Page {...props} serverError={this.serverError}/>} />
          </Switch>

        </div>
      </Router>
    );
  }
}

export default Routes;
