const React = require("react");
const ReactDOM = require("react-dom");
const client = require("../../client");
var Link = require("react-router-dom").Link;
var RD = require("react-router-dom");


module.exports = class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoginChange(e) {
    this.setState({
      login: e.target.value,
      password: this.state.password,
    });
  }

  handlePasswordChange(e) {
    this.setState({
      login: this.state.login,
      password: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    client({
      method: "POST",
      path: "/api/user/register",
      headers: { "Content-Type": "application/json" },
      entity: {
        login: this.state.login,
        password: this.state.password,
        roles: ["USER"]
      },
    }).done((response) => {
      if (response.entity.success == "true")
        this.props.history.push({
          pathname: "/login",
          state: { loginMsg: "You can now log in.", type: "alert alert-success" },
        });
    });
  }

  render() {
    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "400px" }}>
          <h4 className="card-title mt-3 text-center">Create Account</h4>
          <form name="registerForm">
            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <input
                type="text"
                name="login"
                className="form-control"
                placeholder="Create Login"
                value={this.state.login}
                onChange={this.handleLoginChange}
              />
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-lock"></i>
                  </span>
                </div>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </div>
            </div>
            <div className="form-group">
              <button
                onClick={this.handleSubmit}
                className="btn btn-primary btn-block"
              >
                Create Account
              </button>
            </div>
            <p className="text-center">
              Have an account?
              <Link to="/login">
                <span> Login </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
};
