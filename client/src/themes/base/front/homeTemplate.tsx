import React, { Component } from 'react';
import { Link, RouteComponentProps} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WithStyles } from '@material-ui/core/styles';

import moment from 'moment-timezone';
import parse from 'html-react-parser';

import { Post, User } from '../../../../../shared';

interface Params {
  slug?: string;
}

interface Props extends WithStyles, RouteComponentProps<Params> {
  serverError: (value: string) => void;
  list: Post[];
  users: Map<string, User>;
  hasMore: boolean;
  getNext: () => void;
}

class Home extends Component<Props> {
  render() {
    const { classes, list, users, hasMore, getNext } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        {list.length < 1 && hasMore ? <CircularProgress className={classes.progress} /> : list.map((item) => (
          <div key={item.slug}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Link to={`/blog/${item.slug}`}>
                  <Typography variant="h4">{item.title}</Typography>
                </Link>
              </Grid>
              <Grid item xs={4}>
                  <Typography variant="body1" align="right">{moment(item.created).format('LLL')}</Typography>
                  <Typography variant="body1" align="right">{users.has(item.userId) ? parse('<a href="mailto:' + users.get(item.userId)?.email + '">' + users.get(item.userId)?.firstName + ' ' + users.get(item.userId)?.lastName + '</a>') : '' }</Typography>
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
        { hasMore && <Button onClick={() => getNext()}>Load More</Button>}
      </div>
    );
  }
}

export default Home;
