import React, { Component } from 'react';

import { WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props extends WithStyles {
  open: boolean;
  handleClose: (result: string) => void;
  title: string;
  text: string;
  type?: string;
}

class GenericDialogTemplate extends Component<Props> {
  render() {
    const { open, handleClose, title, text, type } = this.props;

    return (
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {text}
            </DialogContentText>
          </DialogContent>
          {
            type === 'ok' ?
            <DialogActions>
              <Button onClick={() => handleClose('ok')} color="primary" autoFocus>
                Ok
              </Button>
              <Button onClick={() => handleClose('cancel')} color="secondary">
                Cancel
              </Button>
            </DialogActions>
            :
            <DialogActions>
              <Button onClick={() => handleClose('dismiss')} color="primary" autoFocus>
                Dismiss
              </Button>
            </DialogActions>
          }
        </Dialog>
    );
  }
}

export default GenericDialogTemplate;
