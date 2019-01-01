import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';

import LoginButton from '../controls/LoginButton'
import Blog from './Blog'
import Pages from './Pages'
import Users from './Users'
import Settings from './Settings'
import { Styles} from '../Theme';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { classes } = this.props;
    const { tab } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Grid container>
            <Grid item xs={10}>
              <Tabs value={tab} onChange={this.handleChange}>
                <Tab label="Blog" />
                <Tab label="Pages" />
                <Tab label="Users" />
                <Tab label="Settings" />
              </Tabs>
            </Grid>
            <Grid item xs={2} padding="default" style={ {textAlign: 'right', paddingTop: 8, paddingRight:8}}>
              <LoginButton />
            </Grid>
          </Grid>
        </AppBar>
        <div style={{ padding: 8 * 3 }}>
          {tab === 0 && <Blog />}
          {tab === 1 && <Pages />}
          {tab === 2 && <Users />}
          {tab === 3 && <Settings />}
        </div>
      </div>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Admin);
