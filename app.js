
require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
     //homepage
     res.render('index');
 })

app.get('/artist-search', (req, res) => {
  //req.query.artist-search
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let result = data.body.artists.items;
      res.render('artist-search-result', {result});
      console.log(result);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    //console.log(req.query)
    //res.render('artist-search');
  })

app.get("/albums/:artistId", (req, res) => {
    console.log(req.params)
    //res.render("albums")
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(albums => {
            console.log('The received data from the API: ', albums.body.items)
            let resultAlbums = albums.body.items;
            res.render("albums", { resultAlbums });
            console.log(resultAlbums);
        })
        .catch(err => console.log('Error on artistId: ', err)); 
  })

  app.get("/tracks/:albumId", (req, res) => {
    //console.log(req.params)
    //res.render("tracks")
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(tracks => {
            console.log('The received data from the API: ', tracks.body.items);
            let resultTracks = tracks.body.items;
            res.render("tracks", {resultTracks});
            console.log(resultTracks);
        })
        .catch(err => console.log('Error on albumId: ', err)); 
  })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));