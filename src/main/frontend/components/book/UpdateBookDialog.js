const React = require("react");
const ReactDOM = require("react-dom");
const Multiselect = require("multiselect-react-dropdown").Multiselect;

module.exports = class UpdateBookDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.multiselectRefAuthors = React.createRef();
    this.multiselectRefCategories = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    const updatedBook = {};
    this.props.attributes.forEach((attribute) => {
      if (attribute != "authors" && attribute != "categories")
        updatedBook[attribute] = ReactDOM.findDOMNode(
          this.refs[attribute]
        ).value.trim();
    });

    this.props.onUpdate(this.props.book, updatedBook, this.multiselectRefAuthors.current.getSelectedItems(),
    this.multiselectRefCategories.current.getSelectedItems());
  }

  render() {
    var id = this.props.book.entity._links.self.href;
    id = id.substr(id.lastIndexOf("/") + 1);
    const modalId = "updateBook-" + id;

    const inputs = this.props.attributes.map((attribute) =>
      attribute == "authors" || attribute == "categories" ? null : (
        <p key={this.props.book.entity[attribute] + attribute}>
          <label htmlFor={this.props.book.entity[attribute] + attribute + id}>
            {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
          </label>
          <input
            id={this.props.book.entity[attribute] + attribute + id}
            type={attribute == "pages" ? "number" : "text"}
            placeholder={attribute}
            defaultValue={this.props.book.entity[attribute]}
            ref={attribute}
            className="form-control"
          />
        </p>
      )
    );

    return (
      <span>
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target={"#" + modalId}
          key={this.props.book.entity._links.self.href}
        >
          Update
        </button>
        <div
          className="modal fade"
          id={modalId}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Update book </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="form-group">{inputs}</div>
                  <div className="form-group">
                    <label htmlFor={"authorsSelect" + id}>Select Authors:</label>
                    <Multiselect
                      id={"authorsSelect" + id}
                      options={this.props.allAuthors}
                      ref={this.multiselectRefAuthors}
                      selectedValues={this.props.authors}
                      displayValue="name"
                    />
                    <label htmlFor={"categoriesSelect" + id}>Select Categories:</label>
                    <Multiselect
                      id={"categoriesSelect" + id}
                      ref={this.multiselectRefCategories}
                      options={this.props.allCategories}
                      selectedValues={this.props.categories}
                      displayValue="name"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    onClick={this.handleSubmit}
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                  >
                    Update
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
