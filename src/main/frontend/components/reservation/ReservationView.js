const React = require("react");
const ReactDOM = require("react-dom");
const client = require("../../client");
const when = require("when");
const follow = require("../../follow");

const Toast = require("../main/Toast");

const stompClient = require("../../websocket-listener");
const ReservationtList = require("./ReservationList");

module.exports = class ReservationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: [],
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
    this.onDelete = this.onDelete.bind(this);
    this.onBorrow = this.onBorrow.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  loadFromServer(pageSize) {
    follow(client, this.state.root, [{ rel: "reservations", params: { size: pageSize } }])
      .then((reservationCollection) => {
        return client({
          method: "GET",
          path: reservationCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema.entity;
          this.links = reservationCollection.entity._links;
          return reservationCollection;
        });
      })
      .then((reservationCollection) => {
        this.page = reservationCollection.entity.page;
        return reservationCollection.entity._embedded.reservations.map(
          (reservation) =>
            client({
              method: "GET",
              path: reservation._links.self.href,
            })
        );
      })
      .then((reservationPromises) => {
        return when.all(reservationPromises);
      })
      .done((reservations) => {
        this.setState({
          page: this.page,
          reservations: reservations,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: this.links,
        });
      });
  }

  onDelete(reservation) {
    client({ method: "DELETE", path: reservation.entity._links.self.href });
  }

  onBorrow(reservation) {
    client({
      method: "GET",
      path: reservation.entity._links.self.href + "/borrow",
    }).done((response) => {
      if (response.status.code == 200) {
        if (response.entity.success == "true")
          this.props.history.push({
            pathname: "/borrowed",
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
      .then((reservationCollection) => {
        this.links = reservationCollection.entity._links;
        this.page = reservationCollection.entity.page;

        return reservationCollection.entity._embedded.reservations.map(
          (reservation) =>
            client({
              method: "GET",
              path: reservation._links.self.href,
            })
        );
      })
      .then((reservationPromises) => {
        return when.all(reservationPromises);
      })
      .done((reservations) => {
        this.setState({
          page: this.page,
          reservations: reservations,
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
        newRoot = "/api/libraryUsers/" + response.entity.id + "/reservations";
      this.setState({
        ...this.state,
        userLogin : response.entity.user,
        userRole: response.entity.role,
        userId: response.entity.id,
        root: newRoot,
      });
    });
  }

  refreshAndGoToLastPage(message) {
    follow(client, this.state.root, [
      {
        rel: "reservations",
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
    follow(client, this.state.root, [
      {
        rel: "reservations",
        params: {
          size: this.state.pageSize,
          page: this.state.page.number,
        },
      },
    ])
      .then((reservationCollection) => {
        this.links = reservationCollection.entity._links;
        this.page = reservationCollection.entity.page;

        return reservationCollection.entity._embedded.reservations.map(
          (reservation) => {
            return client({
              method: "GET",
              path: reservation._links.self.href,
            });
          }
        );
      })
      .then((reservationPromises) => {
        return when.all(reservationPromises);
      })
      .then((reservations) => {
        this.setState({
          page: this.page,
          reservations: reservations,
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
      { route: "/topic/newReservation", callback: this.refreshAndGoToLastPage },
      { route: "/topic/updateReservation", callback: this.refreshCurrentPage },
      { route: "/topic/deleteReservation", callback: this.refreshCurrentPage },
    ]);
  }

  render() {
    return (
      <div className="card bg-light">
        <div className="card-body mx-auto" style={{ maxWidth: "80%" }}>
          <Toast toastList={this.state.toastList} position="top-right" />
          <ReservationtList
            page={this.state.page}
            reservations={this.state.reservations}
            links={this.state.links}
            pageSize={this.state.pageSize}
            attributes={this.state.attributes}
            userLogin={this.state.userLogin}
            userRole={this.state.userRole}
            onBorrow={this.onBorrow}
            onNavigate={this.onNavigate}
            onDelete={this.onDelete}
            updatePageSize={this.updatePageSize}
          />
        </div>
      </div>
    );
  }
};
