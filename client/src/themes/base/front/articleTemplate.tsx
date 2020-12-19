import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { WithStyles } from '@material-ui/core/styles';

import parse from 'html-react-parser';

import { RouteComponentProps } from 'react-router-dom';
import { Page } from '../../../../../shared';

interface Params {
  slug?: string;
}

interface Props extends WithStyles, RouteComponentProps<Params> {
  serverError: (value: string) => void;
  display?: Page;
}

class ArticleTemplate extends Component<Props> {

  render() {
    const { classes, display } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">{display?.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.tableContainer} style={{ padding: 8 *2 }}>
              <Typography variant="body1" component="div">
                { display?.content !== undefined ? parse(display.content) : '' }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ArticleTemplate;
