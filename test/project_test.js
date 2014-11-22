//JSlint configuration flags and globals
/*jslint node: true, devel: true, sloppy:true, unparam: true, nomen: true */
/*global _: true, __dirname: true, describe: false, it: false*/

var path = require('path'),
    app = require(path.resolve('..') + '/project.js'),
    should = require('should'),
    http = require('http');

// Generic function to handle the routes of the application (Mohamed, Blandine)
function url_properties(method, uri) {
    var properties = {
        'host': 'localhost',
        'port': 3000,
        'path': uri,
        'method': method
    };
    return properties;
}

// One simple test suite is made for testing the project
describe('Questions and Answers service tests', function () {

    it('should be running the service', function (done) {
        should.exist(app);
        done();
    });

    it('should not update a non existing question', function (done) { // (Blandine)
        var url = url_properties('PUT', '/questions/1');
        http.get(url, function (res) {
            res.statusCode.should.eql(404);
            res.on('question_err', function (body) {
                body.should.eql("The question to update could not be found \n");
            });
            done();
        });
    });

    it('should not request the comments of a question as the question is not created', function (done) { // (Mohamed)
        var url = url_properties('GET', '/questions/1/comments/');

        http.get(url, function (res) {
            res.statusCode.should.eql(404);
            res.statusCode.should.not.equal(200);
            res.on('question_err', function (body) {
                body.should.eql("Question not found");
            });
            done();
        });
    });
});
