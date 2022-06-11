import React, { Component } from 'react';

import { Divider, ListItemText, ListItemIcon, ListItem, List, SwipeableDrawer, IconButton, Typography, Toolbar, AppBar } from "@mui/material";
import { Settings, Home, Menu } from "@mui/icons-material";

import { MenuProps } from '../../interfaces/props';

class MenuTemplate extends Component<MenuProps> {
  render() {
    const { toggleDrawer, navigateTo, settings, list, drawer, isLoggedIn, loginButton } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={() => toggleDrawer(true)}>
              <Menu />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
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
           <div>
            <List>
              <ListItem button onClick={() => navigateTo("/") }>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText  primary="Home" />
              </ListItem>
              {isLoggedIn ?
                <ListItem button onClick={() => navigateTo("/admin") }>
                  <ListItemIcon>
                    <Settings />
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
