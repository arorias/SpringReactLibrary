const React = require("react");
const UpdateCategoryDialog = require("./UpdateCategoryDialog");
const CategoryBooksDialog = require("./CategoryBooksDialog");
const client = require("../../client");

module.exports = class Category extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      books: [],
    };
  }
  handleDelete() {
    this.props.onDelete(this.props.category);
  }
  componentDidMount() {
    this.loadBooks();
  }

  loadBooks() {
    client({
      method: "GET",
      path: this.props.category.entity._links.books.href,
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
        <UpdateCategoryDialog
          key="updateCategoryDialog"
          category={this.props.category}
          attributes={this.props.attributes}
          onUpdate={this.props.onUpdate}
        />
      );
    }
    return (
      <tr>
        <td> {this.props.category.entity.name} </td>
        <td>
          {controls}
          <CategoryBooksDialog
            key={this.props.category.entity._links.self.href}
            books={this.state.books}
            category={this.props.category}
          />
        </td>
      </tr>
    );
  }
};
