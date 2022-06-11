import React, { ChangeEvent, Component } from 'react';
import Client from '../api/apiClient';
import { LoginButtonTemplate } from '../theme';

interface Props {
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
  handleUsernameChange  = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({ username: e.target.value })
  }
  handlePasswordChange  = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({ password: e.target.value })
  }
  redirectTo(loggedIn: boolean)
  {
    return  loggedIn ? '/admin' : "/";
  }
  render() {
    const { username, password, isLoggedIn, loginOpen } = this.state;

    return (
      <LoginButtonTemplate
        onLoginClick={this.handleLoginClick}
        onLogoffClick={this.handleLogoffClick}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        onUsernameChange={this.handleUsernameChange}
        onPasswordChange={this.handlePasswordChange}
        username={username}
        password={password}
        isLoggedIn={isLoggedIn}
        loginOpen={loginOpen}
      />
    );
  }
}

export default LoginButton;
