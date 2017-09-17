import React, { Component } from 'react';
import './App.css';
import { Dashboard } from'./components/Dashboard';

const client_id = '19aff168df6d4e20824c41e096a2573c';

class App extends Component {
  constructor(){
    super();

    this.state = {
      token: null
    };
  }

  componentDidMount() {
    if (window.localStorage) { // For now tests dont have a mocked out window, do not do any of this for tests
      let access_token = window.localStorage.getItem("getLink_token");

      if (!access_token || access_token === "null" || access_token === "undefined") {
        let hash = window.location.hash;
        let hashArray = hash.split("=");
        access_token = hashArray[1];

        if (access_token) {
          this.setState({token: access_token});
          window.localStorage.setItem("getLink_token", access_token);
        } else {
          window.location.replace('https://api.instagram.com/oauth/authorize/?client_id=' + client_id + '&redirect_uri=http://localhost:3000/&scope=public_content&response_type=token');
        }
      } else {
        this.setState({token: access_token});
      }

      // Redirect to url without hash? remove hash?
    } else {
      this.setState({token: 'testToken'});
    }
  }

  render() {
    let token = this.state.token;
    return (
      <div className="App">
        <Dashboard token={token} />
      </div>
    );
  }
}

export default App;
