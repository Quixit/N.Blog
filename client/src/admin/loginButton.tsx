import React, { Component, ChangeEvent } from 'react';
import Client from '../api/apiClient';
import { styles } from '../theme';

import { WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {
  Redirect
} from "react-router-dom";


interface Props extends WithStyles {
  username?: string;
  password?: string;
};

interface State {
  username: string;
  password: string;
  isLoggedIn: boolean;
  loginOpen: boolean;
  redirectTo: string | null;
}

class LoginButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: props.username ?? "",
      password: props.password ?? "",
      isLoggedIn: Client.isLoggedIn,
      loginOpen: false,
      redirectTo: null
    };

    //This binding is necessary to make `this` work in the callback
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoffClick = this.handleLogoffClick.bind(this);
  }
  handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const name = target.name;

    if (name == "username") {
      this.setState({
        username: target.value
      });
    }
    else if (name == "password") {
      this.setState({
        password: target.value
      });
    }
  }
  handleLoginClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
  {
    event.preventDefault();
    Client.login(this.state.username,this.state.password).then(() => this.setState({ isLoggedIn : Client.isLoggedIn, redirectTo: this.redirectTo(Client.isLoggedIn)}));
    this.handleClose();
  }
  handleLogoffClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
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
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

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
            <Typography variant="h1" id="login-modal-title" gutterBottom>
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
                 onChange={this.handleInputChange} />
             </Grid>
             <Grid item xs={12}>
               <TextField
                 name="password"
                 type="password"
                 label="Password"
                 fullWidth
                 value={this.state.password}
                 onChange={this.handleInputChange} />
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
