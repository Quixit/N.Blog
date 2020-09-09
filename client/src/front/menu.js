import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';

import LoginButton from '../controls/loginButton'
import { Styles} from '../theme';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              AppName
            </Typography>
            <div>
              <LoginButton  />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Styles)(Menu);
