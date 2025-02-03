import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import { useLocalStorage } from "./useLocalStorage";
import useMovie from "./useMovie";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [watched, setWatched] = useLocalStorage([], "watched");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { isLoading, errorMessage, movies } = useMovie(query);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleDeleteWatched(id) {
    setWatched((e) => e.filter((e) => e.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <SearchedResultsNum movies={movies} />
      </Navbar>
      <Main>
        <Box1>
          {isLoading && <p className="loader">Loading...</p>}
          {!isLoading && !errorMessage && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {errorMessage && <p className="error">❌ {errorMessage}</p>}
        </Box1>
        <Box2>
          {selectedId ? (
            <MovieDetails
              id={selectedId}
              handleCloseMovie={handleCloseMovie}
              setWatched={setWatched}
              watched={watched}
            />
          ) : (
            <WatchList
              watched={watched}
              handleDeleteWatched={handleDeleteWatched}
            />
          )}
        </Box2>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Watch Online</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputEL = useRef(null);
  useKey("Enter", function () {
    if (document.activeElement === inputEL.current) return;
    inputEL.current.focus();
    setQuery("");
  });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEL}
    />
  );
}
function SearchedResultsNum({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box1({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box1 invisible-scrollbar">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function Box2({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box2 invisible-scrollbar">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => handleSelectMovie(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MovieDetails({ id, handleCloseMovie, setWatched, watched }) {
  const [movieDetails, setMovieDetails] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  const decisionCount = useRef(0);
  useEffect(
    function () {
      if (userRating) {
        decisionCount.current++;
      }
    },
    [userRating]
  );

  function handleWatched() {
    const movie = {
      Poster: movieDetails.Poster,
      imdbID: movieDetails.imdbID,
      Title: movieDetails.Title,
      imdbRating: Number(movieDetails.imdbRating),
      Runtime: Number(movieDetails.Runtime.split(" ").at(0)),
      UserRating: userRating,
      decisionCount: decisionCount.current,
    };

    setWatched((e) => [...e, movie]);
    setIsRated(true);
    decisionCount.current = 0;
  }

  useKey("Escape", handleCloseMovie);

  useEffect(
    function () {
      async function fetchMovieDetails() {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=4a3b711b&i=${id}`
        );
        const data = await res.json();
        setMovieDetails(data);
        document.title = `${data.Title} | Watch Online`;
        if (watched.find((i) => i.imdbID === id)) {
          setIsRated(true);
          return;
        }
        setIsRated(false);
      }
      fetchMovieDetails();
      return () => {
        document.title = "Watch Online";
      };
    },
    [id, watched]
  );

  return (
    <div>
      <div className="details">
        <header>
          <button className="btn-back" onClick={handleCloseMovie}>
            &larr;
          </button>
          <img src={movieDetails.Poster} alt={`${movieDetails.Title} poster`} />
          <div className="details-overview">
            <h2>{movieDetails.Title}</h2>
            <p>
              {movieDetails.Released} &larr; {movieDetails.Runtime}
            </p>
            <p>{movieDetails.Genre}</p>
            <p>
              <span>⭐️</span> {movieDetails.imdbRating} IMDb rating
            </p>
          </div>
        </header>
        <section>
          <div className="rating">
            {!isRated ? (
              <>
                <StarRating
                  size={24}
                  maxStars={10}
                  fontSize={24}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleWatched}>
                    + Add to list
                  </button>
                )}
              </>
            ) : (
              <p>
                You rated this movie{" "}
                {watched.find((i) => i.imdbID === id)?.UserRating}
              </p>
            )}
          </div>
          <p>{movieDetails.Plot}</p>
          <p>Starring {movieDetails.Actors}</p>
          <p>Directed by {movieDetails.Director}</p>
        </section>
      </div>
    </div>
  );
}

function WatchList({ watched, handleDeleteWatched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.UserRating)
  ).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.Runtime)).toFixed(2);
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>

      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.UserRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.Runtime} min</span>
              </p>
              <button
                className="btn-delete"
                onClick={() => handleDeleteWatched(movie.imdbID)}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
