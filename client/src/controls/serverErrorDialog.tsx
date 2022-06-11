import React, { Component } from 'react';
import { ServerErrorDialogTemplate } from '../theme';

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

export default (ServerErrorDialog);
