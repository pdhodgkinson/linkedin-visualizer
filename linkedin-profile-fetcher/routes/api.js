/**
 * Created by peter on 26/09/13.
 */
var db = require('../db'),
    async = require('async'),
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
    var linkedInPeopleAPI = function(cb) {
            //get data from linked in
            req.linkedInOAuth.api.people(linkedinAPI.apis.people.fields.join(), function (data) {
                var peopleData = typeof data !== 'undefined' ? JSON.parse(data) : {},
                    parsePosition = function (position, callback) {
                        if (typeof position.company !== 'undefined' &&
                            typeof position.company.id !== 'undefined') {
                            req.linkedInOAuth.api.company(position.company.id, linkedinAPI.apis.companies.fields.join(),
                                function (data) {
                                    var companyData = JSON.parse(data);
                                    position.company = companyData;
                                    callback(null, position);
                                });
                        } else {
                            callback(null, position);
                        }
                    };

                if (typeof peopleData !== 'undefined' &&
                    typeof peopleData.positions !== 'undefined' &&
                    peopleData.positions.values !== 'undefined' &&
                    peopleData.positions.values.length > 0) {

                    //parse positions
                    async.map(peopleData.positions.values, parsePosition, function (err, results) {
                        peopleData.positions.values = results;
                        cb(peopleData);
                    });
                } else {
                    cb(peopleData);
                }
            });
        },
        fetchFromLinkedIn = function(cb) {
                //fetch from api
            linkedInPeopleAPI(function(data) {
                //store data in DB
                db.saveFull(data);
                //return response
                cb(data);
            });
        },
        linkedInFetchWrapper = function() {
            fetchFromLinkedIn(function(data) {
                //return to front end
                res.send(data);
            });
        },
        clear = req.query.clear;

    console.log(clear);

    if(clear === true || clear === "true") {
        linkedInFetchWrapper();
    } else {
        //try to fetch from DB
        db.fetchFull(req.session.linkedInId, function (err, data) {
            if (data === null) {
                //fetch from linked in
                linkedInFetchWrapper();
            } else {
                res.send(data);
            }
        })
    }

};