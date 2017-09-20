const express = require('express');
const path = require('path');

// Create our app
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/favicon.ico', express.static(path.join(__dirname, '[route/to/favicon]')));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log('Server is up on portt ' + PORT);
});
