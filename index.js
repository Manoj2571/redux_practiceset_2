const { initializeDatabase } = require('./db/db.connect')
const Movie = require('./models/movies.model')
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

initializeDatabase()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server is running on port", PORT)
})

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId)
    if(deletedMovie) {
      res.status(201).json({message: "Movie deleted successfully."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete movie."})
  }
})

app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body)
    res.status(201).json({message: "Movie added successfully.", movie: savedMovie})
  } catch (error) {res.status(500).json({error: "Failed to add movie."})}
})

app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies()
    if(movies.length != 0) {
      res.send(movies)
    } else {
      res.status(404).json({error: "Movies not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch movies.", errorMessage: error})
  }
})

app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovieById(req.params.movieId, req.body)
    if(updatedMovie) {
      res.status(201).json({message: "Movie updated successfully.", updatedMovie: updatedMovie})
    } else {
      res.status(404).json({error: "Movie not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update movie."})
  }
})

async function updateMovieById(movieId, dataToUpdate) {
  try {
    const updatedMovie = Movie.findByIdAndUpdate(movieId, dataToUpdate, {new: true})
    return updatedMovie
  } catch (error) {
    console.log(error)
  }
}

async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie)
    const saveMovie = await movie.save()
    return saveMovie
  } catch (error) {console.log(error)}
}

async function deleteMovie(movieId) {
  try {
    const deletedMovie = Movie.findByIdAndDelete(movieId)
    console.log(deletedMovie)
    return deletedMovie
  } catch (error) {
   console.log(error) 
  }
}

async function readAllMovies() {
  try {
    const movies = await Movie.find()
    return movies
  } catch(error) {
    console.log(error)
  }
}