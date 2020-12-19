import React, { Component } from 'react';
import Client from '../api/apiClient';
import { LoginButtonTemplate, styles } from '../theme';

import { WithStyles, withStyles } from '@material-ui/core/styles';

interface Props extends WithStyles {
  force?: boolean;
  username?: string;
  password?: string;
}

interface State {
  username: string;
  password: string;
  isLoggedIn: boolean;
  loginOpen: boolean;
  redirectTo: string;
}

class LoginButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: props.username || '',
      password: props.password || '',
      isLoggedIn: Client.isLoggedIn,
      loginOpen: props.force === true  && !Client.isLoggedIn,
      redirectTo: ''
    };

  }
  handleLoginClick = (event: React.MouseEvent<HTMLButtonElement,MouseEvent>) =>
  {
    event.preventDefault();
    Client.login(this.state.username,this.state.password).then(() => this.setState({ isLoggedIn : Client.isLoggedIn, redirectTo: this.redirectTo(Client.isLoggedIn)}));
    this.handleClose();
  }
  handleLogoffClick = (event: React.MouseEvent<HTMLButtonElement,MouseEvent>) =>
  {
    event.preventDefault();
    Client.logoff().then(() => this.setState({ isLoggedIn : Client.isLoggedIn, redirectTo: this.redirectTo(Client.isLoggedIn) }));
  }
  handleOpen = () => {
   this.setState({ loginOpen: true });
  }
  handleClose = () => {
   this.setState({ loginOpen: false });
  }
  redirectTo(loggedIn: boolean)
  {
    return  loggedIn ? '/admin' : "/";
  }
  render() {
    const { classes } = this.props;
    const { username, password, isLoggedIn, loginOpen } = this.state;

    return (
      <LoginButtonTemplate
        handleLoginClick={this.handleLoginClick}
        handleLogoffClick={this.handleLogoffClick}
        handleOpen={this.handleOpen}
        handleClose={this.handleClose}
        username={username}
        password={password}
        classes={classes}
        isLoggedIn={isLoggedIn}
        loginOpen={loginOpen}
      />
    );
  }
}

export default withStyles(styles)(LoginButton);
