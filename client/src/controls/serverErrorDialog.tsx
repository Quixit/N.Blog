import React, { Component } from 'react';
import { ServerErrorDialogTemplate, styles } from '../theme';

import { withStyles } from '@material-ui/core/styles';

interface Props {
  open: boolean;
  onClose: () => void;
};

class ServerErrorDialog extends Component<Props> {
  render() {
    return (
      <ServerErrorDialogTemplate {...this.props} />
    );
  }
}

export default withStyles(styles)(ServerErrorDialog);
