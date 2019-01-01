import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Styles} from '../Theme';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ServerErrorDialog extends Component {
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
              <Button onClick={e => handleClose('ok')} color="primary" autoFocus>
                Ok
              </Button>
              <Button onClick={e => handleClose('cancel')} color="secondary">
                Cancel
              </Button>
            </DialogActions>
            :
            <DialogActions>
              <Button onClick={e => handleClose('dismiss')} color="primary" autoFocus>
                Dismiss
              </Button>
            </DialogActions>
          }
        </Dialog>
    );
  }
}

ServerErrorDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default withStyles(Styles)(ServerErrorDialog);
