import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import React, { Component } from 'react';
import Home from './front/home';
import Blog from './front/blog';
import Article from './front/article';
import Admin from './admin/admin';
import Menu from './controls/menu';
import GenericDialog from './controls/genericDialog';

interface Props {

}

interface State {
    errorText: string;
}

class Routes extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorText : ''
    };
  }
  serverError = (value: string) => {
    this.setState({ errorText: value}, () => console.error(this.state.errorText));
  }
  render() {
    return (
      <Router>
        <div>
        <GenericDialog
          open={ this.state.errorText !== '' }
          onClose={() => this.setState({errorText : ''})}
          title="Request Error"
          text={"There has been an error processing your request. " + this.state.errorText}
        />
          <Menu serverError={this.serverError} />
          <Switch>
            <Route exact path="/" render={(props: any) => <Home {...props} serverError={this.serverError}/>}  />
            <Route exact path="/admin" render={(props: any) => <Admin {...props} serverError={this.serverError}/>} />
            <Route path="/blog/:slug" render={(props: any) => <Blog {...props} serverError={this.serverError}/>} />
            <Route path="/:slug" render={(props: any) => <Article {...props} serverError={this.serverError}/>} />
          </Switch>

        </div>
      </Router>
    );
  }
}

export default Routes;
