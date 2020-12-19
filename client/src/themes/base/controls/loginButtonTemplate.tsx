import React, { Component } from 'react';

import { WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

interface Props extends WithStyles {
  username: string;
  password: string;
  handleLoginClick: (event: React.MouseEvent<HTMLButtonElement,MouseEvent>) => void;
  handleLogoffClick: (event: React.MouseEvent<HTMLButtonElement,MouseEvent>) => void;
  handleOpen: () => void;
  handleClose: () => void;
  loginOpen: boolean;
  isLoggedIn: boolean;
}

class LoginButtonTemplate extends Component<Props> {
  render() {
    const { classes, handleLoginClick, handleLogoffClick, handleOpen, handleClose, loginOpen, isLoggedIn, username, password } = this.props;

    return (
      <div>
        {!isLoggedIn ? (<Button onClick={handleOpen} color="secondary">Login</Button>) : (<Button onClick={handleLogoffClick} color="secondary">Log Out</Button>)}
        <Modal
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
          open={loginOpen}
          onClose={handleClose}>
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
                 value={username}
                 onChange={(e) => this.setState({ username: e.target.value })} />
             </Grid>
             <Grid item xs={12}>
               <TextField
                 name="password"
                 type="password"
                 label="Password"
                 fullWidth
                 value={password}
                 onChange={(e) => this.setState({ password: e.target.value })} />
             </Grid>
             <Grid item xs={12} alignContent='flex-end'>
               <Button onClick={handleLoginClick} color="primary" variant="contained">login</Button>
             </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginButtonTemplate;
