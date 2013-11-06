var db = require('../db');


exports.details = function (req, res) {
  "use strict";
  var id = req.params.id;
  db.getCompany(id, function (err, data) {
    if (err === null && data === null) {
      //fetch from api

      //TODO: make api.company.alldetails query layer
      var query = "id,name,universal-name,email-domains,company-type,ticker,website-url," +
        "industries,status,logo-url,square-logo-url,blog-rss-url,twitter-id,employee-count-range,specialties," +
        "locations,description,stock-exchange,founded-year,end-year,num-followers";
      req.linkedInOAuth.api.company(id, query, function (data) {
        //db.storeCompany(data);
        res.send(data);
      });
    } else {
      res.send(data);
    }
  });
};
