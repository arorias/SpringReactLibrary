const React = require("react");
const ReactDOM = require("react-dom");
const client = require("../../client");
const when = require("when");
const stompClient = require("../../websocket-listener");
const follow = require("../../follow");
const root = "/api";
const Author = require("./Author");
const AuthorsList = require("./AuthorList");
const AddAuthorDialog = require("./AddAuthorDialog");

module.exports = class AuthorsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      attributes: [],
      page: 1,
      pageSize: 10,
      links: {},
      userRole: "none",
    };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
    this.getActiveUserRole();
    stompClient.register([
      { route: "/topic/newAuthor", callback: this.refreshAndGoToLastPage },
      { route: "/topic/updateAuthor", callback: this.refreshCurrentPage },
      { route: "/topic/deleteAuthor", callback: this.refreshCurrentPage },
    ]);
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
      this.setState({ ...this.state, userRole: response.entity.role });
    });
  }


  refreshAndGoToLastPage(message) {
    follow(client, root, [
      {
        rel: "authors",
        params: { size: this.state.pageSize },
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
    follow(client, root, [
      {
        rel: "authors",
        params: {
          size: this.state.pageSize,
          page: this.state.page.number,
        },
      },
    ])
      .then((authorsCollection) => {
        this.links = authorsCollection.entity._links;
        this.page = authorsCollection.entity.page;

        return authorsCollection.entity._embedded.authors.map((author) => {
          return client({
            method: "GET",
            path: author._links.self.href,
          });
        });
      })
      .then((authorsPromises) => {
        return when.all(authorsPromises);
      })
      .then((authors) => {
        this.setState({
          page: this.page,
          authors: authors,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }

  onNavigate(navUri) {
    client({
      method: "GET",
      path: navUri,
    })
      .then((authorsCollection) => {
        this.links = authorsCollection.entity._links;
        this.page = authorsCollection.entity.page;

        return authorsCollection.entity._embedded.authors.map((author) =>
          client({
            method: "GET",
            path: author._links.self.href,
          })
        );
      })
      .then((authorsPromises) => {
        return when.all(authorsPromises);
      })
      .done((authors) => {
        this.setState({
          page: this.page,
          authors: authors,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }

  onCreate(newAuthor) {
    follow(client, root, ["authors"]).done((response) => {
      return client({
        method: "POST",
        path: response.entity._links.self.href,
        entity: newAuthor,
        headers: { "Content-Type": "application/json" },
      });
    });
  }

  onUpdate(author, updatedAuthor) {
    client({
      method: "PUT",
      path: author.entity._links.self.href,
      entity: updatedAuthor,
      headers: {
        "Content-Type": "application/json",
        "If-Match": author.headers.Etag,
      },
    }).done((response) => {
      if (response.status.code === 412) {
        alert(
          "DENIED: Unable to update " +
            author.entity._links.self.href +
            ". Your copy is stale."
        );
      }
    });
  }

  onDelete(author) {
    client({ method: "DELETE", path: author.entity._links.self.href });
  }

  loadFromServer(pageSize) {
    follow(client, root, [{ rel: "authors", params: { size: pageSize } }])
      .then((authorsCollection) => {
        return client({
          method: "GET",
          path: authorsCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema.entity;
          this.links = authorsCollection.entity._links;
          return authorsCollection;
        });
      })
      .then((authorsCollection) => {
        this.page = authorsCollection.entity.page;
        return authorsCollection.entity._embedded.authors.map((author) =>
          client({
            method: "GET",
            path: author._links.self.href,
          })
        );
      })
      .then((authorsPromises) => {
        return when.all(authorsPromises);
      })
      .done((authors) => {
        this.setState({
          page: this.page,
          authors: authors,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: this.links,
        });
      });
  }

  render() {
    const addDialog =
      this.state.userRole == "MANAGER" ? (
        <AddAuthorDialog
          attributes={this.state.attributes}
          onCreate={this.onCreate}
        />
      ) : null;

    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "80%" }}>
          <AuthorsList
            page={this.state.page}
            authors={this.state.authors}
            links={this.state.links}
            pageSize={this.state.pageSize}
            attributes={this.state.attributes}
            userRole={this.state.userRole}
            onUpdate={this.onUpdate}
            onNavigate={this.onNavigate}
            onDelete={this.onDelete}
            updatePageSize={this.updatePageSize}
          />
          {addDialog}
        </div>
      </div>
    );
  }
};
