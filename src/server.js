const express = require('express');
const fetch = require('node-fetch');

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

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
    return;
  }

  // respond to the browser
  // TODO: make proper html
  // res.send(JSON.stringify(content, 2));

  const Triviaresults = content.results[0]
  console.log(Triviaresults)
  var AnswersList = []
  AnswersList.push(Triviaresults.correct_answer);
  IncorrectAnswers = AnswersList.concat(Triviaresults.incorrect_answers);

  let shuffled = IncorrectAnswers
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

  const answerAlert = shuffled.map(answer => {
    return `<a href="javascript:alert('${
      answer === Triviaresults.correct_answer ? 'Correct answer' : 'Incorrect answer'
    }')">${answer}</a>`
  })

  res.render('trivia', {
        question: Triviaresults.question,
        category: Triviaresults.category,
        difficulty: Triviaresults.difficulty,
        answers: answerAlert
    })
});

app.listen(port);

console.log("Server Started!");
