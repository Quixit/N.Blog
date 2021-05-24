import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { GenericDialogProps } from '../../interfaces/props';

class GenericDialogTemplate extends Component<GenericDialogProps> {
  render() {
    const { open, onClose, title, text, type } = this.props;

    return (
      <Dialog
          open={open}
          onClose={onClose}
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
              <Button onClick={() => onClose('ok')} color="primary" autoFocus>
                Ok
              </Button>
              <Button onClick={() => onClose('cancel')} color="secondary">
                Cancel
              </Button>
            </DialogActions>
            :
            <DialogActions>
              <Button onClick={() => onClose('dismiss')} color="primary" autoFocus>
                Dismiss
              </Button>
            </DialogActions>
          }
        </Dialog>
    );
  }
}

export default GenericDialogTemplate;
