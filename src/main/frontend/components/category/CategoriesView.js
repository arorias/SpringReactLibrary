const React = require("react");
const ReactDOM = require("react-dom");
const client = require("../../client");
const when = require("when");
const stompClient = require("../../websocket-listener");
const follow = require("../../follow");
const root = "/api";
const Category = require("./Category");
const CategoryList = require("./CategoryList");
const AddCategoryDialog = require("./AddCategoryDialog");

module.exports = class CategoriesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
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
      { route: "/topic/newCategory", callback: this.refreshAndGoToLastPage },
      { route: "/topic/updateCategory", callback: this.refreshCurrentPage },
      { route: "/topic/deleteCategory", callback: this.refreshCurrentPage },
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
        rel: "categories",
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
        rel: "categories",
        params: {
          size: this.state.pageSize,
          page: this.state.page.number,
        },
      },
    ])
      .then((categoriesCollection) => {
        this.links = categoriesCollection.entity._links;
        this.page = categoriesCollection.entity.page;

        return categoriesCollection.entity._embedded.categories.map((category) => {
          return client({
            method: "GET",
            path: category._links.self.href,
          });
        });
      })
      .then((categoryPromises) => {
        return when.all(categoryPromises);
      })
      .then((categories) => {
        this.setState({
          page: this.page,
          categories: categories,
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
      .then((categoriesCollection) => {
        this.links = categoriesCollection.entity._links;
        this.page = categoriesCollection.entity.page;

        return categoriesCollection.entity._embedded.categories.map((category) =>
          client({
            method: "GET",
            path: category._links.self.href,
          })
        );
      })
      .then((cetegoriesPromises) => {
        return when.all(cetegoriesPromises);
      })
      .done((categories) => {
        this.setState({
          page: this.page,
          categories: categories,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }

  onCreate(newCategory) {
    follow(client, root, ["categories"]).done((response) => {
      return client({
        method: "POST",
        path: response.entity._links.self.href,
        entity: newCategory,
        headers: { "Content-Type": "application/json" },
      });
    });
  }

  onUpdate(category, updatedCategory) {
    client({
      method: "PUT",
      path: category.entity._links.self.href,
      entity: updatedCategory,
      headers: {
        "Content-Type": "application/json",
        "If-Match": category.headers.Etag,
      },
    }).done((response) => {
      if (response.status.code === 412) {
        alert(
          "DENIED: Unable to update " +
          category.entity._links.self.href +
            ". Your copy is stale."
        );
      }
    });
  }

  onDelete(category) {
    client({ method: "DELETE", path: category.entity._links.self.href });
  }

  loadFromServer(pageSize) {
    follow(client, root, [{ rel: "categories", params: { size: pageSize } }])
      .then((categoriesCollection) => {
        return client({
          method: "GET",
          path: categoriesCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema.entity;
          this.links = categoriesCollection.entity._links;
          return categoriesCollection;
        });
      })
      .then((categoriesCollection) => {
        this.page = categoriesCollection.entity.page;
        return categoriesCollection.entity._embedded.categories.map((category) =>
          client({
            method: "GET",
            path: category._links.self.href,
          })
        );
      })
      .then((categoriesPromises) => {
        return when.all(categoriesPromises);
      })
      .done((categories) => {
        this.setState({
          page: this.page,
          categories: categories,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: this.links,
        });
      });
  }

  render() {
    const addDialog =
      this.state.userRole == "MANAGER" ? (
        <AddCategoryDialog
          attributes={this.state.attributes}
          onCreate={this.onCreate}
        />
      ) : null;

    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "80%" }}>
          <CategoryList
            page={this.state.page}
            categories={this.state.categories}
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
