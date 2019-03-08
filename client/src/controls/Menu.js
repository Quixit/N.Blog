import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import HomeIcon from '@material-ui/icons/Home';

import LoginButton from '../controls/LoginButton';
import Client from '../api/ApiClient';
import { Styles } from '../Theme';

class Menu extends Component {
  toggleDrawer = value => {
    this.setState({
      drawer: value
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      settings : {},
      pages : [],
      drawer : false
    };

    //this.serverError = props.serverError;

    Client.setOptionsCallBack((settings) => {
      this.setState({ settings : settings });
    });
    Client.setPagesCallBack((pages) => {
      this.setState({ pages : pages });
    });
  }
  render() {
    const { classes, history /*, serverError */ } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={() => this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow} style={{ flex: 1 }}>
              { this.state.settings.title}
            </Typography>
            <div>
              <LoginButton  />
            </div>
          </Toolbar>
          <SwipeableDrawer
           open={this.state.drawer}
           onClose={() => this.toggleDrawer(false)}
           onOpen={() => this.toggleDrawer(true)}>
           <div
             tabIndex={0}
             role="button"
             onClick={() => this.toggleDrawer(false)}
             onKeyDown={() => this.toggleDrawer(false)}>
           <div className={classes.list}>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText onClick={() => history.push("/")} primary="Home" />
              </ListItem>
              <Divider />
              {this.state.pages.map((page, index) => (
                <ListItem button key={page.slug}>
                  <ListItemText onClick={() => history.push("/" +  page.slug)} primary={page.title} />
                </ListItem>
              ))}
            </List>
          </div>
         </div>
       </SwipeableDrawer>
        </AppBar>
      </div>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withRouter(withStyles(Styles)(Menu));
