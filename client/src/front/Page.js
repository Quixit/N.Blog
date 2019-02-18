import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Styles} from '../Theme';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { classes, serverError } = this.props;

    return (
      <div>

      </div>
    );
  }
}

Page.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Page);
