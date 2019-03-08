import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment-timezone';
import parse from 'html-react-parser';

import Client from '../api/ApiClient';
import { Styles} from '../Theme';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      page: 0
    };

    this.serverError = props.serverError;
    this.getIndex();
  }
  getIndex()
  {
    Client.get('posts/index/' + this.state.page).then(posts => {
      this.setState({ list: this.state.list.concat(posts) });
    })
    .catch(msg => {
      this.serverError(msg.error);
    });
  }
  getNext()
  {
    this.setState({ page: this.state.page + 1 });
    this.getIndex();
  }
  render() {
    const { classes /*, serverError*/ } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        {this.state.list.map((item, index) => (
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h4">{item.title} {moment(item.created).format('LLL')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.tableContainer} style={{ padding: 8 *2 }}>
                <Typography variant="body1">
                    { item.description != null ? parse(item.description) : '' }
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        ))}
        <Button onClick={() => this.getNext()}>Load More</Button>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Home);
