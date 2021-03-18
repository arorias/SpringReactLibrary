const React = require("react");
const UpdateAuthorDialog = require("./UpdateAuthorDialog");
const AuthorBooksDialog = require("./AuthorBooksDialog");
const client = require("../../client");

module.exports = class Author extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      books: [],
    };
  }
  handleDelete() {
    this.props.onDelete(this.props.author);
  }
  componentDidMount() {
    this.loadBooks();
  }

  loadBooks() {
    client({
      method: "GET",
      path: this.props.author.entity._links.books.href,
    }).done((response) => {
      this.setState({ books: response.entity._embedded.books });
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
        <UpdateAuthorDialog
          key="updateAuthorDialog"
          author={this.props.author}
          attributes={this.props.attributes}
          onUpdate={this.props.onUpdate}
        />
      );
    }
    return (
      <tr>
        <td> {this.props.author.entity.name} </td>
        <td>
          {controls}
          <AuthorBooksDialog
            key={this.props.author.entity._links.self.href}
            books={this.state.books}
            author={this.props.author}
          />
        </td>
      </tr>
    );
  }
};
