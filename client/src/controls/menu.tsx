import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import LoginButton from '../controls/loginButton';
import MenuItem from './menuItem';
import Client from '../api/apiClient';
import { MenuTemplate } from '../theme';
import { PageItem } from '../../../shared';

interface Props extends RouteComponentProps  {
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
    const { list, settings, drawer } = this.state;
    return (
      <MenuTemplate
        toggleDrawer={this.toggleDrawer}
        navigateTo={this.navigateTo}
        settings={settings}
        list={list.map((item) => (
          <MenuItem item={item} onClick={this.navigatePage} key={item.page.slug} />
        ))}
        drawer={drawer}
        isLoggedIn={Client.isLoggedIn}
        loginButton={<LoginButton />}
        {...this.props}
        />
    );
  }
}

export default withRouter(Menu);
