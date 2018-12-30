import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Styles} from '../Theme';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

class ServerErrorDialog extends Component {
  render() {
    const { classes, open, handleClose } = this.props;

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

ServerErrorDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withStyles(Styles)(ServerErrorDialog);
