import React, { Component } from 'react';

import { WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { styles } from '../theme';
import Client from '../api/apiClient';
import { Setting } from '../../../shared';

interface Props extends WithStyles {
  serverError: (value: string) => void;
}

interface State {
  title: string;
}

class Settings extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title : ''
    };

    this.list();
  }

  list() {
    Client.get('settings').then((settings: Setting[]) => {
      const map = new Map<string, string | undefined>();

      for(let i = 0; i < settings.length; i++)
      {
        map.set(settings[i].name, settings[i].value);
      }

      this.setState({ title: map.get('title') ?? '' });
    })
    .catch(msg => {
      this.props.serverError(msg.error);
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
    .then(() => {
      this.list();
    })
    .catch(msg => {
      this.props.serverError(msg.error);
    });
  }

  isValid() {
      return true;
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
          <Grid item xs={12} className={classes.baseline}>
            <Typography variant="h4">{'Edit'}</Typography>
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
          </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Settings);
