import React, { Component } from 'react';

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
import SettingsIcon from '@material-ui/icons/Settings';

import { MenuProps } from '../../interfaces/props';

class MenuTemplate extends Component<MenuProps> {
  render() {
    const { classes, toggleDrawer, navigateTo, settings, list, drawer, isLoggedIn, loginButton } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={() => toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow} style={{ flex: 1 }}>
              { settings.get("title") }
            </Typography>
            <div>
              { loginButton }
            </div>
          </Toolbar>
          <SwipeableDrawer
           open={drawer}
           onClose={() => toggleDrawer(false)}
           onOpen={() => toggleDrawer(true)}>
           <div
             tabIndex={0}
             role="button">
           <div className={classes.list}>
            <List>
              <ListItem button onClick={() => navigateTo("/") }>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText  primary="Home" />
              </ListItem>
              {isLoggedIn ?
                <ListItem button onClick={() => navigateTo("/admin") }>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText  primary="Settings" />
                </ListItem>
                : ""
              }
              <Divider />
              {list}
            </List>
          </div>
         </div>
       </SwipeableDrawer>
        </AppBar>
      </div>
    );
  }
}

export default MenuTemplate;
