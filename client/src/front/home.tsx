import React, { Component } from 'react';
import { RouteComponentProps} from "react-router-dom";

import Client from '../api/apiClient';
import { HomeTemplate } from '../theme';
import { Post, User } from '../../../shared';

interface Params {
  slug?: string;
}

interface Props extends RouteComponentProps<Params> {
  serverError: (value: string) => void;
}

interface State {
  list: Post[];
  users: Map<string, User>;
  hasMore: boolean;
}

class Home extends Component<Props, State> {
  pageSize = 10;
  page = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      list: [],
      users: new Map(),
      hasMore: true
    };

    this.getIndex();
  }
  getIndex()
  {
    Client.get('posts/index/' + this.page).then(posts => {
      this.setState({ list: this.state.list.concat(posts), hasMore: posts.length === this.pageSize });
    })
    .catch(msg => {
      this.props.serverError(msg.error);
    });

    Client.get('users').then(users => {
      let lookupUsers = new Map<string, User>();

      for(let user of users)
      {
        lookupUsers.set(user._id, user);
      }

      this.setState({ users: lookupUsers });
    })
    .catch(msg => {
      this.props.serverError(msg.error);
    });
  }
  getNext()
  {
    if (this.state.hasMore)
    {
      this.page += 1;
      this.getIndex();
    }
  }
  render() {
    const { list, users, hasMore } = this.state;

    return (
      <HomeTemplate
        {...this.props}
        getNext={this.getNext}
        list={list}
        users={users}
        hasMore={hasMore}
      />
    );
  }
}

export default Home;
