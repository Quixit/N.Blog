import React, { Component } from 'react';
import { Link} from "react-router-dom";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment-timezone';
import parse from 'html-react-parser';

import Client from '../api/apiClient';
import { Styles} from '../theme';

class Home extends Component {
  pageSize = 10;

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      users: {},
      hasMore: true
    };
    this.page = 0;
    this.serverError = props.serverError;
    this.getIndex();
  }
  getIndex()
  {
    Client.get('posts/index/' + this.page).then(posts => {
      this.setState({ list: this.state.list.concat(posts), hasMore: posts.length === this.pageSize });
    })
    .catch(msg => {
      this.serverError(msg.error);
    });

    Client.get('users').then(users => {
      let lookupUsers = {};

      for(let user of users)
      {
        lookupUsers[user._id] = user;
      }

      this.setState({ users: lookupUsers });
    })
    .catch(msg => {
      this.serverError(msg.error);
    });
  }
  getNext()
  {
    if (this.state.hasMore)
    {
      this.page += 1;
      this.getIndex();
    }
  }
  render() {
    const { classes /*, serverError*/ } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        {this.state.list.length < 1 && this.state.hasMore ? <CircularProgress className={classes.progress} /> : this.state.list.map((item, index) => (
          <div key={item.slug}>
            <Grid container spacing={16}>
              <Grid item xs={8}>
                <Link to={`/blog/${item.slug}`}>
                  <Typography variant="h4">{item.title}</Typography>
                </Link>
              </Grid>
              <Grid item xs={4}>
                  <Typography variant="body1" align="right">{moment(item.created).format('LLL')}</Typography>
                  <Typography variant="body1" align="right">{this.state.users[item.userId] == null ? '' : parse('<a href="mailto:' + this.state.users[item.userId].email + '">' + this.state.users[item.userId].firstName + ' ' + this.state.users[item.userId].lastName + '</a>') }</Typography>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.tableContainer} style={{ padding: 8 *2 }}>
                  <Typography component="div" variant="body1">
                      { item.description != null ? parse(item.description) : '' }
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            { this.state.hasMore && <Button onClick={() => this.getNext()}>Load More</Button>}
          </div>
        ))}
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Home);
