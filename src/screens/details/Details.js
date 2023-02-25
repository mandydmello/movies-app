import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import Typography from "@material-ui/core/Typography";
import YouTube from "react-youtube";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Link } from "react-router-dom";
import "./Details.css";

const Details = (props) => {
  const [movie, setMovie] = useState({});
  const [starIcons, setStarIcons] = useState([
    {
      id: 1,
      color: "black",
    },
    {
      id: 2,
      color: "black",
    },
    {
      id: 3,
      color: "black",
    },
    {
      id: 4,
      color: "black",
    },
    {
      id: 5,
      color: "black",
    },
  ]);

  const ytVideoOptions = {
    height: "300",
    width: "700",
    playerVars: {
      autoplay: 1,
    },
  };

  const artistClickHandler = (url) => {
    window.location = url;
  };

  const starClickHandler = (starId) => {
    let starsList = [];
    for (let i of starIcons) {
      let temp = i;
      if (i.id <= starId) {
        temp.color = "yellow";
      } else {
        temp.color = "black";
      }
      starsList.push(temp);
    }

    setStarIcons(starsList);
  };

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
    <div className="details-page">
      <Header
        id={props.match.params.id}
        baseUrl={props.baseUrl}
        showBookShowButton={true}
      />
      <div className="back-button">
        <Typography>
          <Link to="/">&#60; Back to Home</Link>
        </Typography>
      </div>
      {movie !== {} && (
        <div className="flex-container-details">
          <div className="left-details">
            <img src={movie.poster_url} alt={movie.title} />
          </div>
          <div className="middle-details">
            <div>
              <Typography variant="headline" component="h2">
                {movie.title}
              </Typography>
            </div>
            <div>
              <Typography>
                <span className="bold-text">Genres: </span>
                {movie.genres && movie.genres.join(", ")}
              </Typography>
            </div>
            <div>
              <Typography>
                <span className="bold-text">Duration: </span> {movie.duration}
              </Typography>
            </div>
            <div>
              <Typography>
                <span className="bold-text">Release Date: </span>
                {new Date(movie.release_date).toDateString()}
              </Typography>
            </div>
            <div>
              <Typography>
                <span className="bold-text">Rating:</span>
                {movie.critics_rating} {movie.rating}
              </Typography>
            </div>
            <div className="margin-top-16">
              <Typography>
                <span className="bold-text">Plot: </span>
                <a
                  href={movie.wiki_url}
                  style={{ textDecoration: "underline" }}
                >
                  (Wiki Link)
                </a>
                {""} {movie.storyline}
              </Typography>
            </div>
            <div className="trailer-container">
              <Typography>
                <span className="bold-text">Trailer:</span>
              </Typography>
              <YouTube
                videoId={movie.trailer_url && movie.trailer_url.split("?v=")[1]}
                opts={ytVideoOptions}
              />
            </div>
          </div>
          <div className="right-details">
            <Typography>
              <span className="bold-text">Rate this movie: </span>
            </Typography>
            {starIcons.map((star) => (
              <StarBorderIcon
                className={star.color}
                key={"star" + star.id}
                onClick={() => starClickHandler(star.id)}
              />
            ))}

            <div className="margin-top-bottom-16">
              <Typography>
                <span className="bold-text">Artists:</span>
              </Typography>
            </div>

            <div className="padding-right">
              <GridList cellHeight={170} cols={2}>
                {movie.artists != null &&
                  movie.artists.map((artist) => (
                    <GridListTile
                      className="artist-details"
                      onClick={() => artistClickHandler(artist.wiki_url)}
                      key={artist.id}
                    >
                      <img
                        src={artist.profile_url}
                        alt={artist.first_name + " " + artist.last_name}
                      />
                      <GridListTileBar
                        title={artist.first_name + " " + artist.last_name}
                      />
                    </GridListTile>
                  ))}
              </GridList>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
