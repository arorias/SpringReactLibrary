const React = require("react");
const ReactDOM = require("react-dom");
var BrowserRouter = require("react-router-dom").BrowserRouter;
var Route = require("react-router-dom").Route;
var Switch = require("react-router-dom").Switch;

const Navigation = require("./components/main/Navigation");
const Footer = require("./components/main/Footer");
const HomeView = require("./components/main/HomeView");
const UserRegister = require("./components/main/RegisterView");
const LoginView = require("./components/main/LoginView");
const RegisterView = require("./components/main/RegisterView");
const BooksView = require("./components/book/BooksView");
const ReservationView = require("./components/reservation/ReservationView");
const BorrowedView = require("./components/borrowed/BorrowedView");
const AuthorsView = require("./components/author/AuthorsView");
const CategoriesView = require("./components/category/CategoriesView");

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container-fluid">
          <Navigation />
          <div className="jumbotron">
            <Switch>
              <Route path="/" exact component={HomeView} />
              <Route path="/login" component={LoginView} />
              <Route path="/register" component={RegisterView} />
              <Route path="/books" component={BooksView} />
              <Route path="/reservation" component={ReservationView} />
              <Route path="/borrowed" component={BorrowedView} />
              <Route path="/register" component={UserRegister} />
              <Route path="/authors" component={AuthorsView} />
              <Route path="/category" component={CategoriesView} />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react"));
