import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import Editor from "./pages/Editor";
import Home from "./pages/Home";
import "./App.css";
import ChakibooCreator from "./pages/ChakibooCreator/ChakibooCreator";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import LoginContext from "./contexts/LoginContext";
import MyChakiboos from "./pages/MyChakiboos";
import ChakibooView from "./pages/ChakibooView/ChakibooView";
import TagsFilter from "./pages/tagsFilter";

const client = new ApolloClient({
  uri: "https://kettlecat-graphql.herokuapp.com/graphql",
  credentials: "include"
});

class App extends Component {
  constructor(props) {
    super(props);

    this.toggleLogin = userData => {
      this.setState(state => ({
        isLogged: true,
        loggedUser: userData.username,
        loggedUserID: userData.id
      }));
    };

    this.state = {
      isLogged: false,
      loggedUser: "",
      loggedUserID: "",
      toggleLogin: this.toggleLogin
    };
  }

  componentDidMount() {
    // fetch isUserAuthenticated?
  }

  handleLogout = () => {
    fetch("https://kettlecat-graphql.herokuapp.com/logout", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
        // "Content-Type": "application/x-www-form-urlencoded",
      }
    }).then(response => {
      if (response.ok === true) {
        this.setState({ isLogged: false, loggedUser: "", loggedUserID: "" });
      }
    });
  };

  render() {
    return (
      <div id="container">
        <LoginContext.Provider value={this.state}>
          <ApolloProvider client={client}>
            <Router>
              <div className="subContainer">
                <div>
                  <AppBar position="static">
                    <Toolbar className="AppToolbar">
                      <Link className="CatLogo" to="/">
                        <div className="img"></div>
                        <h1>Kettlecat</h1>
                      </Link>
                      <div className="spacer"></div>

                      <LoginContext.Consumer>
                        {({ isLogged, loggedUser, loggedUserID }) =>
                          isLogged ? (
                            <React.Fragment>
                              <Button color="inherit">
                                <Link to="/creator">Create</Link>
                              </Button>
                              <Button color="inherit">
                                <Link to={`/mychakiboos/${loggedUserID}`}>
                                  My Code
                                </Link>
                              </Button>
                              <Typography>logged as {loggedUser}</Typography>
                              <Button onClick={this.handleLogout}>
                                Logout
                              </Button>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Button>
                                <Link to="/login">Login</Link>
                              </Button>
                              <Button>
                                <Link to="/signup">Sign Up</Link>
                              </Button>
                            </React.Fragment>
                          )
                        }
                      </LoginContext.Consumer>
                    </Toolbar>
                  </AppBar>
                </div>

                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/signup" component={SignUp} />
                  <Route exact path="/creator" component={ChakibooCreator} />
                  <Route exact path="/editor/:id" component={Editor} />
                  <Route exact path="/viewer/:id" component={ChakibooView} />
                  <Route exact path="/tag/:tag" component={TagsFilter} />
                  <Route
                    exact
                    path="/mychakiboos/:id"
                    component={MyChakiboos}
                  />
                  {/* <Route exact path="/editor" copmonent={Editor} /> */}
                </Switch>
              </div>
            </Router>
          </ApolloProvider>
        </LoginContext.Provider>
      </div>
    );
  }
}

export default App;
