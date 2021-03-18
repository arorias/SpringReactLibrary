const React = require("react");
const ReactDOM = require("react-dom");
const Borrowed = require("./Borrowed");

module.exports = class BorrowedList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNavFirst = this.handleNavFirst.bind(this);
    this.handleNavPrev = this.handleNavPrev.bind(this);
    this.handleNavNext = this.handleNavNext.bind(this);
    this.handleNavLast = this.handleNavLast.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
    if (/^[0-9]+$/.test(pageSize)) {
      this.props.updatePageSize(pageSize);
    } else {
      ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(
        0,
        pageSize.length - 1
      );
    }
  }

  handleNavFirst(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.first.href);
  }

  handleNavPrev(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.prev.href);
  }

  handleNavNext(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.next.href);
  }

  handleNavLast(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.last.href);
  }

  render() {
    const pageInfo = this.props.page.hasOwnProperty("number") ? (
      <span>
        Borrowed Books - Page {this.props.page.number + 1} of{" "}
        {this.props.page.totalPages}
      </span>
    ) : null;

    const borroweds = this.props.borroweds.map((borrowed) => {
        return this.props.userRole == "USER" && borrowed.entity.libraryUser.login != this.props.userLogin ? null : (
            <Borrowed
              key={borrowed.entity._links.self.href}
              borrowed={borrowed}
              userRole={this.props.userRole}
              attributes={this.props.attributes}
              onReturn={this.props.onReturn}
            />
          )
    } );

    const navLinks = [];
    if ("first" in this.props.links) {
      navLinks.push(
        <button
          className="btn btn-primary"
          key="first"
          onClick={this.handleNavFirst}
        >
          &lt; &lt;
        </button>
      );
    }
    if ("prev" in this.props.links) {
      navLinks.push(
        <button
          className="btn btn-primary"
          key="prev"
          onClick={this.handleNavPrev}
        >
          &lt;
        </button>
      );
    }
    if ("next" in this.props.links) {
      navLinks.push(
        <button
          className="btn btn-primary"
          key="next"
          onClick={this.handleNavNext}
        >
          &gt;
        </button>
      );
    }
    if ("last" in this.props.links) {
      navLinks.push(
        <button
          className="btn btn-primary"
          key="last"
          onClick={this.handleNavLast}
        >
          &gt; &gt;
        </button>
      );
    }

    return (
      <div>
        <h4 className="card-title mt-3 text-center">{pageInfo}</h4>
        <div className="col">
          <div className="row">
            <table className="table table-striped table-bordered table-hover">
              <tbody>
                <tr>
                  <th> Book Title: </th>
                  <th> User: </th>
                  <th> Start Date: </th>
                  <th> Due Date: </th>
                  <th> Book status: </th>
                  <th> Controls: </th>
                </tr>
                {borroweds}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"> Entries per page: </span>
                </div>
                <input
                  ref="pageSize"
                  defaultValue={this.props.pageSize}
                  onInput={this.handleInput}
                  id="pageSizeInput"
                />
              </div>
            </div>
            <div className="col"> {navLinks} </div>
          </div>
        </div>
      </div>
    );
  }
};
