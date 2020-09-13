import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { WithStyles, withStyles } from '@material-ui/core/styles';
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

import LoginButton from '../controls/loginButton';
import MenuItem from './menuItem';
import Client from '../api/apiClient';
import { styles } from '../theme';
import { PageItem } from '../../../shared';

interface Props extends WithStyles, RouteComponentProps  {
  serverError: (value: string) => void;
}

interface State {
    settings: Map<string, string | undefined>;
    list: PageItem[];
    drawer: boolean;
}

class Menu extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      settings : new Map(),
      list : [],
      drawer : false
    };

    Client.setOptionsCallBack((settings) => {
      document.title = settings.get('title') ?? '';
      this.setState({ settings : settings });
    });
    Client.setPagesCallBack((pages) => {
      this.setState({ list : pages });
    });
  }
  toggleDrawer = (value : boolean) => {
    this.setState({
      drawer: value
    });
  };
  navigatePage = (item: PageItem) => {
    var history = this.props.history;

    if (item.children.length < 1) {
      history.push("/" +  item.page.slug);
      this.toggleDrawer(false);
    }
    else {
      item.expanded = !item.expanded;

      this.setState({list: this.state.list});
    }
  }
  navigateTo = (url: string) => {
    var history = this.props.history;

    history.push(url);
    this.toggleDrawer(false);
  }
  render() {
    const { classes  /*, serverError */ } = this.props;
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
              { this.state.settings.get("title") }
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
             role="button">
           <div className={classes.list}>
            <List>
              <ListItem button onClick={() => this.navigateTo("/") }>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText  primary="Home" />
              </ListItem>
              {Client.isLoggedIn ?
                <ListItem button onClick={() => this.navigateTo("/admin") }>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText  primary="Settings" />
                </ListItem>
                : ""
              }
              <Divider />
              {this.state.list.map((item) => (
                <MenuItem item={item} onClick={this.navigatePage} key={item.page.slug} />
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

export default withRouter(withStyles(styles)(Menu));
