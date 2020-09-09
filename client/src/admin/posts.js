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
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { Styles} from '../theme';
import Client from '../api/apiClient';
import GenericDialog from '../controls/genericDialog';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      categories: [],
      deleteId: '',
      _id: '',
      title: '',
      categoryId: '',
      tags: '',
      published: false,
      slug: '',
      editorDescriptionState: EditorState.createEmpty(),
      editorState: EditorState.createEmpty()
    };

    this.serverError = this.props.serverError;
    this.list();
    this.listCategories();
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
      editorState
    });
  };

  handleEditorDescriptionStateChange: Function = (editorDescriptionState) => {
    this.setState({
      editorDescriptionState
    });
  };

  isValid() {
    var state = this.state;

    return state.title !== '' && state.slug !== '';
  }

  list() {
    Client.get('posts').then(posts => {
      this.setState({ items : posts });
    })
    .catch(msg => {
      this.serverError(msg.error);
    });
  }

  listCategories() {
    Client.get('categories').then(categories => {
      this.setState({ categories });
    })
    .catch(msg => {
      this.serverError(msg.error);
    });
  }

  select(item) {
      const contentBlock = htmlToDraft(item.content || '');
      const descriptionBlock = htmlToDraft(item.description || '');
      let editorState, editorDescriptionState;

      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        editorState = EditorState.createWithContent(contentState);
      }

      if (descriptionBlock) {
        const contentDescriptionState = ContentState.createFromBlockArray(descriptionBlock.contentBlocks);
        editorDescriptionState = EditorState.createWithContent(contentDescriptionState);
      }

      this.setState({
        _id: item._id || '',
        title: item.title || '',
        published: item.published || false,
        slug: item.slug || '',
        categoryId: item.categoryId || '',
        tags: item.tags === undefined ? '' : item.tags.join(','),
        editorState: editorState || EditorState.createEmpty(),
        editorDescriptionState: editorDescriptionState || EditorState.createEmpty()
      });
  }

  save() {
    var item = {
      _id: this.state._id,
      title: this.state.title,
      description: draftToHtml(convertToRaw(this.state.editorDescriptionState.getCurrentContent())),
      content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
      published: this.state.published,
      slug: this.state.slug,
      categoryId: this.state.categoryId,
      tags: this.state.tags.split(',')
    };

    if (this.state._id === 'new') {
      Client.post('posts', item)
      .then(users => {
        this.select({});
        this.list();
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
    else {
      Client.put('posts', item)
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
      Client.delete('posts', this.state.deleteId)
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

  uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        var reader  = new FileReader();

        reader.addEventListener("load", function () {
            resolve({ data: { link: reader.result } })
          }, false);
        reader.addEventListener("error", function () {
          reject(reader.result);
        }, false);

        if (file) {
          reader.readAsDataURL(file);
        }
      }
    );
  }

  getCategory(id) {

    for(var i =0; i < this.state.categories.length; i++)
    {
        if (this.state.categories[i]._id === id)
          return this.state.categories[i];
    }

    return {};
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h2">Blog<IconButton color="primary" aria-label="Add" onClick={e => this.select({_id : 'new'})}><AddIcon fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.deleteId !== '' }
          handleClose={ r => this.delete(r) }
          title="Confirm Delete"
          text={"This will permanently delete this post. Do you want to continue?"}
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
                    <TableCell>Category</TableCell>
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
                        <TableCell>{this.getCategory(p.categoryId).name}</TableCell>
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
                    select
                    label="Category"
                    className={classes.textField}
                    value={this.state.categoryId}
                    onChange={this.handleChange('categoryId')}
                    margin="normal"
                  >
                    <MenuItem key={1} value={''}>
                    </MenuItem>
                    {this.state.categories.map(option => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Tags"
                    className={classes.textField}
                    helperText="Separated by commas"
                    value={this.state.tags }
                    onChange={this.handleChange('tags')}
                    margin="normal"
                  />
                  <Grid item xs={12} className={classes.baseline}>
                    <Typography variant="h6">Description</Typography>
                  </Grid>
                  <div>
                    <Editor
                      editorState={this.state.editorDescriptionState}
                      onEditorStateChange={this.handleEditorDescriptionStateChange}
                      toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, previewImage: true, alt: { present: true, mandatory: true } },
                      }}
                    />
                  </div>
                  <Divider light/>
                  <Grid item xs={12} className={classes.baseline}>
                    <Typography variant="h6">Detailed</Typography>
                  </Grid>
                  <div>
                    <Editor
                      editorState={this.state.editorState}
                      onEditorStateChange={this.handleEditorStateChange}
                      toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, previewImage: true, alt: { present: true, mandatory: true } },
                      }}
                    />
                  </div>
                  <Divider light/>
                  <FormGroup
                    margin="normal"
                    className={classes.textField}>
                    <FormControlLabel
                       control={
                         <Checkbox
                           checked={this.state.published}
                           onChange={this.handleCheck('published')}
                         />
                       }
                       label="Published" />
                  </FormGroup>
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

Posts.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Posts);
