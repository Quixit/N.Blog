import React, { Component } from 'react';

import { TextField, Button, Paper, Grid, Typography } from "@mui/material";

import Client from '../api/apiClient';
import { Setting } from '../../../shared';

interface Props {
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

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
          <Grid item xs={12}>
            <Typography variant="h4">{'Edit'}</Typography>
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
          </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default Settings;
