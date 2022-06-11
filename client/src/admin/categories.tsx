import React, { Component } from 'react';

import { TextField, IconButton, Button, Paper, TableRow, TableHead, TableCell, TableBody, Table, Grid, Typography } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

import Client from '../api/apiClient';
import GenericDialog from '../controls/genericDialog';
import { Category } from '../../../shared';

interface Props {
  serverError: (value: string) => void;
}

interface State {
  items: Category[];
  deleteId: string;
  _id: any;
  name: string;
  description: string;
}

class Categories extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      items: [],
      deleteId: '',
      _id: '',
      name: '',
      description: ''
    };

    this.list();
  }

  isValid() {
    var state = this.state;

    return state.name !== '' && state.description !== '';
  }

  list() {
    Client.get('categories').then(users => {
      this.setState({ items : users });
    })
    .catch(msg => {
      this.props.serverError(msg.error);
    });
  }

  select(item?: Category, isNew?: boolean) {
      this.setState({
        _id: item?._id || (isNew ? 'new' : ""),
        name: item?.name || '',
        description: item?.description || ''
      });
  }

  save() {
    var item = {
      _id: this.state._id,
      name: this.state.name,
      description: this.state.description
    };

    if (this.state._id === 'new') {
      Client.post('categories', item)
      .then(() => {
        this.select();
        this.list();
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
    else {
      Client.put('categories', item)
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
      Client.delete('categories', this.state.deleteId)
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
          <Typography variant="h2">Categories<IconButton color="primary" aria-label="Add" onClick={() => this.select(undefined, true)}><Add fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.deleteId !== '' }
          onClose={ r => this.delete(r) }
          title="Confirm Delete"
          text={"This will permanently delete this category. Do you want to continue?"}
          type="ok"
        />
        {this.state._id === '' ?
          <Grid item xs={12}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.items.map(u => {
                    return (
                      <TableRow key={u._id}>
                        <TableCell component="th" scope="row">
                          {u.name}
                        </TableCell>
                        <TableCell>{u.description}</TableCell>
                        <TableCell>
                          <IconButton color="primary" aria-label="Edit" onClick={() => this.select(u)}><Edit /></IconButton>
                          <IconButton color="primary" aria-label="Delete" onClick={() => this.setState({ deleteId: u._id})}><Delete /></IconButton>
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
                    error={this.state.name === ""}
                    label="Name"
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={this.state.description === ""}
                    label="Description"
                    value={this.state.description}
                    onChange={(e) => this.setState({ description: e.target.value })}
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

export default Categories;
