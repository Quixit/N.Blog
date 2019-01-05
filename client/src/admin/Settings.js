import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';

class Settings extends Component {
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
          <Typography variant="h2" gutterBottom>Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid item xs={12} className={classes.baseline}>
              <Typography variant="body">Reserved for Future Use</Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Settings);
