import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import parse from 'html-react-parser';

import { Styles} from '../theme';
import Client from '../api/apiClient';

class Page extends Component {
  constructor(props) {
    super(props);

    this.serverError = this.props.serverError;

    this.state = {
      display: {
        slug : null
      }
    };
  }
  getPage(slug)
  {
    if (slug !== this.state.display.slug)
    {
      Client.get('pages/slug/' + slug).then(page => {
        this.setState({ display: page.page });
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
  }
  render() {
    const { classes } = this.props;
    const slug = this.props.match.params.slug;

    this.getPage(slug);

    return (
      <div style={{ padding: 8 * 3 }}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h2">{this.state.display.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.tableContainer} style={{ padding: 8 *2 }}>
              <Typography variant="body1" component="div">
                { this.state.display.content != null ? parse(this.state.display.content) : '' }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Page.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Page);
