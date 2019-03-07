import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Posts from './Posts';
import Categories from './Categories';
import Pages from './Pages';
import Users from './Users';
import Settings from './Settings';
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

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Admin);
