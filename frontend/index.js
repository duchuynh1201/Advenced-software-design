const express = require('express');
const { create } = require('express-handlebars');

const app = express();
const port = 4000;
const path = require('path');
const hbs = create({
  partialsDir: [path.join(__dirname, './views/partials')],
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './assets')));
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/v1';
const GG_CLIENT_ID = process.env.GG_CLIENT_ID || '669935704831-l3b2tmvde6esb62gulin3eusrj32mqca.apps.googleusercontent.com';

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    BACKEND_URL,
    GG_CLIENT_ID,
  });
});

app.get('/list', (req, res) => {
  res.render('list', {
    title: 'List of buses',
    BACKEND_URL,
  });
});

app.get('/fill-form/:busId', async (req, res) => {
  res.render('fill-form', {
    title: 'Fill form',
    BACKEND_URL,
  });
});

app.get('/history', (req, res) => {
  res.render('history', {
    title: 'History',
    BACKEND_URL,
  });
});

app.get('/loginWithGoogle', (req, res) => { 
  res.render('loginWithGoogle', {
    title: 'Login',
    BACKEND_URL,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
