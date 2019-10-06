'use static';

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

// Use express to serve files (webserver)
app.use('/', express.static('src'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started, Listening on port ${PORT}`);
});

//API functions

//Server Functions
