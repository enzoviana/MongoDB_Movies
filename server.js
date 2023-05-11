const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ejs = require('ejs');
const router = express.Router();


const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'cinema_db';

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) throw err;
        const db = client.db(dbName);
        const films = db.collection('films');

        films.find().toArray((err, result) => {
            if (err) throw err;
            res.render('films', { films: result });
            client.close();
        });
    });
});

app.get("/search", function(req, res) {
    var searchValue = req.query.search;
  
    // Connect to the MongoDB database
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      var db = client.db("cinema_db");
      var films = db.collection("films");
  
      // Search for films by title, year, director, or actors that match the search value
      films.find({
        $or: [
          { "titre": { $regex: searchValue, $options: "i" } },
          { "annee": { $regex: searchValue, $options: "i" } },
          { "realisateur": { $regex: searchValue, $options: "i" } },
          { "acteurs.nom": { $regex: searchValue, $options: "i" } }
        ]
      }).toArray(function(err, result) {
        // Render the search results using the films.ejs template
        res.render("films.ejs", { films: result });
  
        // Close the database connection
        client.close();
      });
    });
  });
  

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


    

