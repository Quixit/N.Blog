import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from '../api/apiClient';
import { Styles} from '../theme';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {
  Redirect
} from "react-router-dom";

class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      password: props.password,
      isLoggedIn: Client.isLoggedIn,
      loginOpen: false,
      redirectTo: null
    };

    //This binding is necessary to make `this` work in the callback
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoffClick = this.handleLogoffClick.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleLoginClick(event)
  {
    event.preventDefault();
    Client.login(this.state.username,this.state.password).then(a => this.setState({ isLoggedIn : Client.isLoggedIn, redirectTo: this.redirectTo(Client.isLoggedIn)}));
    this.handleClose();
  }
  handleLogoffClick(event)
  {
    event.preventDefault();
    Client.logoff().then(a => this.setState({ isLoggedIn : Client.isLoggedIn, redirectTo: this.redirectTo(Client.isLoggedIn) }));
  }
  handleOpen = () => {
   this.setState({ loginOpen: true });
  }
  handleClose = () => {
   this.setState({ loginOpen: false });
  }
  redirectTo(loggedIn)
  {
    return  loggedIn ? '/admin' : "/";
  }
  render() {
    const { classes } = this.props;

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div>
        {!this.state.isLoggedIn ? (<Button onClick={this.handleOpen} color="secondary">Login</Button>) : (<Button onClick={this.handleLogoffClick} color="secondary">Log Out</Button>)}
        <Modal
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
          open={this.state.loginOpen}
          onClose={this.handleClose}>
          <div className={classes.modalPaper}>
            <Typography variant="title" id="login-modal-title" gutterBottom>
              Login
            </Typography>
            <Grid container spacing={16}>
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
             <Grid item xs={12} align='end'>
               <Button onClick={this.handleLoginClick} color="primary" variant="contained">login</Button>
             </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

LoginButton.propTypes = {
  classes: PropTypes.object.isRequired,
  username: PropTypes.string,
  password: PropTypes.string
};

export default withStyles(Styles)(LoginButton);
