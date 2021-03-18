const React = require("react");
const ReactDOM = require("react-dom");
const client = require("../../client");
const when = require("when");

const follow = require("../../follow"); // function to hop multiple links by "rel"
const root = "/api";

const BookList = require("./BookList");
const AddBookDialog = require("./AddBookDialog");
const Toast = require("../main/Toast");
const stompClient = require("../../websocket-listener");

module.exports = class BooksView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      attributes: [],
      page: 1,
      pageSize: 10,
      links: {},
      userRole: "none",
      authors: [],
      categories: [],
      toastList: [],
    };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onReserve = this.onReserve.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  loadFromServer(pageSize) {
    follow(client, root, [{ rel: "books", params: { size: pageSize } }])
      .then((bookCollection) => {
        return client({
          method: "GET",
          path: bookCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema.entity;
          this.links = bookCollection.entity._links;
          return bookCollection;
        });
      })
      .then((bookCollection) => {
        this.page = bookCollection.entity.page;
        return bookCollection.entity._embedded.books.map((book) =>
          client({
            method: "GET",
            path: book._links.self.href,
          })
        );
      })
      .then((booksPromises) => {
        return when.all(booksPromises);
      })
      .done((books) => {
        this.setState({
          page: this.page,
          books: books,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: this.links,
        });
      });
  }

  onCreate(newBook, authors, categories) {
    follow(client, root, ["books"])
      .then((response) => {
        return client({
          method: "POST",
          path: response.entity._links.self.href,
          entity: newBook,
          headers: { "Content-Type": "application/json" },
        });
      })
      .done((response) => {
        var authorsLinks = {
          _links: {},
        };
        authors.forEach((author, index) => {
          authorsLinks._links[index] = author._links.self.href;
        });
        var categoriesLinks = {
          _links: {},
        };
        categories.forEach((category, index) => {
          categoriesLinks._links[index] = category._links.self.href;
        });
        client({
          method: "POST",
          path: response.entity._links.authors.href,
          entity: authorsLinks,
          headers: { "Content-Type": "application/json" },
        }).done((res) => {
          client({
            method: "POST",
            path: response.entity._links.categories.href,
            entity: categoriesLinks,
            headers: { "Content-Type": "application/json" },
          });
        });
      });
  }

  onUpdate(book, updatedBook, authors, categories) {
    client({
      method: "PUT",
      path: book.entity._links.self.href,
      entity: updatedBook,
      headers: {
        "Content-Type": "application/json",
        "If-Match": book.headers.Etag,
      },
    })
      .then((response) => {
        if (response.status.code === 412) {
          alert(
            "DENIED: Unable to update " +
              book.entity._links.self.href +
              ". Your copy is stale."
          );
        }
        return response;
      })
      .done((response) => {
        var authorsLinks = {
          _links: {},
        };
        authors.forEach((author, index) => {
          authorsLinks._links[index] = author._links.self.href;
        });
        var categoriesLinks = {
          _links: {},
        };
        categories.forEach((category, index) => {
          categoriesLinks._links[index] = category._links.self.href;
        });
        client({
          method: "PUT",
          path: book.entity._links.authors.href,
          entity: authorsLinks,
          headers: { "Content-Type": "application/json" },
        }).done((res) => {
          client({
            method: "PUT",
            path: book.entity._links.categories.href,
            entity: categoriesLinks,
            headers: { "Content-Type": "application/json" },
          }).done((res) => {
            this.refreshAndGoToLastPage(res);
          });
        });
      });
  }

  onDelete(book) {
    client({ method: "DELETE", path: book.entity._links.self.href });
  }

  onReserve(book) {
    client({
      method: "GET",
      path: book.entity._links.self.href + "/reserve",
    }).done((response) => {
      if (response.status.code == 200) {
        if (response.entity.success == "true")
          this.props.history.push({
            pathname: "/reservation",
          });
        else {
          const toastObj = [
            {
              id: 1,
              title: "Error",
              description: response.entity.errorMsg,
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
      .then((bookCollection) => {
        this.links = bookCollection.entity._links;
        this.page = bookCollection.entity.page;

        return bookCollection.entity._embedded.books.map((book) =>
          client({
            method: "GET",
            path: book._links.self.href,
          })
        );
      })
      .then((booksPromises) => {
        return when.all(booksPromises);
      })
      .done((books) => {
        this.setState({
          page: this.page,
          books: books,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
    this.loadAuthors();
    this.loadCategories();
  }

  updatePageSize(pageSize) {
    if (pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize);
    }
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
    this.getActiveUserRole();
    this.loadAuthors();
    this.loadCategories();
    stompClient.register([
      { route: "/topic/newBook", callback: this.refreshAndGoToLastPage },
      { route: "/topic/updateBook", callback: this.refreshCurrentPage },
      { route: "/topic/deleteBook", callback: this.refreshCurrentPage },
    ]);
  }

  loadAuthors() {
    client({
      method: "GET",
      path: "/api/authors",
    }).done((response) => {
      this.setState({
        ...this.state,
        authors: response.entity._embedded.authors,
      });
    });
  }
  loadCategories() {
    client({
      method: "GET",
      path: "/api/categories",
    }).done((response) => {
      this.setState({
        ...this.state,
        categories: response.entity._embedded.categories,
      });
    });
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
        rel: "books",
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
        rel: "books",
        params: {
          size: this.state.pageSize,
          page: this.state.page.number,
        },
      },
    ])
      .then((bookCollection) => {
        this.links = bookCollection.entity._links;
        this.page = bookCollection.entity.page;

        return bookCollection.entity._embedded.books.map((book) => {
          return client({
            method: "GET",
            path: book._links.self.href,
          });
        });
      })
      .then((booksPromises) => {
        return when.all(booksPromises);
      })
      .then((books) => {
        this.setState({
          page: this.page,
          books: books,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
    this.loadAuthors();
    this.loadCategories();
  }

  render() {
    const addDialog =
      this.state.userRole == "MANAGER" ? (
        <AddBookDialog
          categories={this.state.categories}
          authors={this.state.authors}
          attributes={this.state.attributes}
          onCreate={this.onCreate}
        />
      ) : null;

    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "80%" }}>
          <Toast toastList={this.state.toastList} position="top-right" />
          <BookList
            page={this.state.page}
            books={this.state.books}
            allAuthors={this.state.authors}
            allCategories={this.state.categories}
            links={this.state.links}
            pageSize={this.state.pageSize}
            attributes={this.state.attributes}
            userRole={this.state.userRole}
            onUpdate={this.onUpdate}
            onReserve={this.onReserve}
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
