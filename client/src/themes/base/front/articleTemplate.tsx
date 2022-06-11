import React, { Component } from 'react';
import { Typography, Grid, Paper } from "@mui/material";
import parse from 'html-react-parser';
import { ArticleProps } from '../../interfaces/props';

class ArticleTemplate extends Component<ArticleProps> {

  render() {
    const { display } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">{display?.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: 8 *2 }}>
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
