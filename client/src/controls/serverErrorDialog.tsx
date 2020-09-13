import React, { Component } from 'react';
import { styles } from '../theme';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  open: boolean;
  handleClose: () => void;
};

class ServerErrorDialog extends Component<Props> {
  render() {
    const { open, handleClose } = this.props;

    return (
      <Dialog
          open={open}
          onClose={handleClose}
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
            <Button onClick={handleClose} color="primary" autoFocus>
              Dismiss
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default withStyles(styles)(ServerErrorDialog);
