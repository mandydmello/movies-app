import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  upcomingMoviesHeading: {
    textAlign: "center",
    background: "#ff9999",
    padding: "8px",
    fontSize: "1rem",
  },
  upcomingMoviesGrid: {
    flexWrap: "nowrap",
    width: "100%",
    transform: "translateZ(0)",
  },
  releasedMoviesGrid: {
    transform: "translateZ(0)",
  },
  title: {
    color: theme.palette.primary.light,
  },
});

const Home = (props) => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [releasedMovies, setReleasedMovies] = useState([]);
  const { classes } = props;

  useEffect(() => {
    //Fetch upcoming movies
    fetch(props.baseUrl + "movies?status=PUBLISHED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setUpcomingMovies(response.movies));

    //Fetch released movies
    fetch(props.baseUrl + "movies?status=RELEASED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setReleasedMovies(response.movies));
  }, []);

  return (
    <div>
      <Header baseUrl={props.baseUrl} />
      <div className={classes.upcomingMoviesHeading}>
        <span>Upcoming Movies</span>
      </div>
      <GridList
        className={classes.upcomingMoviesGrid}
        cellHeight={250}
        cols={6}
      >
        {upcomingMovies.map((movie) => (
          <GridListTile
            className="upcoming-movies-grid-item"
            key={"upcoming" + movie.id}
          >
            <img
              src={movie.poster_url}
              className="movies-poster"
              alt={movie.title}
            />
            <GridListTileBar title={movie.title} />
          </GridListTile>
        ))}
      </GridList>
      <div className="flex-container">
        <div>
          <GridList
            className={classes.releasedMoviesGrid}
            cellHeight={350}
            cols={4}
          >
            {releasedMovies.map((movie) => (
              <GridListTile
                onClick={() => props.history.push("/movie/" + movie.id)}
                className="released-movies-grid-item"
                key={"grid" + movie.id}
              >
                <img
                  src={movie.poster_url}
                  className="movies-poster"
                  alt={movie.title}
                />
                <GridListTileBar
                  title={movie.title}
                  subtitle={
                    <span>
                      Release Date:{" "}
                      {new Date(movie.release_date).toDateString()}
                    </span>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Home);
