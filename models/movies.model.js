const mongoose = require("mongoose");

const moviesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: [
      {
        type: String,
        enum: [
          "Action",
          "Drama",
          "Romance",
          "Thriller",
          "Comedy",
          "Fantasy",
          "Sci-Fi",
          "Horror",
          "Sports",
          "Musical",
          "Other",
        ],
      },
    ],
    director: {
      type: String,
      required: true,
    }
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
