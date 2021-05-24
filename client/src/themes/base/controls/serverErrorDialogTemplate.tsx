import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ServerErrorDialogProps } from '../../interfaces/props';

class ServerErrorDialogTemplate extends Component<ServerErrorDialogProps> {
  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Connection Error"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              There has been an error communicating with the server. Please check your inputs and try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" autoFocus>
              Dismiss
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default ServerErrorDialogTemplate;
