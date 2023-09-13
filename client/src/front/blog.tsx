import React, { Component } from 'react';

import { BlogTemplate } from '../theme';
import Client from '../api/apiClient';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Post } from '../../../shared';

interface Params {
  slug?: string;
}

interface Props extends RouteComponentProps<Params> {
  serverError: (value: string) => void;
}

interface State {
  display?: Post
}

class Blog extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount(): void {
    this.getPost(this.props.match.params.slug);
  }

  componentDidUpdate()
  {
    this.getPost(this.props.match.params.slug);
  }

  getPost(slug?: string)
  {
    if (this.state.display === undefined || slug !== this.state.display.slug)
    {
      Client.get('posts/slug/' + slug).then(post => {
        this.setState({ display: post.post });
      })
      .catch(msg => {
        this.props.serverError(msg.error);
      });
    }
  }

  render() {
    const { display } = this.state;

    return (
      <BlogTemplate
        {...this.props}
        display={display}
      />
    );
  }
}

export default withRouter(Blog);
