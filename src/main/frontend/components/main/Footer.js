const React = require("react");

module.exports = class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <span className="text-muted">
            @Grzegorz Podsiadlo - Zaawansowane Technologie Internetowe -{" "}
            <a href="mailto:grzegorz.podsiadlo@protonmail.com">
              grzegorz.podsiadlo@protonmail.com
            </a>
          </span>
        </div>
      </footer>
    );
  }
};
