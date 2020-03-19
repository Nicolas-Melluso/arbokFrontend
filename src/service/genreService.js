const getAllGenres = async (token) => {
    let response = await fetch(`http://localhost:5000/api/genres`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
     response = await response.json();
    return response;
  };




  export default {
    getAllGenres

  };