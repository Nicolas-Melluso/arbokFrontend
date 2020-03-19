import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import opcional from "../img/default.gif";
import MovieService from "../service/movieService.js";
import { NavLink, Link } from "react-router-dom";

export default class MovieCard extends React.Component {
  idMovie = React.createRef();

  addFav = e => {
    e.preventDefault();
    this.props.addFavMovie(this.idMovie.current.value);
  };
  ver = (id, e) => {
    e.preventDefault();
    this.props.viewMore(id);
  };

  render() {
    let url = "https://image.tmdb.org/t/p/w500";
    const defaultUrl =
      "https://stockpictures.io/wp-content/uploads/2020/01/image-not-found-big-768x432.png";

    const { movie } = this.props;
    const logged = this.props.user.login;
    var fav;
    let imagen;
    if (movie.image) {
      imagen = url + movie.image;
    } else {
      imagen = opcional;
    }
    if (logged) {
      fav = (
        <form onSubmit={this.addFav}>
          <input type="hidden" ref={this.idMovie} value={movie.id} />
          <Button
            className="float-right"
            variant="outline-warning"
            type="submit"
            id={movie.id}
          >
            ★
          </Button>
        </form>
      );
    }

    return (
      <>
        <Row>
          <Col sm-3="true">
            <Card
              style={{ width: "18rem", marginBottom: 15 }}
              className="bg-dark text-white myImageDefault"
            >
              <Card.Title style={{ color: "white", padding: 14 }}>
                {movie.title}
              </Card.Title>
              <Card.Img
                onerror={(movie.image = undefined)}
                src={movie.image ? url + movie.image : defaultUrl}
                style={{ width: "100%" }}
                alt="Card image"
              />
              <Card.ImgOverlay>
                <Button
                  variant="outline-light"
                  type="submit"
                  onClick={e => this.ver(movie.id, e)}
                  className="float-right"
                >
                  <Link to="/movie/view">{"Ver Más"}</Link>
                </Button>
                {fav}
              </Card.ImgOverlay>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
