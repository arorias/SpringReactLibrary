const React = require("react");
const ReactDOM = require("react-dom");

module.exports = class AuthorBooksDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const books = this.props.books.map((book) => (
      <tr key={book._links.self.href}>
        <td> {book.title} </td>
        <td> {book.publisher} </td>
        <td> {book.isbn} </td>
        <td> {book.pages} </td>
        <td> {book.description} </td>
      </tr>
    ));
    var id = this.props.author.entity._links.self.href;
    id = id.substr(id.lastIndexOf("/") + 1);
    const modalId = "showAuthorBooks-" + id;
    return (
      <span>
        <button
          type="button"
          data-toggle="modal"
          data-target={"#" + modalId}
          className="btn btn-info"
          key={this.props.author.entity._links.self.href}
        >
          Show books
        </button>
        <div
          className="modal fade"
          id={modalId}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {" "}
                  {this.props.author.entity.name} books:{" "}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form>
                <div className="modal-body">
                  <table className="table table-striped table-bordered">
                    <tbody>
                      <tr>
                        <th> Title: </th>
                        <th> Publisher: </th>
                        <th> ISBN: </th>
                        <th> Pages: </th>
                        <th> Description: </th>
                      </tr>
                      {books}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </span>
    );
  }
};
