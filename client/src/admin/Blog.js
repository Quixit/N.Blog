import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { Styles} from '../Theme';
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
          <Typography variant="title" gutterBottom>Blog</Typography>
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
