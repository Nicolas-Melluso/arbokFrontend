import React from "react";
//Componentes programados
import userService, { logoutService, getLoggedUser } from "../service/userService";
import movieService from "../service/movieService";
import Nav from "./Nav";
import Login from "./Login.js";
import Movie from "./Movie";
import Admin from "../pages/Admin";
import DetailMovie from "./DetailMovie";
import CardContainer from "../components/CardContainer.js";
import ListOfMovieAdmin from "./ListOfMovieAdmin";
import Swal from "sweetalert2";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      result: [],
      forClient: [],
      clientFavs: [],
      viewMore: "",
      filtered: [],
      redirect: false,
      user: {
        admin: false,
        login: false
      },
      search: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      {
        this.callApi();
        getLoggedUser(localStorage.getItem("token")).then(user => {
          let loginUser = {
            admin: user.role == 1 ? true : false,
            login: true,
            id: user.id,
            username: user.username
          };
          this.setState({
            user: loginUser
          });
        });
      }
    }
  }

  componentDidUpdate() {}
  logout = () => {
    logoutService();
    localStorage.removeItem("token");
    let logoutUser = {
      admin: false,
      login: false
    };
    this.setState({
      user: logoutUser
    });
  };

  login = async user => {
    const Swal = require("sweetalert2");
    userService.loginService(user).then(acept => {
      if (acept) {
        let loginUser = {
          admin: acept.user.role == 1 ? true : false,
          login: true,
          id: acept.user.id,
          username: acept.user.username
        };
        this.setState({
          user: loginUser
        });
        localStorage.setItem("token", acept.access_token);

        this.callApi();

        Swal.fire({
          title: "Éxito!",
          text: "Inicio de sesión correcto",
          icon: "success",
          confirmButtonText: "Continuar"
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Email o contraseña inválido",
          icon: "error",
          confirmButtonText: "Continuar"
        });
      }
    });
  };

  callApi = pageP => {
    movieService
      .popularMovie(localStorage.getItem("token"), pageP)
      .then(async data => {
        let forClient = await movieService.forClient();
        // que traiga de la tabla intermedia todas las peliculas de un usuario que casualmente es el unico.
        this.setState({
          result: data.results,
          forClient: forClient
        });
      });
  };
  inicio = async () => {
    let forClient = await movieService.forClient();
    this.setState({
      forClient: forClient,
      search: false
    });
  };

  searchForName = name => {
    if (name != undefined) {
      movieService
        .getMovieByNameAPI(localStorage.getItem("token"), name)
        .then(data => {
          this.setState({
            search: true,
            result: data
          });
          return data;
        });
    } else {
      movieService.popularMovie(localStorage.getItem("token"), 1).then(data => {
        this.setState({
          search: true,
          result: data.results
        });
        return data;
      });
    }
  };

  searchForNameLocal = async name => {
    let nameMayus = name.toUpperCase();
    let movies = await movieService.forClient();
    let resultado = [];
    movies.forEach(movie => {
      if (movie.title.toUpperCase().includes(nameMayus)) {
        resultado.push(movie);
      }
    });

    this.setState({
      search: true,
      forClient: resultado
    });
    if (!resultado.length) {
      Swal.fire({
        title: "Error!",
        text: "No se encuentra esa pelicula",
        icon: "error",
        confirmButtonText: "Volver"
      });
    }
  };

  filterByCategory = async categoryID => {
    let movies = await movieService.forClient();
    let filtered = [];
    movies.forEach(movie => {
      movie.genres.forEach(movieGen => {
        if (movieGen.id === categoryID) {
          filtered.push(movie);
        }
      });
    });
    this.setState({
      filtered: filtered
    });

    if (!filtered.length) {
      const Swal = require("sweetalert2");

      Swal.fire({
        title: "Error!",
        text: "No hay películas de ese género",
        icon: "error",
        confirmButtonText: "Continuar"
      });
      this.setState({ redirect: true });
    }
  };

  addFavMovie = async id => {
    const Swal = require("sweetalert2");
    let clientFavs = await movieService.userFavorites(
      localStorage.getItem("token"),
      this.state.user.id
    );

    let flag = false; // is it duplicated?

    clientFavs.forEach(movie => {
      if (movie.id == id) {
        flag = true;
      }
    });

    if (flag != true) {
      movieService.addNewFavorite(
        localStorage.getItem("token"),
        this.state.user.id,
        id
      );

      Swal.fire({
        title: "Éxito!",
        text: "Película añadida a favoritos",
        icon: "success",
        confirmButtonText: "Continuar"
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "La pelicula ya existe!",
        icon: "error",
        confirmButtonText: "Volver"
      });
    }
    this.setState({
      clientFavs: clientFavs
    });
  };

  addMovie = async peli => {
    const Swal = require("sweetalert2");
    let forclient = await movieService.forClient();
    let movie = await movieService.getMovieByNameDB(
      localStorage.getItem("token"),
      peli.title
    );
    if (movie.length) {
      Swal.fire({
        title: "Error!",
        text: "La pelicula ya existe!",
        icon: "error",
        confirmButtonText: "Volver"
      });
    } else {
      movieService.saveMovieDB(peli);
      Swal.fire({
        title: "Éxito!",
        text: "Película añadida a la lista",
        icon: "success",
        confirmButtonText: "Continuar"
      });
      this.setState({
        forClient: forclient
      });
    }
  };

  removeMovie = async id => {
    let movies = await movieService.forClient();

    movies.forEach(async movie => {
      if (movie.id == id) {
        await movieService.deleteById(localStorage.getItem("token"), id);
        movies = await movieService.forClient();
        this.setState({
          forClient: movies
        });
      }
    });

    return <Redirect to={"/"} />; //Don't do nothing, apparently
  };

  viewMore = async id => {
    let movies = await movieService.forClient();
    let movie = await movies.find(mov => mov.id === id);
    // movie.push(movies.find(movie => movie.id === id));
    this.setState({
      viewMore: movie
    });
  };

  updateFavorites = async () => {
    let clientFavsDB = await movieService.userFavorites(
      localStorage.getItem("token"),
      this.state.user.id
    );
    this.setState({ clientFavs: clientFavsDB });
  };

  render() {
    return (
      <>
        <Router>
          {localStorage.getItem("token") ? null : <Redirect to={"/login"} />}
          {localStorage.getItem("token") ? (
            <Nav
              user={this.state.user}
              search={this.state.search}
              inicio={this.inicio}
              logout={this.logout}
              searchForNameLocal={this.searchForNameLocal}
              filterByCategory={this.filterByCategory}
              updateFavorites={this.updateFavorites}
            />
          ) : null}
          {this.state.redirect ? <Redirect to={"/"} /> : null}

          <Switch>
            <Route exact path="/">
              <CardContainer
                viewMore={this.viewMore}
                user={this.state.user}
                movies={this.state.forClient}
                addFavMovie={this.addFavMovie}
              />
            </Route>
            <Route exact path="/favs">
              <CardContainer
                user={this.state.user}
                movies={this.state.clientFavs}
              />
            </Route>
            <Route exact path="/filtered">
              <CardContainer
                user={this.state.user}
                movies={this.state.filtered}
              />
            </Route>
            <Route exact path="/movies/create">
              <Movie addMovie={this.addMovie} />
            </Route>
            <Route exact path="/admin/movies/">
              <ListOfMovieAdmin
                user={this.state.user}
                movies={this.state.forClient}
                addMovie={this.addMovie}
                removeMovie={this.removeMovie}
              />
            </Route>

            <Route exact path="/login">
              <Login login={this.login} user={this.state.user} />
            </Route>
            <Route path="/movie/view">
              <DetailMovie viewMore={this.state.viewMore} />
            </Route>
            <Route exact path="/admin">
              <Admin
                callApi={this.callApi}
                searchForName={this.searchForName}
                user={this.state.user}
                movies={this.state.result}
                addMovie={this.addMovie}
              />
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}
export default App;
