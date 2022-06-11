import React, { Component } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

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
