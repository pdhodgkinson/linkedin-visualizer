var db = require('../db');

/*
 * GET users listing.
 */

exports.list = function (req, res) {
  "use strict";
  res.send("respond with a resource");
};

exports.index = function (req, res) {
  "use strict";
  res.render('user', {title: 'User'});
};

exports.detail = function (req, res) {
  "use strict";
  if (typeof req.session.linkedInId === 'undefined') {
    console.log("Expection linked in Id in session");
    res.end();
  } else {
    //try to get from db
    db.getPeople(req.session.linkedInId, function (err, data) {
      console.log(data);
      res.send(data);
    });
  }
};