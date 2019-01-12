import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Styles} from '../Theme';

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
      
      </div>
    );
  }
}

Blog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Blog);
