import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { Styles} from '../theme';
import Client from '../api/ApiClient';

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Blog</Typography>
        </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
    );
  }
}

Blog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Blog);
