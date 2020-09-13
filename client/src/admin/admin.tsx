import React, { Component } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Posts from './posts';
import Categories from './categories';
import Pages from './pages';
import Users from './users';
import Settings from './settings';
import { styles } from '../theme';

interface Props extends WithStyles {
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
    const { classes, serverError } = this.props;
    const { tab } = this.state;

    return (
      <div className={classes.root}>

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

export default withStyles(styles)(Admin);
