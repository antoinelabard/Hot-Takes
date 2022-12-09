const express = require('express');
require('dotenv').config()
const app = express();

const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://antoinelabard:${process.env.MONGO_PASSWORD}@cluster0.bh7ggjl.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to Mongoose successful'))
  .catch(() => console.log('Connection to Mongoose failed'));

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
 });

module.exports = app;
