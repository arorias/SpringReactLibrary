const React = require("react");

module.exports = class LoginView extends React.Component {
  render() {
    const errorMsg =
      typeof this.props.location.state !== "undefined" ? (
        <div className={this.props.location.state.type} role="alert">
          {this.props.location.state.loginMsg}
        </div>
      ) : (
        <div></div>
      );
    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "400px" }}>
          <h4 className="card-title mt-3 text-center">Login</h4>
          <form name="loginForm" action="/login" method="post">
            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Username"
              ></input>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-lock"></i>
                  </span>
                </div>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                ></input>
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-success btn-block">
                Login
              </button>
            </div>
            {errorMsg}
          </form>
        </div>
      </div>
    );
  }
};
