const React = require("react");
var Link = require("react-router-dom").Link;
const ReactDOM = require("react-dom");
const client = require("../../client");
const when = require("when");
const follow = require("../../follow");
const root = "/api";

module.exports = class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "anonymousUser",
      role: "none",
    };
  }

  componentDidMount() {
    this.checkLoggedInUser();
  }

  checkLoggedInUser() {
    client({
      method: "GET",
      path: "/api/user/me",
    })
      .then((response) => {
        return response.entity;
      })      
      .done((entity) => {
        this.setState(entity);
      });
    this.forceUpdate();
  }

  render() {
    const leftMenuLinks = [];
    if (this.state.user != "anonymousUser") {
      leftMenuLinks.push(
        <Link key="reserved" to="/reservation">
          <li
            className="nav-item active"
            style={{ margin: "0px 10px 0px 10px" }}
          >
            <span className="nav-link"> Reservations</span>
          </li>
        </Link>
      );
      leftMenuLinks.push(
        <Link key="borrowed" to="/borrowed">
          <li
            className="nav-item active"
            style={{ margin: "0px 10px 0px 10px" }}
          >
            <span className="nav-link"> Borrowed Books</span>
          </li>
        </Link>
      );
    }

    const rightMenuLinks = [];
    if (this.state.user == "anonymousUser") {
      rightMenuLinks.push(
        <Link key="login" to="/login">
          <li
            className="nav-item active"
            style={{ margin: "0px 10px 0px 10px" }}
          >
            <button className="btn btn-outline-success"> Login</button>
          </li>
        </Link>
      );
      rightMenuLinks.push(
        <Link key="register" to="/register">
          <li
            className="nav-item active"
            style={{ margin: "0px 10px 0px 10px" }}
          >
            <button className="btn btn-outline-info "> Register </button>
          </li>
        </Link>
      );
    } else {
      rightMenuLinks.push(
        <button key="loggedUser" className="btn btn-success" disabled="">
          Logged as: {this.state.user} ({this.state.role})
        </button>
      );
      rightMenuLinks.push(
        <li
          key="logout"
          className="nav-item active"
          style={{ margin: "0px 10px 0px 10px" }}
        >
          <a href="/logout" className="btn btn-outline-danger">
            Logout
          </a>
        </li>
      );
    }

    return (
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <Link to="/">
            <span className="navbar-brand">
              <i
                className="fas fa-book"
                style={{ margin: "0px 10px 0px 10px" }}
              ></i>
              Library
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <Link to="/books">
                <li
                  className="nav-item active"
                  style={{ margin: "0px 10px 0px 10px" }}
                >
                  <span className="nav-link"> Books</span>
                </li>
              </Link>
              <Link to="/authors">
                <li
                  className="nav-item active"
                  style={{ margin: "0px 10px 0px 10px" }}
                >
                  <span className="nav-link"> Authors</span>
                </li>
              </Link>
              <Link to="/category">
                <li
                  className="nav-item active"
                  style={{ margin: "0px 10px 0px 10px" }}
                >
                  <span className="nav-link"> Categories</span>
                </li>
              </Link>
              {leftMenuLinks}
            </ul>
            <ul className="navbar-nav ml-auto"> {rightMenuLinks}</ul>
          </div>
        </nav>
      </header>
    );
  }
};
