import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';
import GenericDialog from '../controls/GenericDialog';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      deleteId: '',
      _id: '',
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    };

    this.serverError = this.props.serverError;
    this.list();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  isValid() {
    var state = this.state;

    return state.username !== '' && this.isEmail(this.state.email) && state.firstName !== '' && (state._id !== 'new' || state.password !== '' );
  }

  isEmail(address) {
    return !! address.match(/.+@.+\../);
  }

  passComplexity(password)
  {
  	var options = {
  		length: 8,
  		upperCase: true,
  		lowerCase: true,
  		number: true,
  		nonAlphaNumeric: false
  	};

  	var messages = [];

  	if (password.length < options.length)
  		messages.push("Password must be at least " + options.length + " characters.");

  	if (options.upperCase &&  !/[A-Z]/.test(password))
  		messages.push("Password must contain at least one upper case letter.");

  	if (options.lowerCase &&  !/[a-z]/.test(password))
  		messages.push("Password must contain at least one lower case letter.");


  	if (options.number &&  !/\d/.test(password))
  		messages.push("Password must contain at least one number.");

  	if (options.nonAlphaNumeric &&  !/\W/.test(password))
  		messages.push("Password must contain at least one non-alphanumeric character.");

  	return messages;
  };

  list() {
    Client.get('users').then(users => {
      this.setState({ items : users });
    })
    .catch(msg => {
      this.serverError(msg.error);
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
      Client.post('users', item)
      .then(users => {
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
    else {
      Client.put('users', item)
      .then(users => {
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
  }

  delete(result) {
    if (result === 'ok')
    {
      Client.delete('users', this.state.deleteId)
      .then(users => {
        this.setState({deleteId : ''});
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
    else {
      this.setState({deleteId : ''});
      this.select({});
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h2">Users<IconButton color="primary" aria-label="Add" onClick={e => this.select({_id : 'new'})}><AddIcon fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.deleteId !== '' }
          handleClose={ r => this.delete(r) }
          title="Confirm Delete"
          text={"This will permanently delete this user. Do you want to continue?"}
          type="ok"
        />
        {this.state._id === '' ?
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
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
                          <IconButton color="primary" aria-label="Edit" onClick={e => this.select(u)}><EditIcon /></IconButton>
                          <IconButton color="primary" aria-label="Delete" onClick={e => this.setState({ deleteId: u._id})}><DeleteIcon /></IconButton>
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
              <Grid item xs={12} className={classes.baseline}>
                <Typography variant="h4">{this.state._id === 'new' ? 'New' : 'Edit'}</Typography>
              </Grid>
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
                    error={!this.isEmail(this.state.email)}
                    helperText={this.state.email !== "" && !this.isEmail(this.state.email) ? 'Enter a valid email address.' : ''}
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
                    error={(this.state._id === 'new' || this.state.password !== '') && this.passComplexity(this.state.password).length > 0}
                    helperText ={(this.state._id === 'new' || this.state.password !== '') ? this.passComplexity(this.state.password)[0] : ''}
                    label="Set Password"
                    type="password"
                    className={classes.textField}
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    margin="normal"
                  />
                </form>
              </Grid>
              <Grid item xs={12} align="right">
                <Button
                  color="primary"
                  aria-label="Save"
                  className={classes.button}
                  disabled={!this.isValid()}
                  onClick={e => this.save()}>
                  Save
                </Button>
                <Button
                  color="secondary"
                  aria-label="Cancel"
                  className={classes.button}
                  onClick={e => this.select({})}>
                  Cancel
                </Button>
              </Grid>
            </Paper>
          </Grid>
        }
      </Grid>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Users);
