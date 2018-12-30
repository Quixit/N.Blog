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
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';
import ServerErrorDialog from '../controls/ServerErrorDialog';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      serverError: false,
      _id: '',
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    };

    this.list();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  isEmail(address) {
    return !! address.match(/.+@.+\../);
  }

  list() {
    Client.get('users').then(users => {
      this.setState({ items : users });
    });
  }

  select(item) {
      this.setState({
        _id: item._id || '',
        username: item.username || '',
        email: item.email || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        password: ''
      });
  }

  save() {
    var item = {
      _id: this.state._id,
      username: this.state.username,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      password: this.state.password
    };

    if (this.state._id === 'new') {
      Client.post('users', item).then(users => {
        this.select({});
        this.list();
      });
    }
    else {
      Client.put('users', item).then(users => {
        this.select({});
        this.list();
      });
    }

    this.select({});
    this.list();
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Users <Button color="primary" aria-label="Add" onClick={e => this.select({_id : 'new'})}><AddIcon fontSize="large" /></Button></Typography>

        </Grid>
        {this.state._id == '' ?
          <Grid item xs={12}>
            <Paper>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.items.map(u => {
                    return (
                      <TableRow key={u._id}>
                        <TableCell component="th" scope="row">
                          {u.username}
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.firstName}</TableCell>
                        <TableCell>{u.lastName}</TableCell>
                        <TableCell>
                          <Button color="primary" aria-label="Edit" onClick={e => this.select(u)}><EditIcon /></Button>
                          <Button color="primary" aria-label="Delete"><DeleteIcon /></Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          :
          <Grid item xs={12}>
            <Paper>
              <Typography variant="h4">{this.state._id === 'new' ? 'New' : 'Edit'}</Typography>
              <Grid item xs={12}>
                <form className={classes.container} noValidate autoComplete="off">
                  <TextField
                    required
                    error={this.state.username === ""}
                    label="Username"
                    className={classes.textField}
                    value={this.state.username}
                    onChange={this.handleChange('username')}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={this.state.email === "" || !this.isEmail(this.state.email)}
                    helperText={this.state.email != "" && !this.isEmail(this.state.email) ? 'Enter a valid email address.' : ''}
                    label="Email"
                    type="email"
                    className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                    margin="normal"
                  />
                  <TextField
                    label="First Name"
                    required
                    error={this.state.firstName === ""}
                    className={classes.textField}
                    value={this.state.firstName}
                    onChange={this.handleChange('firstName')}
                    margin="normal"
                  />
                  <TextField
                    label="Last Name"
                    className={classes.textField}
                    value={this.state.lastName}
                    onChange={this.handleChange('lastName')}
                    margin="normal"
                  />
                  <TextField
                    required = {this.state._id === 'new'}
                    error={this.state._id === 'new' && this.state.password == ''}
                    label="Set Password"
                    className={classes.textField}
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    margin="normal"
                  />
                </form>
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" aria-label="Save" className={classes.button} onClick={e => this.save()}>Save</Button>
                <Button color="secondary" aria-label="Cancel" className={classes.button} onClick={e => this.select({})}>Cancel</Button>
                <ServerErrorDialog open={ this.state.serverError } handleClose={e => this.setState({serverError : false})} />
              </Grid>
            </Paper>
          </Grid>
        }
      </Grid>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Users);
