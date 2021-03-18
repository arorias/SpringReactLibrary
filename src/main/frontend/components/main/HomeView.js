const React = require("react");
var RD = require("react-router-dom");
const client = require("../../client");

module.exports = class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: "",
      author: "",
    };
  }

  componentDidMount() {
    var queryDict = {};
    location.search
      .substr(1)
      .split("&")
      .forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1];
      });
    if (queryDict.error === "true") {
      this.props.history.push({
        pathname: "/login",
        state: { loginMsg: "Invalid credentials.", type: "alert alert-danger" },
      });
    }
    this.getQuoteOfTheDay();
  }

  getQuoteOfTheDay() {
    client({
      method: "GET",
      path: "https://quotes.rest/qod?language=en",
      headers: { Accept: "application/json" },
    }).done((response) => {
      this.setState({
        quote: response.entity.contents.quotes[0].quote,
        author: response.entity.contents.quotes[0].author,
      });
    });
  }

  render() {
    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "80%" }}></div>
        <h4 className="card-title mt-3 text-center">Welcome to the library!</h4>
        <div className="container">
          <div className="row align-items-center">
            <blockquote className="quote-box">
              <p className="quotation-mark">“</p>
              <p className="quote-text">{this.state.quote}</p>
              <hr></hr>
              <div className="blog-post-actions">
                <p className="blog-post-bottom pull-left">
                  {" "}
                  {this.state.author}{" "}
                </p>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }
};
