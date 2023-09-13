import React, { Component } from 'react';

import { Divider, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, IconButton, Button, Paper, TableRow, TableHead, TableCell, TableBody, Table, Grid, Typography } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import Client from '../api/apiClient';
import GenericDialog from '../controls/genericDialog';
import { Category, Post } from '../../../shared';

interface Props {
  serverError: (value: string) => void;
}

interface State {
  items: Post[],
  categories: Category[],
  deleteId: string;
  _id: string;
  title: string;
  categoryId: string;
  tags: string;
  published: boolean;
  slug: string;
  editorDescriptionState: EditorState;
  editorState: EditorState;
}

class Posts extends Component<Props, State> {
  constructor(props: Props) {
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
  }

  componentDidMount(): void {
    this.list();
    this.listCategories();
  }

  handleEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState
    });
  };

  handleEditorDescriptionStateChange = (editorDescriptionState: EditorState) => {
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
      this.props.serverError(msg.error);
    });
  }

  listCategories() {
    Client.get('categories').then(categories => {
      this.setState({ categories });
    })
    .catch(msg => {
      this.props.serverError(msg.error);
    });
  }

  select(item?: Post, isNew?: boolean) {
      const contentBlock = htmlToDraft(item?.content || '');
      const descriptionBlock = htmlToDraft(item?.description || '');
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
        _id: item?._id || (isNew ? 'new' : ""),
        title: item?.title || '',
        published: item?.published || false,
        slug: item?.slug || '',
        categoryId: item?.categoryId || '',
        tags: item?.tags === undefined ? '' : item?.tags.join(','),
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
      .then(() => {
        this.select();
        this.list();
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
    else {
      Client.put('posts', item)
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
      Client.delete('posts', this.state.deleteId)
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

  uploadImageCallBack(file: Blob) {
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

  getCategory(id: string) {

    for(var i =0; i < this.state.categories.length; i++)
    {
        if (this.state.categories[i]._id === id)
          return this.state.categories[i];
    }

    return undefined;
  }

  render() {

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Blog<IconButton color="primary" aria-label="Add" onClick={() => this.select(undefined, true)}><Add fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.deleteId !== '' }
          onClose={ r => this.delete(r) }
          title="Confirm Delete"
          text={"This will permanently delete this post. Do you want to continue?"}
          type="ok"
        />
        {this.state._id === '' ?
          <Grid item xs={12}>
            <Paper>
              <Table>
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
                        <TableCell>{this.getCategory(p.categoryId)?.name}</TableCell>
                        <TableCell>{p.published ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <IconButton color="primary" aria-label="Edit" onClick={() => this.select(p)}><Edit /></IconButton>
                          <IconButton color="primary" aria-label="Delete" onClick={() => this.setState({ deleteId: p._id})}><Delete /></IconButton>
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
                    error={this.state.title === ""}
                    label="Title"
                    value={this.state.title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={this.state.slug === ""}
                    label="Slug"
                    value={this.state.slug }
                    onChange={(e) => this.setState({ slug: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    select
                    label="Category"
                    value={this.state.categoryId}
                    onChange={(e) => this.setState({ categoryId: e.target.value })}
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
                    helperText="Separated by commas"
                    value={this.state.tags }
                    onChange={(e) => this.setState({ tags: e.target.value })}
                    margin="normal"
                  />
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <FormGroup>
                    <FormControlLabel
                       control={
                         <Checkbox
                           checked={this.state.published}
                           onChange={(e) => this.setState({ published: e.target.checked })}
                         />
                       }
                       label="Published" />
                  </FormGroup>
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

export default Posts;
