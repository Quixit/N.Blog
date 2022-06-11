import React, { Component } from 'react';

import {GenericDialogTemplate } from '../theme';

interface Props {
  open: boolean;
  onClose: (result: string) => void;
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

export default GenericDialog;
