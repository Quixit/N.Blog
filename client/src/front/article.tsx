import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import parse from 'html-react-parser';

import { styles } from '../theme';
import Client from '../api/apiClient';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Page } from '../../../shared';

interface Params {
  slug?: string;
}

interface Props extends WithStyles, RouteComponentProps<Params> {
  serverError: (value: string) => void;
}

interface State {
  display?: Page
}

class Article extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };

    this.getPage(this.props.match.params.slug);
  }

  componentDidUpdate()
  {
    this.getPage(this.props.match.params.slug);
  }

  getPage(slug?: string)
  {
    if (this.state.display === undefined || slug !== this.state.display.slug)
    {
      Client.get('pages/slug/' + slug).then(page => {
        this.setState({ display: page.page });
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div style={{ padding: 8 * 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">{this.state.display?.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.tableContainer} style={{ padding: 8 *2 }}>
              <Typography variant="body1" component="div">
                { this.state.display?.content !== undefined ? parse(this.state.display.content) : '' }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Article));
