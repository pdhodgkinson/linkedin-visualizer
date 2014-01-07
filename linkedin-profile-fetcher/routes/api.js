/**
 * Created by peter on 26/09/13.
 */
var db = require('../db'),
    linkedinAPI = require('../linkedin_oauth/api');

exports.people = function (req, res) {
    'use strict';
    console.log(req.query);
    req.linkedInOAuth.api.people(req.query.query, function (data) {
        db.savePeople(JSON.parse(data));
        res.send(data);
    });
};

/*
 Fetch everything about a person
 */
exports.full = function (req, res) {
    'use strict';
    req.linkedInOAuth.api.people(linkedinAPI.apis.people.fields.join(), function (data) {
        var peopleData = data;
        if (typeof peopleData !== 'undefined' &&
            typeof peopleData.positions !== 'undefined' &&
            peopleData.positions.values !== 'undefined' &&
            peopleData.positions.values.length > 0) {

            //parse positions
            for (var i = 0; i < peopleData.positions.values.length; i++) {
                var position = peopleData.positions.values[i];
                if (typeof position.company !== 'undefined' &&
                    typeof position.company.id !== 'undefined') {
                    //fetch supplimentary company data
                    req.linkedInOAuth.api.company(position.company.id, linkedinAPI.apis.company.fields.join(),
                        function (data) {

                        });
                }
            }
        }

        res.send(data);
    });
};