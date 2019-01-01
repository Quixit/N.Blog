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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';

import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';
import GenericDialog from '../controls/GenericDialog';

class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      serverError: '',
      deleteId: '',
      _id: '',
      title: '',
      description: '',
      content: '',
      published: false,
      slug: '',
      parent: '',
      editorState: EditorState.createEmpty()
    };

    this.list();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleCheck = name => event => {
    this.setState({
      [name]: event.target.checked,
    });
  };

  handleEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  isValid() {
    var state = this.state;

    return state.title !== '' && state.slug !== '' && this.state.parent !== this.state._id;
  }

  list() {
    Client.get('pages').then(pages => {
      this.setState({ items : pages });
    })
    .catch(msg => {
      this.setState({ serverError: msg.error })
    });
  }

  select(item) {
      this.setState({
        _id: item._id || '',
        title: item.title || '',
        description: item.description || '',
        content: item.content || '',
        published: item.published || false,
        slug: item.slug || '',
        parent: item.parent || ''
      });
  }

  save() {
    var item = {
      _id: this.state._id,
      title: this.state.title,
      description: this.state.description,
      content: this.state.content,
      published: this.state.published,
      slug: this.state.slug,
      parent: this.state.parent
    };

    if (this.state._id === 'new') {
      Client.post('pages', item)
      .then(users => {
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.setState({ serverError: msg.error })
      });
    }
    else {
      Client.put('pages', item)
      .then(users => {
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.setState({ serverError: msg.error })
      });
    }

    this.select({});
    this.list();
  }

  delete(result) {
    if (result === 'ok')
    {
      Client.delete('pages', this.state.deleteId)
      .then(users => {
        this.setState({deleteId : ''});
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.setState({ serverError: msg.error })
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
          <Typography variant="h2" gutterBottom>Pages<IconButton color="primary" aria-label="Add" onClick={e => this.select({_id : 'new'})}><AddIcon fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.serverError !== '' }
          handleClose={r => this.setState({serverError : ''})}
          title="Request Error"
          text={"There has been an error processing your request. " + this.state.serverError}
        />
        <GenericDialog
          open={ this.state.deleteId !== '' }
          handleClose={ r => this.delete(r) }
          title="Confirm Delete"
          text={"This will permanently delete this page. Do you want to continue?"}
          type="ok"
        />
        {this.state._id === '' ?
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Published</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.items.map(p => {
                    return (
                      <TableRow key={p._id}>
                        <TableCell component="th" scope="row">
                          {p.title}
                        </TableCell>
                        <TableCell>{p.slug}</TableCell>
                        <TableCell>{p.published ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <IconButton color="primary" aria-label="Edit" onClick={e => this.select(p)}><EditIcon /></IconButton>
                          <IconButton color="primary" aria-label="Delete" onClick={e => this.setState({ deleteId: p._id})}><DeleteIcon /></IconButton>
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
                    error={this.state.title === ""}
                    label="Title"
                    className={classes.textField}
                    value={this.state.title}
                    onChange={this.handleChange('title')}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={this.state.slug === ""}
                    label="Slug"
                    className={classes.textField}
                    value={this.state.slug }
                    onChange={this.handleChange('slug')}
                    margin="normal"
                  />
                  <TextField
                    label="Description"
                    className={classes.textField}
                    value={this.state.description }
                    onChange={this.handleChange('description')}
                    margin="normal"
                  />
                  <TextField
                    label="Content"
                    className={classes.textField}
                    value={this.state.content }
                    onChange={this.handleChange('content')}
                    margin="normal"
                  />
                  <TextField
                    select
                    label="Parent"
                    error={this.state.parent === this.state._id}
                    helperText ={this.state.parent === this.state._id ? 'A page cannot be its own parent' : ''}
                    className={classes.textField}
                    value={this.state.parent}
                    onChange={this.handleChange('parent')}
                    margin="normal"
                  >
                    <MenuItem key={1} value={''}>
                    </MenuItem>
                    {this.state.items.map(option => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormGroup
                    margin="normal"
                    className={classes.textField}
                  >
                  <FormControlLabel
                     control={
                       <Checkbox
                         checked={this.state.published}
                         onChange={this.handleCheck('published')}
                       />
                     }
                     label="Published"
                  />
                  </FormGroup>

                  <div>
                    <Editor
                      editorState={this.state.editorState}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      onEditorStateChange={this.handleEditorStateChange}
                    />
                    <textarea
                      disabled
                      value={draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}
                    />
                  </div>
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

Pages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Pages);
