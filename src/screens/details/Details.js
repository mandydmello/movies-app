import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const Details = (props) => {
  const [movie, setMovie] = useState({});

  useEffect(() => {
    //Fetch single movie
    fetch(props.baseUrl + "movies/" + props.match.params.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setMovie(response));
  }, []);

  return (
    <div>
      <Header
        id={props.match.params.id}
        baseUrl={props.baseUrl}
        showBookShowButton={true}
      />
      <div>
        <Typography>
          <Link to="/">&#60; Back to Home</Link>
        </Typography>
      </div>
      {movie !== {} && (
        <div>
          <div>
            <img src={movie.poster_url} alt={movie.title} />
          </div>
          <div>
            <div>
              <Typography variant="headline" component="h2">
                {movie.title}
              </Typography>
            </div>
            <div>
              <Typography>
                <span>Genres: </span>
                {movie.genres && movie.genres.join(", ")}
              </Typography>
            </div>
            <div>
              <Typography>
                <span>Duration: </span> {movie.duration}
              </Typography>
            </div>
            <div>
              <Typography>
                <span>Release Date: </span>
                {new Date(movie.release_date).toDateString()}
              </Typography>
            </div>
            <div>
              <Typography>
                <span>Rating:</span>
                {movie.critics_rating} {movie.rating}
              </Typography>
            </div>
            <div>
              <Typography>
                <span>Plot: </span>
                <a href={movie.wiki_url}>(Wiki Link)</a>
                {movie.storyline}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
