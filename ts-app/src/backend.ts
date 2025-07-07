//import express from 'express';
//import cors from 'cors';

const express = require('express')
const cors = require('cors')
const app = express();
const port = 8080;
// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('7');
});

app.post('/', (req, res) => {
    res.send('8')
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});