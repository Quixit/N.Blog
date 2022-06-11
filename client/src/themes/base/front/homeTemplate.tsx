import { Component } from 'react';
import { Link} from "react-router-dom";
import { Typography, Grid, Paper, CircularProgress, Button } from "@mui/material";

import moment from 'moment-timezone';
import parse from 'html-react-parser';

import { HomeProps } from '../../interfaces/props';

class Home extends Component<HomeProps> {
  render() {
    const { list, users, hasMore, getNext } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        {list.length < 1 && hasMore ? <CircularProgress /> : list.map((item) => (
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
                <Paper style={{ padding: 8 *2 }}>
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
