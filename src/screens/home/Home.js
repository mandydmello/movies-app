import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240,
  },
  title: {
    color: theme.palette.primary.light,
  },
});

const Home = (props) => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [releasedMovies, setReleasedMovies] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");
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

    //Fetch genres
    fetch(props.baseUrl + "genres", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setGenreList(response.genres));

    //Fetch artists
    fetch(props.baseUrl + "artists?page=1&limit=15", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setArtistList(response.artists));
  }, []);

  const applyFilterHandler = () => {
    let initialQueryString = "?status=RELEASED";

    if (movieName !== "") {
      initialQueryString += "&title=" + movieName;
    }
    if (genres.length > 0) {
      initialQueryString += "&genres=" + genres.toString();
    }
    if (artists.length > 0) {
      initialQueryString += "&artists=" + artists.toString();
    }
    if (releaseDateStart !== "") {
      initialQueryString += "&start_date=" + releaseDateStart;
    }
    if (releaseDateEnd !== "") {
      initialQueryString += "&end_date=" + releaseDateEnd;
    }

    fetch(props.baseUrl + "movies" + encodeURI(initialQueryString), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setReleasedMovies(response.movies);
      });
  };

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
        <div className="left-side-homepage">
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
        <div className="right-side-homepage">
          <Card>
            <CardContent>
              <FormControl className={classes.formControl}>
                <Typography className={classes.title} color="textSecondary">
                  FIND MOVIES BY:
                </Typography>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                <Input
                  id="movieName"
                  onChange={(e) => setMovieName(e.target.value)}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-checkbox">
                  Genres
                </InputLabel>
                <Select
                  multiple
                  input={<Input id="select-multiple-checkbox-genre" />}
                  renderValue={(selected) => selected.join(",")}
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                >
                  {genreList.map((genre) => (
                    <MenuItem key={genre.id} value={genre.genre}>
                      <Checkbox checked={genres.indexOf(genre.genre) > -1} />
                      <ListItemText primary={genre.genre} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-checkbox">
                  Artists
                </InputLabel>
                <Select
                  multiple
                  input={<Input id="select-multiple-checkbox" />}
                  renderValue={(selected) => selected.join(",")}
                  value={artists}
                  onChange={(e) => setArtists(e.target.value)}
                >
                  {artistList.map((artist) => (
                    <MenuItem
                      key={artist.id}
                      value={artist.first_name + " " + artist.last_name}
                    >
                      <Checkbox
                        checked={
                          artists.indexOf(
                            artist.first_name + " " + artist.last_name
                          ) > -1
                        }
                      />
                      <ListItemText
                        primary={artist.first_name + " " + artist.last_name}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  id="releaseDateStart"
                  label="Release Date Start"
                  type="date"
                  defaultValue=""
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setReleaseDateStart(e.target.value)}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  id="releaseDateEnd"
                  label="Release Date End"
                  type="date"
                  defaultValue=""
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setReleaseDateEnd(e.target.value)}
                />
              </FormControl>
              <br />
              <br />
              <FormControl className={classes.formControl}>
                <Button
                  onClick={() => applyFilterHandler()}
                  variant="contained"
                  color="primary"
                >
                  APPLY
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Home);
