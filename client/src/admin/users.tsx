import React, { Component } from 'react';

import { TextField, IconButton, Button, Paper, TableRow, TableHead, TableCell, TableBody, Table, Grid, Typography } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

import Client from '../api/apiClient';
import GenericDialog from '../controls/genericDialog';
import { User } from '../../../shared';

interface Props {
  serverError: (value: string) => void;
}

interface State {
  items: User[],
  deleteId: string,
  _id: string,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  password: string
}

class Users extends Component<Props, State> {
  constructor(props: Props) {
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

    this.list();
  }

  isValid() {
    var state = this.state;

    return state.username !== '' && this.isEmail(this.state.email) && state.firstName !== '' && (state._id !== 'new' || state.password !== '' );
  }

  isEmail(address: string) {
    return !! address.match(/.+@.+\../);
  }

  passComplexity(password: string)
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
      this.props.serverError(msg.error);
    });
  }

  select(item?: User, isNew?: boolean) {
      this.setState({
        _id: item?._id || (isNew ? 'new' : ''),
        username: item?.username || '',
        email: item?.email || '',
        firstName: item?.firstName || '',
        lastName: item?.lastName || '',
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
      .then(() => {
        this.select();
        this.list();
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
    else {
      Client.put('users', item)
      .then(() => {
        this.select();
        this.list();
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
  }

  delete(result: string) {
    if (result === 'ok')
    {
      Client.delete('users', this.state.deleteId)
      .then(() => {
        this.setState({deleteId : ''});
        this.select();
        this.list();
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
    else {
      this.setState({deleteId : ''});
      this.select();
    }
  }

  render() {

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Users<IconButton color="primary" aria-label="Add" onClick={e => this.select(undefined, true)}><Add fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.deleteId !== '' }
          onClose={ r => this.delete(r) }
          title="Confirm Delete"
          text={"This will permanently delete this user. Do you want to continue?"}
          type="ok"
        />
        {this.state._id === '' ?
          <Grid item xs={12}>
            <Paper>
              <Table>
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
                          <IconButton color="primary" aria-label="Edit" onClick={e => this.select(u)}><Edit /></IconButton>
                          <IconButton color="primary" aria-label="Delete" onClick={e => this.setState({ deleteId: u._id})}><Delete /></IconButton>
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
              <Grid item xs={12}>
                <Typography variant="h4">{this.state._id === 'new' ? 'New' : 'Edit'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <form noValidate autoComplete="off">
                  <TextField
                    required
                    error={this.state.username === ""}
                    label="Username"               
                    value={this.state.username}
                    onChange={(e) => this.setState({ username: e.target.value})}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={!this.isEmail(this.state.email)}
                    helperText={this.state.email !== "" && !this.isEmail(this.state.email) ? 'Enter a valid email address.' : ''}
                    label="Email"
                    type="email"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value})}
                    margin="normal"
                  />
                  <TextField
                    label="First Name"
                    required
                    error={this.state.firstName === ""}
                    value={this.state.firstName}
                    onChange={(e) => this.setState({ firstName: e.target.value})}
                    margin="normal"
                  />
                  <TextField
                    label="Last Name"
                    value={this.state.lastName}
                    onChange={(e) => this.setState({ lastName: e.target.value})}
                    margin="normal"
                  />
                  <TextField
                    required = {this.state._id === 'new'}
                    error={(this.state._id === 'new' || this.state.password !== '') && this.passComplexity(this.state.password).length > 0}
                    helperText ={(this.state._id === 'new' || this.state.password !== '') ? this.passComplexity(this.state.password)[0] : ''}
                    label="Set Password"
                    type="password"
                    value={this.state.password}
                    onChange={(e) => this.setState({ password: e.target.value})}
                    margin="normal"
                  />
                </form>
              </Grid>
              <Grid item xs={12} alignContent="flex-end">
                <Button
                  color="primary"
                  aria-label="Save"
                  disabled={!this.isValid()}
                  onClick={() => this.save()}>
                  Save
                </Button>
                <Button
                  color="secondary"
                  aria-label="Cancel"
                  onClick={() => this.select()}>
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

export default Users;
