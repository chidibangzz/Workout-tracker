const express = require("express");
const mongoose = require("mongoose");

const db = require("./models");

const path = require("path")

const PORT = process.env.PORT || 3001

const app = express();

app.use(express.urlencoded({
   extended: true
}));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/", {
   useNewUrlParser: true,
   useFindAndModify: false
});

//routes
app.get("/stats", (req, res) => {
   res.sendFile(path.join(__dirname, "public/stats.html"))
})
app.get("/exercise", (req, res) => {
   res.sendFile(path.join(__dirname, "public/exercise.html"))
})

app.get("/api/workouts", (req, res) => {
   db.Workout.aggregate([{
      $addFields: {
         totalDuration: {
            $sum: "$exercises.duration"
         }
      }
   }]).then(function (data) {
      res.json(data)
   })
});

app.post("/api/workouts", (req, res) => {
   db.Workout.create({}).then(function (data) {
      res.json(data)
   }).catch(error => res.json(error));
});

app.put("/api/workouts/:id", (req, res) => {
   db.Workout.findByIdAndUpdate(req.params.id, {
      $push: {
         exercises: req.body
      }
   }).then(function (data) {
      res.json(data)
   })
});

app.get("/api/workouts/range", (req, res) => {
   db.Workout.find({}).then(function (data) {
      res.json(data)
   })
});

app.listen(PORT, () => {
   console.log(`App running on port ${PORT}!`)
});