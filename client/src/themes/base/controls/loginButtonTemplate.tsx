import React, { Component } from 'react';

import { Typography, Button, TextField, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { LoginButtonProps } from '../../interfaces/props';

class LoginButtonTemplate extends Component<LoginButtonProps> {
  render() {
    const { onLoginClick, onLogoffClick, onOpen, onClose, loginOpen, isLoggedIn, username, password, onUsernameChange, onPasswordChange } = this.props;

    return (
      <div>
        {!isLoggedIn ? (<Button onClick={onOpen} color="secondary">Login</Button>) : (<Button onClick={onLogoffClick} color="secondary">Log Out</Button>)}
        <Dialog
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
          open={loginOpen}
          onClose={onClose}>
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h6" id="login-modal-title" gutterBottom>
              Login
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  type="text"
                  label="Username"
                  fullWidth
                  value={username}
                  onChange={onUsernameChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                  value={password}
                  onChange={onPasswordChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onLoginClick} color="primary" variant="contained">Login</Button>
            <Button onClick={onClose} color="secondary" variant="contained">Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LoginButtonTemplate;
