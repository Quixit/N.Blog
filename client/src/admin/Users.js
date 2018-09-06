import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };

    this.list = this.list.bind(this);

    this.list();
  }

  list() {
    Client.get('users').then(users => {
      this.setState({ users: users });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="title" gutterBottom>Users</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.users.map(u => {
                  return (
                    <TableRow key={u.id}>
                      <TableCell component="th" scope="row">
                        {u.username}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.firstName}</TableCell>
                      <TableCell>{u.lastName}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Users);
