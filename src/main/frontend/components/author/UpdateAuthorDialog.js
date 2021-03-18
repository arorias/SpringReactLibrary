const React = require("react");
const ReactDOM = require("react-dom");

module.exports = class UpdateAuthorDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const updatedAuthor = {};
    this.props.attributes.forEach((attribute) => {
      if (attribute != "books")
        updatedAuthor[attribute] = ReactDOM.findDOMNode(
          this.refs[attribute]
        ).value.trim();
    });
    this.props.onUpdate(this.props.author, updatedAuthor);
  }

  render() {
    const inputs = this.props.attributes.map((attribute) =>
      attribute == "books" ? null : (
        <p key={this.props.author.entity[attribute] + attribute}>
          <label htmlFor={this.props.author.entity[attribute] + attribute}>
            {" "}
            {attribute.charAt(0).toUpperCase() + attribute.slice(1)}{" "}
          </label>
          <input
            type="text"
            id={this.props.author.entity[attribute] + attribute}
            placeholder={attribute}
            defaultValue={this.props.author.entity[attribute]}
            ref={attribute}
            className="form-control"
          />
        </p>
      )
    );
    var id = this.props.author.entity._links.self.href;
    id = id.substr(id.lastIndexOf("/") + 1);
    const modalId = "updateAuthor-" + id;

    return (
      <span>
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target={"#" + modalId}
          key={this.props.author.entity._links.self.href}
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
                <h5 className="modal-title"> Update author </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="form-group">{inputs} </div>
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
