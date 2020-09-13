import React, { Component } from 'react';
import Client from '../api/apiClient';
import { styles } from '../theme';

import { WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

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

    return (
      <div>
        {!this.state.isLoggedIn ? (<Button onClick={this.handleOpen} color="secondary">Login</Button>) : (<Button onClick={this.handleLogoffClick} color="secondary">Log Out</Button>)}
        <Modal
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
          open={this.state.loginOpen}
          onClose={this.handleClose}>
          <div className={classes.modalPaper}>
            <Typography variant="h6" id="login-modal-title" gutterBottom>
              Login
            </Typography>
            <Grid container spacing={2}>
             <Grid item xs={12}>
               <TextField
                 name="username"
                 type="text"
                 label = "Username"
                 fullWidth
                 value={this.state.username}
                 onChange={(e) => this.setState({ username: e.target.value })} />
             </Grid>
             <Grid item xs={12}>
               <TextField
                 name="password"
                 type="password"
                 label="Password"
                 fullWidth
                 value={this.state.password}
                 onChange={(e) => this.setState({ password: e.target.value })} />
             </Grid>
             <Grid item xs={12} alignContent='flex-end'>
               <Button onClick={this.handleLoginClick} color="primary" variant="contained">login</Button>
             </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(LoginButton);
