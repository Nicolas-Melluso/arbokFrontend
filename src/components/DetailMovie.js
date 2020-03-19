import React from "react";

export default class DetailMovie extends React.Component {
  render() {
    const image_url =
      "data:image/jpeg;base64,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";
    let url = "https://image.tmdb.org/t/p/w500";
    const defaultUrl =
      "https://stockpictures.io/wp-content/uploads/2020/01/image-not-found-big-768x432.png";
    const { id, title, description, image } = this.props.viewMore;

    return (
      <div style={{ backgroundImage: `url(${image_url})`, marginTop: "4%" }}>
        <div className="container">
          <div className="row">
            <div className="col-8" style={{ width: "40%", textAlign: "center" }}>
              <div className="card mb-3" style={{ width: "50%" }}>
                <img
                  className="card-img-top"
                  src={image ? url + image : defaultUrl}
                  width="10%"
                  alt="Card image cap"
                />
              </div>
            </div>
            <div className="col-4">
              <div className="card mb-3" style={{ width: "100%" }}>
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">{description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
