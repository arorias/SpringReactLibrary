const React = require("react");
const client = require("../../client");

module.exports = class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleBorrowing = this.handleBorrowing.bind(this);
    this.state = {
      bookTitle: "",
    };
  }

  handleDelete() {
    this.props.onDelete(this.props.reservation);
  }

  handleBorrowing() {
    this.props.onBorrow(this.props.reservation);
  }

  loadBookTitle() {
    client({
      method: "GET",
      path: this.props.reservation.entity._links.book.href,
    }).done((response) => {
      this.setState({ bookTitle: response.entity.title });
    });
  }

  componentDidMount() {
    this.loadBookTitle();
  }

  render() {
    const controls = [];
    controls.push(
      <button
        key="deleteButton"
        onClick={this.handleDelete}
        className="btn btn-danger"
      >
        Delete
      </button>
    );
    if (this.props.userRole == "MANAGER") {
      controls.push(
        <button
          key="borrowButton"
          onClick={this.handleBorrowing}
          className="btn btn-info"
        >
          Borrow
        </button>
      );
    }

    return (
      <tr>
        <td> {this.state.bookTitle} </td>
        <td> {this.props.reservation.entity.libraryUser.login} </td>
        <td> {this.props.reservation.entity.date} </td>
        <td> {controls} </td>
      </tr>
    );
  }
};
