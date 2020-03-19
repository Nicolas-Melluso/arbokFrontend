const popularMovie = async (token, pageP = 1) => {
  const movies = await fetch(`http://localhost:5000/api/movies/fill/${pageP}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(result => result);
  return movies;
};

const userFavorites = async (token, id) => {
  const movies = await fetch(`http://localhost:5000/api/users/${id}/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(result => result);
  return movies;
};

export const addNewFavorite = async (token, userId, movieId) => {
  let response = await fetch(`http://localhost:5000/api/users/${userId}/movie/${movieId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  });
  let result = await response.json();

  return result;
};

const forClient = async token => {
  const movies = await fetch(`http://localhost:5000/api/movies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(result => result);
  return movies;
};

const getMovieById = async (token, id) => {
  const movies = await fetch(`http://localhost:5000/api/movies/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(result => result);
  return movies;
};

const getMovieForId = async id => {
  const urlFindId = `https://api.themoviedb.org/3/movie/${id}?api_key=ce62b7f668a97b07e6d58a85df75641b&language=es-ES`;
  const response = await fetch(urlFindId);
  const data = await response.json();
  return data;
};

const getMovieByNameAPI = async (token, nameMovie) => {
  const movies = await fetch(`http://localhost:5000/api/movies/nameapi/${nameMovie}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(result => result);
  return movies;
};

const getMovieByNameDB = async (token, nameMovie) => {
  const movies = await fetch(`http://localhost:5000/api/movies/namedb/${nameMovie}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(result => result);
  return movies;
};

export const deleteById = async (token, movieId) => {
  let response = await fetch(`http://localhost:5000/api/movies/${movieId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  });
  let result = await response.json();

  return result;
};

export const saveMovieDB = async peli => {
  await fetch("http://localhost:5000/api/movies", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: peli.title,
      description: peli.description,
      image: peli.image,
      genres: peli.genres
    })
  });
};

export default {
  popularMovie,
  forClient,
  getMovieById,
  userFavorites,
  addNewFavorite,
  // getPopularMovie,
  // nowPlayingMovies,
  // upComingMovies,
  getMovieByNameAPI,
  getMovieByNameDB,
  getMovieForId,
  deleteById,
  saveMovieDB
};
