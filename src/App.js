import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    users: [],
    repos:[],
    loading: false,
    alert:null,
    user: {},
  }

  searchUsers= async text => {

    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=
    ${process.env.REACT_APP_GITUB_CLIENT_ID}&client_secret=$
    ${process.env.REACT_APP_GITUB_CLIENT_SECRET}`);

    this.setState({ users: res.data.items, loading: false });

  }
  //get a specific user
  getUser = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/users/${username}?client_id=
    ${process.env.REACT_APP_GITUB_CLIENT_ID}&client_secret=$
    ${process.env.REACT_APP_GITUB_CLIENT_SECRET}`);

    this.setState({ user: res.data, loading: false });
  }
  //get user repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=
    ${process.env.REACT_APP_GITUB_CLIENT_ID}&client_secret=$
    ${process.env.REACT_APP_GITUB_CLIENT_SECRET}`);

    this.setState({ repos: res.data, loading: false });
  }

  clearUsers = () => this.setState({ users: [], loading:false });

  setAlert = (message, type) => {
      this.setState({alert:{message, type}});

      setTimeout(()=> this.setState({alert:null}), 3000);
  }


  render(){
    const { users, repos, user, loading }= this.state;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={this.state.alert}/>
            <Switch>
              <Route exact path="/" render={props => (
                <Fragment>
                  <Search
                    searchUsers={this.searchUsers}
                    clearUsers={this.clearUsers}
                    showClear={users.length > 0 ? true : false}
                    setAlert={this.setAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )} />
              <Route exact path="/about" component={About}></Route>
              <Route
              exact
              path="/users/:login"
              render={props=> (
                <User
                {...props}
                getUser={this.getUser}
                getUserRepos={this.getUserRepos}
                repos={repos}
                user={user}
                loading={loading}
                />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
