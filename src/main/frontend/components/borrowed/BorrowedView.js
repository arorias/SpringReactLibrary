const React = require("react");
const ReactDOM = require("react-dom");
const client = require("../../client");
const when = require("when");
const follow = require("../../follow");
const Toast = require("../main/Toast");

const stompClient = require("../../websocket-listener");
const BorrowedList = require("./BorrowedList");

module.exports = class BorrowedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      borroweds: [],
      attributes: [],
      page: 1,
      pageSize: 10,
      links: {},
      userRole: "none",
      userId: "",
      userLogin: "",
      toastList: [],
      root: "/api",
    };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onReturn = this.onReturn.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  loadFromServer(pageSize) {
    follow(client, this.state.root, [
      { rel: "borroweds", params: { size: pageSize, sort: "returned" } },
    ])
      .then((borrowedCollection) => {
        return client({
          method: "GET",
          path: borrowedCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema.entity;
          this.links = borrowedCollection.entity._links;
          return borrowedCollection;
        });
      })
      .then((borrowedCollection) => {
        this.page = borrowedCollection.entity.page;
        return borrowedCollection.entity._embedded.borroweds.map((borrowed) =>
          client({
            method: "GET",
            path: borrowed._links.self.href,
          })
        );
      })
      .then((borrowedPromises) => {
        return when.all(borrowedPromises);
      })
      .done((borroweds) => {
        this.setState({
          page: this.page,
          borroweds: borroweds,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: this.links,
        });
      });
  }

  onReturn(borrowed) {
    client({
      method: "GET",
      path: borrowed.entity._links.self.href + "/return",
    }).done((response) => {
      if (response.status.code == 200) {
        if (response.entity.success == "true") {
          const toastObj = [
            {
              id: 1,
              title: "Successfully returned.",
              description: "",
              backgroundColor: "#5cb85c",
            },
          ];
          this.setState({ ...this.state, toastList: toastObj });
          this.refreshCurrentPage("update");
        } else {
          const toastObj = [
            {
              id: 2,
              title: "Error",
              description: "Error",
              backgroundColor: "#f0ad4e",
            },
          ];
          this.setState({ ...this.state, toastList: toastObj });
        }
      }
    });
  }

  onNavigate(navUri) {
    client({
      method: "GET",
      path: navUri,
    })
      .then((borrowedCollection) => {
        this.links = borrowedCollection.entity._links;
        this.page = borrowedCollection.entity.page;

        return borrowedCollection.entity._embedded.borroweds.map((borrowed) =>
          client({
            method: "GET",
            path: borrowed._links.self.href,
          })
        );
      })
      .then((borrowedPromises) => {
        return when.all(borrowedPromises);
      })
      .done((borroweds) => {
        this.setState({
          page: this.page,
          borroweds: borroweds,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }

  updatePageSize(pageSize) {
    if (pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize);
    }
  }

  getActiveUserRole() {
    client({
      method: "GET",
      path: "/api/user/me",
    }).done((response) => {
      newRoot = "/api";
      if (response.entity.role == "USER")
        newRoot = "/api/libraryUsers/" + response.entity.id + "/borroweds";
      this.setState({
        ...this.state,
        userLogin: response.entity.user,
        userRole: response.entity.role,
        userId: response.entity.id,
        root: newRoot,
      });
    });
  }

  refreshAndGoToLastPage(message) {
    follow(client, this.state.root, [
      {
        rel: "borroweds",
        params: { size: this.state.pageSize, sort: "returned" },
      },
    ]).done((response) => {
      if (response.entity._links.last !== undefined) {
        this.onNavigate(response.entity._links.last.href);
      } else {
        this.onNavigate(response.entity._links.self.href);
      }
    });
  }

  refreshCurrentPage(message) {
    follow(client, this.state.root, [
      {
        rel: "borroweds",
        params: {
          size: this.state.pageSize,
          page: this.state.page.number,
          sort: "returned",
        },
      },
    ])
      .then((borrowedCollection) => {
        this.links = borrowedCollection.entity._links;
        this.page = borrowedCollection.entity.page;

        return borrowedCollection.entity._embedded.borroweds.map((borrowed) => {
          return client({
            method: "GET",
            path: borrowed._links.self.href,
          });
        });
      })
      .then((borrowedPromises) => {
        return when.all(borrowedPromises);
      })
      .then((borroweds) => {
        this.setState({
          page: this.page,
          borroweds: borroweds,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }

  componentDidMount() {
    this.getActiveUserRole();
    this.loadFromServer(this.state.pageSize);

    stompClient.register([
      { route: "/topic/newBorrowed", callback: this.refreshAndGoToLastPage },
      { route: "/topic/updateBorrowed", callback: this.refreshCurrentPage },
      { route: "/topic/deleteBorrowed", callback: this.refreshCurrentPage },
    ]);
  }

  render() {
    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "80%" }}>
          <Toast toastList={this.state.toastList} position="top-right" />
          <BorrowedList
            page={this.state.page}
            borroweds={this.state.borroweds}
            links={this.state.links}
            pageSize={this.state.pageSize}
            attributes={this.state.attributes}
            userLogin={this.state.userLogin}
            userRole={this.state.userRole}
            onReturn={this.onReturn}
            onNavigate={this.onNavigate}
            updatePageSize={this.updatePageSize}
          />
        </div>
      </div>
    );
  }
};
