/**
 * Created by peter on 26/09/13.
 */
var db = require('../db');

exports.people = function(req, res) {
    console.log(req.query);
    req.linkedInOAuth.api.people(req.query.query, function(data) {
      db.savePeople(JSON.parse(data));
       res.send(data);
    });

}