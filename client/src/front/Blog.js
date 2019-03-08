import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import parse from 'html-react-parser';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';

class Blog extends Component {
  constructor(props) {
    super(props);

    this.serverError = this.props.serverError;

    this.state = {
      display: {
        slug : null
      }
    };
  }
  getPost(slug)
  {
    if (slug !== this.state.display.slug)
    {
      Client.get('posts/slug/' + slug).then(post => {
        this.setState({ display: post.post });
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
  }
  render() {
    const { classes } = this.props;
    const slug = this.props.match.params.slug;

    this.getPost(slug);

    return (
      <div style={{ padding: 8 * 3 }}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h2">{this.state.display.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.tableContainer} style={{ padding: 8 *2 }}>
              <Typography variant="body1">
                { this.state.display.content != null ? parse(this.state.display.content) : '' }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Blog.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Blog);
