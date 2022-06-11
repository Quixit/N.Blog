import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

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
