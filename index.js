const bodyParser = require("body-parser"); 
const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();

// Parse data from POST requests
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

// Allow cross origin access for remote testing
app.use(cors({ optionsSuccessStatus: 200 }));

app.use("/", express.static(__dirname));
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

let UserModel = require('./database');

app.post("/api/users", (req, res) => {
  let newUser = new UserModel({
    username: req.body.username
  });

  newUser.save()
    .then(doc => {
      let resObj = { "username": doc.username, "_id": doc._id }
      console.log('new user entry:');
      console.log(resObj);
      console.log();
      res.json(resObj);
    })
    .catch(err => {
      console.error(err);
    });

});

app.post("/api/users/:_id/exercises", (req, res) => {
  let dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  let dateEntry = !dateRegex.test(req.body.date) ? new Date() : new Date(req.body.date + 'T00:00:00');
  let exLogEntry = {
    "description": req.body.description,
    "duration": +req.body.duration,
    "date": dateEntry.toDateString()
  };
  console.log('new exlog entry:')
  console.log(`date entered: ${req.body.date}`)
  console.log(exLogEntry);
  console.log(`user_id: ${req.params._id} ------------`);

  UserModel.findById(req.params._id, (err, user) => {
    if (err) return console.error(err);
    user.exLog.push(exLogEntry);
    user.save((err, updatedUser) => {
      if (err) return console.error(err);
      let recentEntry = updatedUser.exLog[updatedUser.exLog.length - 1];
      let resObj = {
        "_id": updatedUser._id,
        "username": updatedUser.username,
        "date": recentEntry.date,
        "duration": recentEntry.duration,
        "description": recentEntry.description
      }

      console.log('new entry summary:');
      console.log(resObj);
      console.log();

      res.json(resObj);
    });  
  });
  
});

app.get("/api/users", (req, res) => {

  UserModel.find()
    .select("username _id")
    .exec((err, users) => {
      if (err) return console.error(err);
      res.json(users);
      console.log('fulfilled GET all users');
      console.log();
    });
  
});

app.get("/api/users/:_id/logs", (req, res) => {
  console.log(`from: ${req.query.from}`);
  console.log(`to: ${req.query.to}`);
  console.log(`limit: ${/^[\d]+$/.test(req.query.limit)}`);

  let dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  let limitRegex = /^[\d]+$/;
  let fromDate = dateRegex.test(req.query.from) ? new Date(req.query.from + "T00:00:00") : new Date("1900-01-01T00:00:00");
  let toDate = dateRegex.test(req.query.to) ? new Date(req.query.to + "T00:00:00") : new Date("2500-01-01T00:00:00");
  
  UserModel.findById(req.params._id, (err, user) => {
    if (err) return console.error(err);
    let logLen = user.exLog.length;
    let logLimit = limitRegex.test(req.query.limit) ? Math.min(+req.query.limit, logLen) : logLen;
    
    let logArr = [];
    
    for (let el of user.exLog) {
      if (logArr.length < logLimit) {
        let exDate = new Date(el.date);
        if (exDate >= fromDate && exDate <= toDate) {
          logArr.push({
            "description": el.description,
            "duration": el.duration,
            "date": el.date
          });
        }
      }
    }

    let resObj = {
      "_id": user._id,
      "username": user.username,
      "count": logArr.length,
      "log": logArr
    };

    res.json(resObj);
    console.log('fulfilled GET user logs');
    console.log();
  });
  
});


// listen for requests :)
const port = process.env.PORT || 3000;
 app.listen(port, function() {
  console.log(`Your app is listening on port ${port} ...`);
});