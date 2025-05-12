import express from 'express';

const app  = express();
const PORT = process.env.PORT || 3000;
const AUTHOR = 'Robert Dajek';

app.use(express.static('public'))
  .listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT} — Autor: ${AUTHOR}`);
  });