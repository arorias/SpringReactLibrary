const React = require("react");
const ReactDOM = require("react-dom");

module.exports = class AddCategoryDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const newCategory = {};
    this.props.attributes.forEach((attribute) => {
      if (attribute != "books")
        newCategory[attribute] = ReactDOM.findDOMNode(
          this.refs[attribute]
        ).value.trim();
    });
    newCategory.books = [];
    this.props.onCreate(newCategory);

    this.props.attributes.forEach((attribute) => {
      if (attribute != "books")
        ReactDOM.findDOMNode(this.refs[attribute]).value = "";
    });
  }
  render() {
    const inputs = this.props.attributes.map((attribute) =>
      attribute == "books" ? null : (
        <p key={attribute}>
          <label htmlFor={attribute}>
            {" "}
            {attribute.charAt(0).toUpperCase() + attribute.slice(1)}{" "}
          </label>
          <input
            id={attribute}
            type="text"
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
          data-target="#createCategory"
        >
          Add Category
        </button>
        <div
          className="modal fade"
          id="createCategory"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Add new category: </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form>
                <div className="modal-body">
                  {" "}
                  <div className="form-group">{inputs}</div>{" "}
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
                    Add
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
