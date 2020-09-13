import React, { Component } from 'react';
import { Link, RouteComponentProps} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import moment from 'moment-timezone';
import parse from 'html-react-parser';

import Client from '../api/apiClient';
import { styles } from '../theme';
import { Post, User } from '../../../shared';

interface Params {
  slug?: string;
}

interface Props extends WithStyles, RouteComponentProps<Params> {
  serverError: (value: string) => void;
}

interface State {
  list: Post[];
  users: Map<string, User>;
  hasMore: boolean;
}

class Home extends Component<Props, State> {
  pageSize = 10;
  page = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      list: [],
      users: new Map(),
      hasMore: true
    };

    this.getIndex();
  }
  getIndex()
  {
    Client.get('posts/index/' + this.page).then(posts => {
      this.setState({ list: this.state.list.concat(posts), hasMore: posts.length === this.pageSize });
    })
    .catch(msg => {
      this.props.serverError(msg.error);
    });

    Client.get('users').then(users => {
      let lookupUsers = new Map<string, User>();

      for(let user of users)
      {
        lookupUsers.set(user._id, user);
      }

      this.setState({ users: lookupUsers });
    })
    .catch(msg => {
      this.props.serverError(msg.error);
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
    const { classes } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        {this.state.list.length < 1 && this.state.hasMore ? <CircularProgress className={classes.progress} /> : this.state.list.map((item) => (
          <div key={item.slug}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Link to={`/blog/${item.slug}`}>
                  <Typography variant="h4">{item.title}</Typography>
                </Link>
              </Grid>
              <Grid item xs={4}>
                  <Typography variant="body1" align="right">{moment(item.created).format('LLL')}</Typography>
                  <Typography variant="body1" align="right">{this.state.users.has(item.userId) ? parse('<a href="mailto:' + this.state.users.get(item.userId)?.email + '">' + this.state.users.get(item.userId)?.firstName + ' ' + this.state.users.get(item.userId)?.lastName + '</a>') : '' }</Typography>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.tableContainer} style={{ padding: 8 *2 }}>
                  <Typography component="div" variant="body1">
                      { item.description != null ? parse(item.description) : '' }
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </div>
        ))}
        { this.state.hasMore && <Button onClick={() => this.getNext()}>Load More</Button>}
      </div>
    );
  }
}

export default withStyles(styles)(Home);
