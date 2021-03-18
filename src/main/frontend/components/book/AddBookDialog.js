const React = require("react");
const ReactDOM = require("react-dom");
const Multiselect = require("multiselect-react-dropdown").Multiselect;

module.exports = class AddBookDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.multiselectRefAuthors = React.createRef();
    this.multiselectRefCategories = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    const newBook = {};
    this.props.attributes.forEach((attribute) => {
      if (attribute != "authors" && attribute != "categories")
        newBook[attribute] = ReactDOM.findDOMNode(
          this.refs[attribute]
        ).value.trim();
    });
    newBook.authors = [];
    newBook.categories = [];

    this.props.onCreate(
      newBook,
      this.multiselectRefAuthors.current.getSelectedItems(),
      this.multiselectRefCategories.current.getSelectedItems()
    );

    this.multiselectRefAuthors.current.resetSelectedValues();
    this.multiselectRefCategories.current.resetSelectedValues();

    this.props.attributes.forEach((attribute) => {
      if (attribute != "authors" && attribute != "categories")
        ReactDOM.findDOMNode(this.refs[attribute]).value = "";
    });
  }

  render() {
    const inputs = this.props.attributes.map((attribute) =>
      attribute == "authors" || attribute == "categories" ? null : (
        <p key={attribute}>
          <label htmlFor={attribute}>
            {" "}
            {attribute.charAt(0).toUpperCase() + attribute.slice(1)}{" "}
          </label>
          <input
            id={attribute}
            type={attribute == "pages" ? "number" : "text"}
            placeholder={attribute}
            ref={attribute}
            className="form-control"
          />
        </p>
      )
    );

    return (
      <div className="col">
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#createBook"
        >
          Add
        </button>
        <div
          className="modal fade"
          id="createBook"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Add new book </h5>
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
                    <label htmlFor="authorsSelect">Select Authors:</label>
                    <Multiselect
                      id="authorsSelect"
                      options={this.props.authors}
                      ref={this.multiselectRefAuthors}
                      displayValue="name"
                    />
                    <label htmlFor="categoriesSelect">Select Categories:</label>
                    <Multiselect
                      id="categoriesSelect"
                      ref={this.multiselectRefCategories}
                      options={this.props.categories}
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
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
