var chai = require('chai'),
    expect = chai.expect,
    util = require('util'),
    fs = require('fs'),
    path = require('path'),
    main = require('../lib/main');

chai.should();
chai.use(require('chai-things'));

describe('mainSpec', function () {
    'use strict';
    var originalfixturePath = path.resolve(__dirname, './fixtures/full.json'),
        testFixtureFormat = './fixtures/full-%s.json',
        testFixturePath = path.resolve(__dirname,
            util.format(testFixtureFormat, (new Date()).getTime())),
        testJSON;
    
    before(function (done) {
        var rs = fs.createReadStream(originalfixturePath),
            ws = fs.createWriteStream(testFixturePath);
        
        rs.on('error', done);
        ws.on('error', done);
        
        rs.pipe(ws);
        
        ws.on('close', done);
    });
    
    beforeEach(function (done) {
        fs.readFile(testFixturePath, function (err, data) {
            if (err) {
                done(err);
            }
            
            testJSON = JSON.parse(data);
            done();
        });
    });
    
    after(function (done) {
        fs.unlink(testFixturePath, done);
    });
    
    describe('projectConnect', function () {
        it('should connect a project to a job using job id and project id', function () {
            main.projectConnect(testJSON, 511050062, 44);
            var i,
                position;
            
            for (i = 0; i < testJSON.positions.values.length; i++) {
                position = testJSON.positions.values[i];
                if (position.id === 511050062) {
                    expect(position.projects).to.be.an('Array');
                    expect(position.projects.length).to.equal(1);
                    expect(position.projects[0]).to.have.property('id')
                        .that.equals(44);
                }
            }
            
        });
        
        it('should connect a project to a job using company name and project name', function ()  {
            main.projectConnect(testJSON, 'Signiant', 'Barbie.com');
            var i,
                position;
            for (i = 0; i < testJSON.positions.values.length; i++) {
                position = testJSON.positions.values[i];
                if (position.company.name === 'Signiant') {
                    expect(position.projects).to.be.an('Array');
                    expect(position.projects.length).to.equal(1);
                    expect(position.projects[0]).to.have.property('name')
                        .that.equals('Barbie.com');
                }
            }
        });
        
        it('should be able to add multiple projects to a job', function () {
            var i,
                position;
            main.projectConnect(testJSON, 'Signiant', 'Barbie.com');
            main.projectConnect(testJSON, 'Signiant', 'Share Barney Hugs');

            for (i = 0; i < testJSON.positions.values.length; i++) {
                position = testJSON.positions.values[i];
                if (position.company.name === 'Signiant') {
                    expect(position.projects).to.be.an('Array');
                    expect(position.projects.length).to.equal(2);
                    position.projects.should.all.have.property('name');
                    position.projects.should.contain.a.thing.with.property('name', 'Barbie.com');
                    position.projects.should.contain.a.thing.with.property('name',
                        'Share Barney Hugs');
                }
            }
        });
        
        it('should allow you to specify a start date for a project', function () {
            main.projectConnect(testJSON, 511050062, 44, {
                startDate: {
                    month: 3,
                    year: 2013
                }
            });
            var i,
                position;

            for (i = 0; i < testJSON.positions.values.length; i++) {
                position = testJSON.positions.values[i];
                if (position.id === 511050062) {
                    expect(position.projects[0]).to.have.property('startDate');
                    expect(position.projects[0].startDate).to.have.property('month')
                        .that.equals(3);
                    expect(position.projects[0].startDate).to.have.property('year')
                        .that.equals(2013);
                }
            }
        });
        
        it('should allow you to specific a start and end date for a project', function () {
            main.projectConnect(testJSON, 511050062, 44, {
                startDate: {
                    month: 3,
                    year: 2013
                },
                endDate: {
                    month: 12,
                    year: 2013
                }
            });
            var i,
                position;

            for (i = 0; i < testJSON.positions.values.length; i++) {
                position = testJSON.positions.values[i];
                if (position.id === 511050062) {
                    expect(position.projects[0]).to.have.property('startDate');
                    expect(position.projects[0]).to.have.property('endDate');
                    expect(position.projects[0].startDate).to.have.property('month')
                        .that.equals(3);
                    expect(position.projects[0].startDate).to.have.property('year')
                        .that.equals(2013);
                    expect(position.projects[0].endDate).to.have.property('month')
                        .that.equals(12);
                    expect(position.projects[0].endDate).to.have.property('year')
                        .that.equals(2013);
                }
            }
        });
    });
});