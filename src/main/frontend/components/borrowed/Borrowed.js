const React = require("react");
const client = require("../../client");

module.exports = class Borrowed extends React.Component {
  constructor(props) {
    super(props);
    this.handleReturn = this.handleReturn.bind(this);
    this.state = {
      bookTitle: "",
    };
  }

 
  handleReturn() {
    this.props.onReturn(this.props.borrowed);
  }

  loadBookTitle() {
    client({
      method: "GET",
      path: this.props.borrowed.entity._links.book.href,
    }).done((response) => {
      this.setState({ bookTitle: response.entity.title });
    });
  }

  componentDidMount() {
    this.loadBookTitle();
  }

  render() {
    const controls = [];
    if (this.props.userRole == "MANAGER" && this.props.borrowed.entity.returned == false) {
      controls.push(
        <button
          key="returnButton"
          onClick={this.handleReturn}
          className="btn btn-warning"
        >
          Return
        </button>
      );
    }

    return (
      <tr className={this.props.borrowed.entity.returned ? "table-success" : "table-active"}>
        <td> {this.state.bookTitle} </td>
        <td> {this.props.borrowed.entity.libraryUser.login} </td>
        <td> {this.props.borrowed.entity.startDate} </td>
        <td> {this.props.borrowed.entity.dueDate} </td>
        <td> {this.props.borrowed.entity.returned ? "Returned" : "Borrowed"} </td>
        <td> {controls} </td>
      </tr>
    );
  }
};
