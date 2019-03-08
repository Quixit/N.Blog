import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import parse from 'html-react-parser';

import { Styles} from '../Theme';
import Client from '../api/ApiClient';

class Page extends Component {
  constructor(props) {
    super(props);

    this.serverError = this.props.serverError;

    this.state = {
      display: {
        slug : null
      }
    };
  }
  getPage(slug)
  {
    if (slug !== this.state.display.slug)
    {
      Client.get('pages/slug/' + slug).then(page => {
        this.setState({ display: page.page });
        console.log(page);
      })
      .catch(msg => {
        this.serverError(msg.error);
      });
    }
  }
  render() {
    //const { classes } = this.props;
    const slug = this.props.match.params.slug;

    this.getPage(slug);

    return (
      <div>
        { this.state.display.content != null ? parse(this.state.display.content) : '' }
      </div>
    );
  }
}

Page.propTypes = {
  classes: PropTypes.object.isRequired,
  serverError: PropTypes.func.isRequired
};

export default withStyles(Styles)(Page);
