const React = require("react");
const UpdateBookDialog = require("./UpdateBookDialog");
const client = require("../../client");

module.exports = class Book extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReservation = this.handleReservation.bind(this);
    this.state = {
      authors: [],
      categories: [],
    };
  }

  handleDelete() {
    this.props.onDelete(this.props.book);
  }

  handleReservation() {
    this.props.onReserve(this.props.book);
  }

  componentDidMount() {
    this.loadAuthors();
    this.loadCategories();
  }

  loadAuthors() {
    client({
      method: "GET",
      path: this.props.book.entity._links.authors.href,
    }).done((response) => {
      this.setState({
        ...this.state,
        authors: response.entity._embedded.authors,
      });
    });
  }

  loadCategories() {
    client({
      method: "GET",
      path: this.props.book.entity._links.categories.href,
    }).done((response) => {
      this.setState({
        ...this.state,
        categories: response.entity._embedded.categories,
      });
    });
  }

  render() {
    const controls = [];
    if (this.props.userRole == "MANAGER") {
      controls.push(
        <button
          key="deleteButton"
          onClick={this.handleDelete}
          className="btn btn-danger"
        >
          Delete
        </button>
      );
      controls.push(
        <UpdateBookDialog
          book={this.props.book}
          allAuthors={this.props.allAuthors}
          authors={this.state.authors}
          allCategories={this.props.allCategories}
          categories={this.state.categories}
          key="updateAuthorDialog"
          attributes={this.props.attributes}
          onUpdate={this.props.onUpdate}
        />
      );
    }
    if (this.props.userRole == "MANAGER" || this.props.userRole == "USER") {
      controls.push(
        <button
          key="reserveButton"
          onClick={this.handleReservation}
          className="btn btn-info"
        >
          Reserve
        </button>
      );
    }

    const authors =
      Array.isArray(this.state.authors) && this.state.authors.length
        ? this.state.authors.map((author) => (
            <div key={author.name}> {author.name} </div>
          ))
        : null;

    const categories =
      Array.isArray(this.state.categories) && this.state.categories.length
        ? this.state.categories.map((category) => (
            <div key={category.name}> {category.name} </div>
          ))
        : null;

    return (
      <tr>
        <td> {this.props.book.entity.title} </td>
        <td> {authors} </td>
        <td> {categories} </td>
        <td> {this.props.book.entity.publisher} </td>
        <td> {this.props.book.entity.isbn} </td>
        <td> {this.props.book.entity.pages} </td>
        <td> {this.props.book.entity.description} </td>
        {this.props.userRole == "MANAGER" || this.props.userRole == "USER" ? (
          <td> {controls} </td>
        ) : null}
      </tr>
    );
  }
};
