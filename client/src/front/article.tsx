import React, { Component } from 'react';

import { ArticleTemplate } from '../theme';
import Client from '../api/apiClient';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Page } from '../../../shared';

interface Params {
  slug?: string;
}

interface Props extends RouteComponentProps<Params> {
  serverError: (value: string) => void;
}

interface State {
  display?: Page
}

class Article extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };

    this.getPage(this.props.match.params.slug);
  }

  componentDidUpdate()
  {
    this.getPage(this.props.match.params.slug);
  }

  getPage(slug?: string)
  {
    if (this.state.display === undefined || slug !== this.state.display.slug)
    {
      Client.get('pages/slug/' + slug).then(page => {
        this.setState({ display: page.page });
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
  }

  render() {
    const { display } = this.state;
    return (
      <ArticleTemplate
        {...this.props}
        display={display}
      />
    );
  }
}

export default withRouter(Article);
