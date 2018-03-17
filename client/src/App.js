import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Client from './api/ApiClient';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'BwqZ53Mpy4yctEwIg4oc5R8AL',
      password: 'FzCIhRf4PcyNKj3TMLsSUhVTo',
      isLoggedIn: false
    };

    //This binding is necessary to make `this` work in the callback
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoffClick = this.handleLogoffClick.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleLoginClick(event)
  {
    event.preventDefault();
    Client.login(this.state.username,this.state.password).then(a => this.setState({ isLoggedIn : Client.isLoggedIn }));
  }
  handleLogoffClick(event)
  {
    event.preventDefault();
    Client.logoff().then(a => this.setState({ isLoggedIn : Client.isLoggedIn }));
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <form>
          <label>
            Username:
            <input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleInputChange} />
          </label>
          <br />
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange} />
          </label>
          <br />
          {!this.state.isLoggedIn ? (<button onClick={this.handleLoginClick}>login</button>) : (<button onClick={this.handleLogoffClick}>Log Out</button>)}
          <br />
        </form>
      </div>
    );
  }
}

export default App;
