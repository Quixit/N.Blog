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

import { styles } from '../theme';
import Client from '../api/apiClient';
import GenericDialog from '../controls/genericDialog';
import { Page } from '../../../shared';

interface Props extends WithStyles {
  serverError: (value: string) => void;
}

interface State {
    items: Page[];
    deleteId: string;
    _id: string;
    title: string;
    description: string;
    published: boolean;
    slug: string;
    parent: string;
    editorState: EditorState;
}

class Pages extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      items: [],
      deleteId: '',
      _id: '',
      title: '',
      description: '',
      published: false,
      slug: '',
      parent: '',
      editorState: EditorState.createEmpty()
    };

    this.list();
  }

  handleEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState
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
      this.props.serverError(msg.error);
    });
  }

  select(item?: Page, isNew?: boolean) {
      const contentBlock = htmlToDraft(item?.content || '');
      let editorState;

      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        editorState = EditorState.createWithContent(contentState);
      }

      this.setState({
        _id: item?._id || (isNew ? 'new' : ""),
        title: item?.title || '',
        description: item?.description || '',
        published: item?.published || false,
        slug: item?.slug || '',
        parent: item?.parent || '',
        editorState: editorState || EditorState.createEmpty()
      });
  }

  save() {
    var item = {
      _id: this.state._id,
      title: this.state.title,
      description: this.state.description,
      content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
      published: this.state.published,
      slug: this.state.slug,
      parent: this.state.parent
    };

    if (this.state._id === 'new') {
      Client.post('pages', item)
      .then(() => {
        this.select();
        this.list();
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
    else {
      Client.put('pages', item)
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
      Client.delete('pages', this.state.deleteId)
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

  getParent(id: string) {

    for(var i =0; i < this.state.items.length; i++)
    {
        if (this.state.items[i]._id === id)
          return this.state.items[i];
    }

    return undefined;
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Pages<IconButton color="primary" aria-label="Add" onClick={() => this.select(undefined, true)}><AddIcon fontSize="large" /></IconButton></Typography>
        </Grid>
        <GenericDialog
          open={ this.state.deleteId !== '' }
          onClose={ r => this.delete(r) }
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
                    <TableCell>Parent</TableCell>
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
                        <TableCell>{this.getParent(p.parent)?.title}</TableCell>
                        <TableCell>
                          <IconButton color="primary" aria-label="Edit" onClick={() => this.select(p)}><EditIcon /></IconButton>
                          <IconButton color="primary" aria-label="Delete" onClick={() => this.setState({ deleteId: p._id})}><DeleteIcon /></IconButton>
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
                    onChange={(e) => this.setState({ title: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    required
                    error={this.state.slug === ""}
                    label="Slug"
                    className={classes.textField}
                    value={this.state.slug }
                    onChange={(e) => this.setState({ slug: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    label="Description"
                    className={classes.textField}
                    value={this.state.description }
                    onChange={(e) => this.setState({ description: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    select
                    label="Parent"
                    error={this.state.parent === this.state._id}
                    helperText ={this.state.parent === this.state._id ? 'A page cannot be its own parent' : ''}
                    className={classes.textField}
                    value={this.state.parent}
                    onChange={(e) => this.setState({ parent: e.target.value })}
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
                  <Grid item xs={12} className={classes.baseline}>
                    <Typography variant="h6">Content</Typography>
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
                    className={classes.textField}>
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

export default withStyles(styles)(Pages);
