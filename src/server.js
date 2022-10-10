const express = require('express');
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');



let nextVisitorId = 1;
// The main page of our website
app.get('/', (req, res) => {
  let hasVisited = false;
  let visitorId = nextVisitorId;
  if (req.cookies['visited']) {
    hasVisited = true;
    visitorId = req.cookies['visitorId'];
  }
  else{
    visitorId++;
    hasVisited = false;
  }

  res.cookie('visitorId', visitorId);
  res.cookie('visited', Date.now().toString());
  
  res.render('welcome', {
    name: req.query.name || "World",
    datetime_now: new Date().toLocaleString(),
    visitorID: visitorId,
    lastvisit: Math.round(((new Date() - req.cookies['visited'])/1000)).toLocaleString(),
    hasVisited: hasVisited,
  },console.log(req.cookies));

});

app.listen(port);

console.log("Server Started!");
