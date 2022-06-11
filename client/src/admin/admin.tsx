import React, { Component } from 'react';

import { Tab, Tabs } from "@mui/material";

import Posts from './posts';
import Categories from './categories';
import Pages from './pages';
import Users from './users';
import Settings from './settings';

interface Props {
  serverError: (value: string) => void;
}

interface State {
  tab: number;
}

class Admin extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tab: 0
    };
  }

  handleChange = (_event: React.ChangeEvent<{}>, value: number) => {
    this.setState({ tab: value });
  };

  render() {
    const { serverError } = this.props;
    const { tab } = this.state;

    return (
      <div>

        <Tabs value={tab} onChange={this.handleChange}>
          <Tab label="Blog" />
          <Tab label="Categories" />
          <Tab label="Pages" />
          <Tab label="Users" />
          <Tab label="Settings" />
        </Tabs>

        <div style={{ padding: 8 * 3 }}>
          {tab === 0 && <Posts serverError={serverError} />}
          {tab === 1 && <Categories serverError={serverError} />}
          {tab === 2 && <Pages serverError={serverError} />}
          {tab === 3 && <Users serverError={serverError} />}
          {tab === 4 && <Settings serverError={serverError} />}
        </div>
      </div>
    );
  }
}

export default Admin;
