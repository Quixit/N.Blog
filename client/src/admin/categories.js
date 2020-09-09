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

import { Styles} from '../theme';
import Client from '../api/apiClient';
import GenericDialog from '../controls/genericDialog';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      deleteId: '',
      _id: '',
      name: '',
      description: ''
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

    return state.name !== '' && state.description !== '';
  }

  list() {
    Client.get('categories').then(users => {
      this.setState({ items : users });
    })
    .catch(msg => {
      this.serverError(msg.error);
    });
  }

  select(item) {
      this.setState({
        _id: item._id || '',
        name: item.name || '',
        description: item.description || ''
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
      .then(users => {
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
    else {
      Client.put('categories', item)
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
      Client.delete('categories', this.state.deleteId)
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
          <Typography variant="h2">Categories<IconButton color="primary" aria-label="Add" onClick={e => this.select({_id : 'new'})}><AddIcon fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.deleteId !== '' }
          handleClose={ r => this.delete(r) }
          title="Confirm Delete"
          text={"This will permanently delete this category. Do you want to continue?"}
          type="ok"
        />
        {this.state._id === '' ?
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
              <Table className={classes.table}>
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
                    error={this.state.name === ""}
                    label="Name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={this.state.description === ""}
                    label="Description"
                    className={classes.textField}
                    value={this.state.description}
                    onChange={this.handleChange('description')}
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

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Categories);
