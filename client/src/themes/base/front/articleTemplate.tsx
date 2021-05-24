import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import parse from 'html-react-parser';

import { ArticleProps } from '../../interfaces/props';

class ArticleTemplate extends Component<ArticleProps> {

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
