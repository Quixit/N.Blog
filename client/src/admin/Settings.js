import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title : ''
    };

    this.serverError = this.props.serverError;
    this.list();
  }

  list() {
    Client.get('settings').then(settings => {
      for(let i = 0; i < settings.length; i++)
      {
        this.setState({ [settings[i].name] : settings[i].value });
      }
    })
    .catch(msg => {
      this.serverError(msg.error);
    });
  }

  save() {
    let settings = [
      {
        name: 'title',
        value: this.state.title
      }
    ];

    Client.post('settings', settings)
    .then(users => {
      this.list();
    })
    .catch(msg => {
      this.serverError(msg.error);
    });
  }

  sen

  isValid() {
      return true;
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Settings</Typography>
        </Grid>
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
          </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Settings);
