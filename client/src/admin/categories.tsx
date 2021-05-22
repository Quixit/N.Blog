import React, { Component } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
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

import { styles} from '../theme';
import Client from '../api/apiClient';
import GenericDialog from '../controls/genericDialog';
import { Category } from '../../../shared';

interface Props extends WithStyles {
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
    const { classes } = this.props;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Categories<IconButton color="primary" aria-label="Add" onClick={() => this.select(undefined, true)}><AddIcon fontSize="large" /></IconButton></Typography>
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
                          <IconButton color="primary" aria-label="Edit" onClick={() => this.select(u)}><EditIcon /></IconButton>
                          <IconButton color="primary" aria-label="Delete" onClick={() => this.setState({ deleteId: u._id})}><DeleteIcon /></IconButton>
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
                    onChange={(e) => this.setState({ name: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={this.state.description === ""}
                    label="Description"
                    className={classes.textField}
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
                  className={classes.button}
                  disabled={!this.isValid()}
                  onClick={() => this.save()}>
                  Save
                </Button>
                <Button
                  color="secondary"
                  aria-label="Cancel"
                  className={classes.button}
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

export default withStyles(styles)(Categories);
