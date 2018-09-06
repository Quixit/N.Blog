import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import LoginButton from '../admin/LoginButton'
import { Styles} from '../Theme';

class Front extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="body1">Front-End</Typography>
        <LoginButton />
      </div>
    );
  }
}

Front.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Front);
