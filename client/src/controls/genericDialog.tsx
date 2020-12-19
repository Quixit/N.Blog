import React, { Component } from 'react';
import { styles } from '../theme';

import { WithStyles, withStyles } from '@material-ui/core/styles';

import {GenericDialogTemplate } from '../theme';

interface Props extends WithStyles {
  open: boolean;
  handleClose: (result: string) => void;
  title: string;
  text: string;
  type?: string;
}

class GenericDialog extends Component<Props> {
  render() {
    return (
      <GenericDialogTemplate {...this.props} />
    );
  }
}

export default withStyles(styles)(GenericDialog);
