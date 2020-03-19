import React from "react";
export default class TrTableAdmin extends React.Component {
  idMovie = React.createRef();

  movieRemove = e => {
    e.preventDefault();

    this.props.removeMovie(this.idMovie.current.value);
  };

  render() {
    let url = "https://image.tmdb.org/t/p/w500";
    const defaultUrl =
      "https://stockpictures.io/wp-content/uploads/2020/01/image-not-found-big-768x432.png";
    const { movie } = this.props;
    return (
      <>
        <tr>
          <td>{movie.title}</td>
          <td>{movie.description}</td>
          <td>
            <img src={movie.image ? url + movie.image : defaultUrl} alt={movie.title} width="150" />
          </td>
          <td>
            <form onSubmit={this.movieRemove}>
              <input type="hidden" ref={this.idMovie} value={movie.id} />
              <button
                type="submit"
                className="btn btn-danger "
                id={movie.id}
                style={{ marginTop: "2%", width: "100%" }}
              >
                Quitar
              </button>
            </form>
          </td>
        </tr>
      </>
    );
  }
}
