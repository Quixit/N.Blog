import React, { Component } from 'react';

import { Typography, Modal, Button, TextField, Grid } from "@mui/material";

import { LoginButtonProps } from '../../interfaces/props';

class LoginButtonTemplate extends Component<LoginButtonProps> {
  render() {
    const { onLoginClick, onLogoffClick, onOpen, onClose, loginOpen, isLoggedIn, username, password, onUsernameChange, onPasswordChange } = this.props;

    return (
      <div>
        {!isLoggedIn ? (<Button onClick={onOpen} color="secondary">Login</Button>) : (<Button onClick={onLogoffClick} color="secondary">Log Out</Button>)}
        <Modal
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
          open={loginOpen}
          onClose={onClose}>
          <div>
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
             <Grid item xs={12} alignContent='flex-end'>
               <Button onClick={onLoginClick} color="primary" variant="contained">login</Button>
             </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginButtonTemplate;
