/**************************** Questions and Answers RESTful service *************************************/

// JSlint configuration flags and globals
/*jslint node: true, devel: true, sloppy:true, unparam: true, nomen: true*/
/*global __dirname: true*/

var express = require('express'),
    orm = require('orm');

var app = express();

// Global Application Configuration
app.configure(function () {
    // bodyParser is a middleware to deal with HTML multipart
    app.use(express.bodyParser());

    // For DELETE and PUT HTTP methods
    app.use(express.methodOverride());

    // setting a customized content type for all the responses
    app.use(function (req, res, next) {
        res.contentType('application/vnd.questions.answers.comments+json');
        next();
    });

    //sets the port which the app will use
    app.set('port', process.env.PORT || 3000);
});

app.listen(app.get('port'), function () {
    console.log('Questions and answers webservice started..');
});

/**************************************** Models creation ********************************/
app.use(orm.express("sqlite://db_file.sqlite3", {

    define: function (db, models, next) {

    /********************* Question model *****************/
        models.question = db.define('question', {
            title: {type: "text", size: 100, required: true},
            body: {type: "text", big: true, required: true}
        },
            {
                validations: {
                    title: [
                        orm.enforce.notEmptyString(["Question title can not be empty, must have at least 1 character."]),
                        orm.enforce.ranges.length(1, 100, "Question title can not be longer than 100 characters.")
                    ],
                    body: [
                        orm.enforce.notEmptyString(["Question body can not be empty, must have at least 1 character."]),
                        orm.enforce.ranges.length(1, 500,
                            "Question body can not be that long(too many characters).")
                    ]
                }
            }
            );

    /********************* Answer model *****************/
        models.answer = db.define('answer', {
            body: {type: "text", big: true, required: true}
        },
              {
                validations: {
                    body: [
                        orm.enforce.notEmptyString(["Answer content (body)  can not be empty, must have at least 1 character."]),
                        orm.enforce.ranges.length(1, 500,
                            "Answer content (body) can not be that long(too many characters).")
                    ]
                }
            });

        models.answer.hasOne(
            'question',
            models.question,
            {reverse: 'answers'}
        );

    /********************* Comment model *****************/
        models.comment = db.define('comment', {
            body: {type: "text", big: true, required: true}
        },
            {
                validations: {
                    body: [
                        orm.enforce.notEmptyString(["Comment content (body)  can not be empty, must have at least 1 character."]),
                        orm.enforce.ranges.length(1, 500,
                            "Comment content (body) can not be that long(too many characters).")
                    ]
                }
            });

        models.comment.hasOne(
            'question',
            models.question,
            {reverse: 'comments'}
        );
        models.comment.hasOne(
            'answer',
            models.answer,
            {reverse: 'comments'}
        );

    /*
      Creates the models previously defined into the database
      with all the attributes and the associations.
    */
        db.sync(function (err) {
            console.log('Models are created in database');
        });
        next();
    }
}));

/******************************** Questions routes ********************************/

/***************
* HTTP verb :GET
* URL: /questions
* Request Parameters: none
* Description: get all questions in the database
*******************/

app.get('/questions', function (req, res) {
    req.models.question.count(function (err, questions_count) {
        console.log(questions_count + ' questions');
    });
    req.models.question.find(
        {},
        {},
        function (err, questions) {
            if (err === null) {
                res.status(200).send(JSON.stringify(questions, undefined, 2) + "\n");
            } else {
                res.status(404).send('There is no question');
            }
        }
    );
});


/***************
* HTTP verb : POST
* URL: /questions
* Request Parameters: title & body
* Description: Creation of a new question
*******************/

app.post('/questions', function (req, res) {
    req.models.question.create(
        [{
            title: req.body.title,
            body: req.body.body
        }], // a question shall have a title and a body
        function (question_err, question_created) {
            if (question_err === null) {
                res.status(201).send(JSON.stringify(question_created, undefined, 2) + "\n");
            } else {
                res.status(400).send('Question was not created due to missing information ' + question_err + "\n");
            }
        }
    );
});


/***************
* HTTP verb : HEAD
* URL: /questions
* Request Parameters: none
* Description: sends only the header of the resource defined by the list of all the questions
*******************/

app.head('/questions', function (req, res) {
    req.models.question.count(function (err, questions_count) {
        console.log(questions_count + ' questions');
    });
    req.models.question.find(
        {},
        {},
        function (err, questions) {
            if (err === null) {
                res.status(200);
                res.end();
            } else {
                res.status(404);
                res.end();
            }
        }
    );
});

/***************
* HTTP verb : DELETE
* URL: /questions
* Request Parameters: none
* Description: Deletion of all questions shall not work. I shall send an error message.
*******************/

app.del('/questions', function (req, res) {
    res.status(405);
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST');
    res.end('All questions cannot be deleted at the same time. Please delete the questions one by one.\n');
});


/***************
* HTTP verb : PUT
* URL: /questions
* Request Parameters: none
* Description: Update of all questions shall not work. I shall send an error message.
*******************/

app.put('/questions', function (req, res) {
    res.status(405);
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST');
    res.end('All questions cannot be updated at the same time. Please update the questions one by one.\n');
});

/***************
* HTTP verb : GET
* URL: /questions/:question_id
* Request Parameters: none
* Description: get a specific question by its Id.
*******************/

app.get('/questions/:question_id', function (req, res) {
    req.models.question.get(req.params.question_id, function (question_err, question) {
        if (question_err === null) {
            res.status(200).send(JSON.stringify(question, undefined, 2) + "\n");
        } else {
            res.status(404).send('Question Not found \n');
        }
    });
});

/***************
* HTTP verb : HEAD
* URL: /questions/:question_id
* Request Parameters: none
* Description: get the header of a request for a specific question by its Id.
*******************/

app.head('/questions/:question_id', function (req, res) {
    req.models.question.get(req.params.question_id, function (question_err, question) {
        if (question_err === null) {
            res.status(200);
            res.end();
        } else {
            res.status(404);
            res.end();
        }
    });
});

/***************
* HTTP verb : PUT
* URL: /questions/:question_id
* Request Parameters: title & body
* Description: Updates a specific question
*******************/

app.put('/questions/:question_id', function (req, res) {
    req.models.question.get(req.params.question_id, function (err, question) { // get the question
        if (err === null) {
            question.save( // save the changes
                {
                    title: req.body.title,
                    body: req.body.body
                }, //
                function (question_err, question_updated) {
                    if (question_err === null) {
                        res.status(200).send(JSON.stringify(question_updated, undefined, 2) + "\n");
                    } else {
                        res.status(400).send("The question could not be updated because : " + JSON.stringify(question_err) + '\n'); // the question could not be updated
                    }
                }
            );
        } else {
            res.status(404).send('The question to update could not be found \n'); // error during the get
        }


    });
});


/***************
* Function that prints the error during the deletion of a comment
*******************/
var error_comment_delete_function =  function (error_comment_delete) {
        if (error_comment_delete !== null) {
            console.log("Error deleting a comment of this question" + error_comment_delete);
        }
    };
/***************
* Function that prints the error during the deletion of a comment
*******************/
var error_answer_delete_function =  function (error_answer_delete, error_comment_delete) {
        if (error_comment_delete !== null) {
            console.log("Error deleting a comment of the answer to that question" + error_comment_delete);
        } else if (error_answer_delete !== null) {
            console.log("Error deleting the answer to that question" + error_answer_delete);
        }
    };

/***************
* Function that deletes an answer and its comments
*******************/
var delete_answer = function (answer_to_delete, error_delete_answer, error_comments_delete, callback) {
        answer_to_delete.getComments(function (error_comments_delete, comment_list) {
            var i;
            if (error_comments_delete === null) {
                for (i = comment_list.length - 1; i >= 0; i -= 1) {
                    comment_list[i].remove(error_comment_delete_function);
                }
            } else {
                console.log("Error deleting comments of this answer" + error_comments_delete);
            }
        });
        answer_to_delete.remove(function (error_delete) { error_delete_answer = error_delete; });
    };

/***************
* HTTP verb : DELETE
* URL: /questions/:question_id
* Request Parameters: none
* Description: Deletes a specific question
*******************/

app.del('/questions/:question_id', function (req, res) {
    req.models.question.get(req.params.question_id, function (question_err, question_to_delete) {

        if (question_err === null) {
            question_to_delete.getComments(function (error_comments_delete, comment_list) {
                var i;
                if (error_comments_delete === null) {
                    for (i = comment_list.length - 1; i >= 0; i -= 1) {
                        comment_list[i].remove(error_comment_delete_function);
                    }
                } else {
                    console.log("Error deleting comments of this question" + error_comments_delete);
                    res.status(500).send("An error occurred during the deletion of the comments of the question returning the error : " + JSON.stringify(error_comments_delete) + '\n');
                }
            });
            question_to_delete.getAnswers(function (error_get_answer_delete, answer_list) {
                var i, error_delete_answer, error_comments_delete;
                console.log(error_get_answer_delete);
                if (error_get_answer_delete === null) {
                    for (i = answer_list.length - 1; i >= 0; i -= 1) {
                        error_delete_answer = null;
                        error_comments_delete = null;
                        delete_answer(answer_list[i], error_delete_answer, error_comments_delete, error_answer_delete_function(error_delete_answer, error_comments_delete));
                    }
                } else {
                    console.log("Error deleting answers of this question" + error_get_answer_delete);
                    res.status(500).send("An error occurred during the deletion of the answers of the question returning the error : " + JSON.stringify(error_get_answer_delete) + '\n');
                }
            });
            question_to_delete.remove(function (error_delete) {
                if (error_delete === null) {
                    res.status(204).end();
                } else {
                    res.status(500).send("An error occurred during the deletion of the question returning the error : " + JSON.stringify(question_err) + '\n');
                    // error during the deletion of the question
                }
            });
        } else {
            res.status(404).send("The question to delete could not be found \n"); // error during the get, there is no question with that particular Id
        }
    });
});

/******************************** Answers routes *******************************************/
/***************
* HTTP verb : GET
* URL: /questions/:question_id/answers
* Request Parameters: none
* Description: GET all answers
*******************/
app.get('/questions/:question_id/answers', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.answer.find(
                    {'question': req.params.question_id},
                    function (err, answers) {
                        req.models.answer.count(function (err, answer_count) {
                            console.log(answer_count + ' answers');
                        });
                        if (err === null) {
                            res.status(200).send(JSON.stringify(answers, undefined, 2) + "\n");

                        } else {
                            res.status(404).send('Answers not found \n');
                        }
                    }
                );
            } else {
                res.status(404).send('cannot find Question \n');
            }
        }
    );
});

/***************
* HTTP verb : GET
* URL: /questions/:question_id/answers/:answer_id
* Request Parameters: none
* Description: GET one answers
*******************/
app.get('/questions/:question_id/answers/:answer_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.answer.find(
                    {'question_id': req.params.question_id,
                        'id': req.params.answer_id},
                    function (answer_err, answer) {
                        if (answer_err === null) {
                            res.status(200).send(JSON.stringify(answer, undefined, 2) + "\n");
                        } else {
                            res.status(404).send('Answer for this Question not found. \n');
                        }
                    }
                );
            } else {
                res.status(404).send('Question is not found \n');
            }
        }
    );
});
/***************
* HTTP verb : POST
* URL: /questions/:question_id/answers
* Request Parameters: none
* Description: POST an answer
*******************/
app.post('/questions/:question_id/answers', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.answer.create(
                    [{
                        body: req.body.body
                    }],
                    function (answer_err, answer_list) {
                        if (answer_err === null) {
                            var answer = answer_list[0];
                            answer.setQuestion(question, function (question_to_answer_err) {
                                if (question_to_answer_err === null) {
                                    res.status(201).send(JSON.stringify(answer, undefined, 2) + "\n");
                                } else {
                                    res.status(404).send('Answer not found' + "\n");
                                }
                            });
                        } else {
                            res.status(400).send('cannot insert Answer' + answer_err + "\n");
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});


/***************
* HTTP verb : PUT
* URL: /questions/:question_id/answers/:answer_id
* Request Parameters: none
* Description: PUT an answer
*******************/

app.put('/questions/:question_id/answers/:answer_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {

                req.models.answer.get(req.params.answer_id, function (err, answer) { // get the answer
                    if (err === null) {
                        answer.save( // save the changes
                            {
                                body: req.body.body
                            }, //
                            function (answer_err, answer_updated) {
                                if (answer_err === null) {
                                    res.status(200).send(JSON.stringify(answer_updated, undefined, 2) + "\n");
                                } else {
                                    res.status(400).send("cannot update the answer : " + JSON.stringify(answer_err) + '\n'); // the answer could not be updated
                                }
                            }
                        );
                    } else {
                        res.status(404).send('answer Not found \n'); // error during the get
                    }
                });
            } else {
                res.status(404).send('cannot find Question \n');
            }
        }
    );
});

/***************
* HTTP verb : DELETE
* URL: /questions/:question_id/answers/:answer_id
* Request Parameters: none
* Description: DELETE an answer
*******************/
app.del('/questions/:question_id/answers/:answer_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.answer.get(req.params.answer_id, function (answer_err, del_answer) {
                    var error_delete_answer = null, error_comments_delete = null;
                    if (answer_err === null) {

                        delete_answer(del_answer, error_delete_answer, error_comments_delete, function () {
                            if (error_delete_answer === null && error_comments_delete === null) {
                                res.status(200).send("The answer has been deleted" + '\n');
                            } else if (error_comments_delete !== null) {
                                res.status(400).send("An error occured during the deletion of the comment of the answer returning the error : " + JSON.stringify(error_comments_delete) + '\n'); // error during the deletion of the answer
                            } else {
                                res.status(400).send("An error occured during the deletion of the answer returning the error : " + JSON.stringify(error_delete_answer) + '\n'); // error during the deletion of the answer
                            }
                        });
                    } else {
                        res.status(404).send("cannot find answer \n"); // error during the get
                    }
                }
                    );
            } else {
                res.status(404).send('Question is not found \n');
            }
        }
    );

});

/***
Invalid URLs which users could query
***/
app.get('/question/:question_id/answer', function (req, res) {
    console.log("Got response: " + res.statusCode);
    res.send('Please check URL. cannot GET your request,error code:' + res.statusCode + ' ' + res.headers + '\n');
    res.end();
});
app.del('/questions/:question_id/answers', function (req, res) {
    console.log("cannot delete all answers at once : " + res.statusCode);
    res.status(405);
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST');
    res.end('Method not allowed on collection.\n');
});

app.put('/questions/:question_id/answers', function (req, res) {
    console.log("cannot update all answers at once : " + res.statusCode);
    res.send('cannot UPDATE all answers at once. error code:' + res.statusCode + ' ' + res.headers + '\n');
    res.end();
});
app.post('/questions/:question_id/answers/:answer_id', function (req, res) {
    console.log("cannot insert : " + res.statusCode);
    res.send('cannot insert, answer_id is auto number. error code:' + res.statusCode + ' ' + res.headers + '\n');
    res.end();
});

/***************************************************** Comments routes ***********************************************************/

/********************** Question with comments ***************************/

/*******************************************************************************************
* HTTP verb : HEAD
* URL: /questions/:question_id/comments
* Request Parameters: question_id
* Description: Gets the headers of the list of comments for a question with content-type set
********************************************************************************************/
app.head('/questions/:question_id/comments', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.comment.find(
                    {'question_id': req.params.question_id},
                    function (question_err) {
                        if (question_err === null) {
                            res.status(200);
                            res.end();
                        } else {
                            res.status(404);
                            res.end();
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/********************************************************************************************
* HTTP verb : GET
* URL: /questions/:question_id/comments
* Request Parameters: question_id
* Description: Gets all the comments for this specific question
* Step: Checks for the question, if question was found, get its comments list of the same ID.
*********************************************************************************************/
app.get('/questions/:question_id/comments', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.comment.find(
                    {'question_id': req.params.question_id}, // finds a list of all comments belonging to this question
                    function (question_comments_err, comment_list) {
                        if (question_comments_err === null) {
                            if (comment_list.length === 0) {
                                // To indicate that the comments list are empty instead of []
                                res.status(200).send("Comment list of this questions is empty.\n");
                            } else {
                                // formats the returned list to JSON, for pretty print tab level is set to 2
                                res.status(200).send(JSON.stringify(comment_list, undefined, 2) + "\n");
                            }
                        } else {
                            res.status(404).send('Question\'s comments were not found. \n');
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/**************************************************************************
* HTTP verb : PUT
* URL: /questions/:question_id/comments
* Request Parameters: question_id
* Description: Not allowing the user to call delete on comments collection
***************************************************************************/
app.put('/questions/:question_id/comments', function (req, res) {
    res.status(405); // returns the status 405 which is METHOD NOT ALLOWED
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST'); // method not allowed header that states the allowed methods only
    res.end('Method not allowed on collection.\n');
});

/**************************************************************************
* HTTP verb : DELETE
* URL: /questions/:question_id/comments
* Request Parameters: question_id
* Description: Not allowing the user to call delete on comments collection
***************************************************************************/
app.del('/questions/:question_id/comments', function (req, res) {
    res.status(405); // returns the status 405 which is METHOD NOT ALLOWED
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST');// method not allowed header that states the allowed methods only
    res.end('Method not allowed on collection.\n');
});

/***************************************************************************************************
* HTTP verb : POST
* URL: /questions/:question_id/comments
* Request Parameters: question_id
* Description: Creates a new comment for this specific question
* Steps: Checks for the question, if question was found, then creates a comment for it with the body
*           with the body from the request.
****************************************************************************************************/
app.post('/questions/:question_id/comments', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.comment.create(
                    [{
                        body: req.body.body
                    }],
                    function (comment_err, comment_list) {
                        if (comment_err === null) {
                            var comment = comment_list[0];
                            comment.setQuestion(question, function (question_to_comment_err) { // adds the association of the comment with the question
                                if (question_to_comment_err === null) {
                                    res.status(201).send(JSON.stringify(comment, undefined, 2) + "\n"); // status code 201 as the comment is successfully created
                                } else {
                                    console.log('Setting question to comment error: ' + question_to_comment_err);
                                    // 500 as the server did not save the data, so server error not client error.
                                    res.status(500).send('Error setting question to this comment: ' + question_to_comment_err + "\n");
                                }
                            });
                        } else {
                            console.log('Creating a comment to the question error: ' + comment_err);
                            res.status(500).send('Error creating comment: ' + comment_err + "\n");
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_err);
                // 404 NOT FOUND as thw question was not found in the Database
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/*******************************************************************
* HTTP verb : GET
* URL: /questions/:question_id/comments/:comment_id
* Request Parameters: question_id, :comment_id
* Description: Gets a specific comment for this specific question
*********************************************************************/
app.get('/questions/:question_id/comments/:comment_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.comment.find(
                    {'question_id': req.params.question_id,
                        'id': req.params.comment_id},
                    function (question_err, question_comment) {
                        if (question_err === null) {
                            // 200 OK along with this specific comment in JSON format
                            res.status(200).send(JSON.stringify(question_comment, undefined, 2) + "\n");
                        } else {
                            // 404 as the comment is not found
                            res.status(404).send('Question\'s comment was not found. \n');
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/********************************************************************
* HTTP verb : PUT
* URL: /questions/:question_id/comments/:comment_id
* Request Parameters: question_id, :comment_id
* Description: Updates a specific comment for this specific question
*********************************************************************/
app.put('/questions/:question_id/comments/:comment_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.comment.find(
                    {'question_id': req.params.question_id,
                        'id': req.params.comment_id},
                    function (comment_find_err, comment) {
                        if (comment_find_err === null) {
                            comment[0].save( // saves the comment output from the list of comment which has 1 comment so comment[0]
                                {
                                    body: req.body.body
                                },
                                function (comment_save_err) {
                                    if (comment_save_err === null) {
                                        res.status(201).send(JSON.stringify(comment, undefined, 2) + "\n");
                                    } else {
                                        console.log('Updating a comment to the question error: ' + comment_save_err);
                                        res.status(500).send('Error updating comment: ' + comment_save_err + "\n");
                                    }
                                }
                            );
                        } else {
                            res.status(404).send('Comment not found \n');
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/********************************************************************
* HTTP verb : DELETE
* URL: /questions/:question_id/comments/:comment_id
* Request Parameters: question_id, :comment_id
* Description: Deletes a specific comment for this specific question
**********************************************************************/
app.del('/questions/:question_id/comments/:comment_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_err, question) {
            if (question_err === null) {
                req.models.comment.get(
                    req.params.comment_id,
                    function (comment_find_err, comment) {
                        if (comment_find_err === null) {
                            comment.remove(
                                function (comment_delete_err) {
                                    if (comment_delete_err === null) {
                                        // status 204 NO CONTENT no response body will returned, as the comment was deleted
                                        res.status(204);
                                        res.end();
                                    } else {
                                        res.status(500).send('Comment was not deleted. \n');
                                    }
                                }
                            );
                        } else {
                            res.status(404).send('Comment to be deleted not found \n');
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/******************************* Answer with comments ******************************/

/***********************************************************************************
* HTTP verb : HEAD
* URL: /questions/:question_id/answers/:answer_id/comments
* Request Parameters: question_id
* Description: Gets the headers of the request with the new content-type set
************************************************************************************/
app.head('/questions/:question_id/answers/:answer_id/comments', function (req, res) {
    req.models.comment.find(
        {'question_id': req.params.question_id,
            'answer_id': req.params.answer_id},
        function (comments_for_answer_error) {
            if (comments_for_answer_error === null) {
                res.status(200);
                res.end();
            } else {
                console.log('Comment list error: ' + comments_for_answer_error);
                res.status(404);
                res.end();
            }
        }
    );
});

/******************************************************************************************
* HTTP verb : GET
* URL: /questions/:question_id/answers/:answer_id/comments
* Request Parameters: question_id
* Description: Gets the list of comments of this answer which is related to this question
******************************************************************************************/
app.get('/questions/:question_id/answers/:answer_id/comments', function (req, res) {
    req.models.comment.find( // finding all the comments having the answer_id as in request
        {'answer_id': req.params.answer_id},
        function (comments_for_answer_error, answer_comment_list) {
            if (comments_for_answer_error === null) {
                if (answer_comment_list.length === 0) {
                    res.status(200).send("Empty list of comments for this answer.\n"); //empty comments list
                } else {
                    res.status(200).send(JSON.stringify(answer_comment_list, undefined, 2) + "\n"); // 200 with JSON list of answer's comments
                }
            } else {
                console.log('Comment list error: ' + comments_for_answer_error);
                res.status(404).send('The comments requested for this answer of this question were not found.\n');
            }
        }
    );
});

/**********************************************************************************************************
* HTTP verb : POST
* URL: /questions/:question_id/answers/:answer_id/comments
* Request Parameters: question_id
* Description: Creates a comment for this answer which is related to this question
**********************************************************************************************************/
app.post('/questions/:question_id/answers/:answer_id/comments', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_find_err, question) {
            if (question_find_err === null) {
                req.models.answer.get(
                    req.params.answer_id,
                    function (answer_find_err, answer) {
                        if (answer_find_err === null) {
                            req.models.comment.create([{ // creates a comment with the body attribute as in the request
                                body: req.body.body
                            }],
                                function (comments_answer_error, comment_answer_list) {
                                    if (comments_answer_error === null) {
                                        var comment = comment_answer_list[0];
                                        comment.setAnswer(answer, function (answer_to_comment_err) {
                                            if (answer_to_comment_err === null) {
                                                res.status(201).send(JSON.stringify(comment, undefined, 2) + "\n"); //
                                            } else {
                                                console.log('Setting question to comment error: ' + answer_to_comment_err);
                                                res.status(500).send('Error setting question to this comment: ' + answer_to_comment_err + "\n");
                                            }
                                        });
                                    }
                                });
                        } else {
                            console.log('Answer error: ' + answer_find_err);
                            res.status(404).send('Answer not found \n');
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_find_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/**************************************************************************
* HTTP verb : PUT
* URL: /questions/:question_id/answers/:answer_id/comments
* Request Parameters: question_id
* Description: Not allowing the user to call delete on comments collection
***************************************************************************/
app.put('/questions/:question_id/answers/:answer_id/comments', function (req, res) {
    res.status(405); // METHOD NOT ALLOWED
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST'); // Specifying the allowed methods
    res.end('Method not allowed on collection.\n');
});

/**************************************************************************
* HTTP verb : DELETE
* URL: /questions/:question_id/answers/:answer_id/comments
* Request Parameters: question_id
* Description: Not allowing the user to call delete on comments collection
***************************************************************************/
app.del('/questions/:question_id/answers/:answer_id/comments', function (req, res) {
    res.status(405);
    res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST');
    res.end('Method not allowed on collection.\n');
});

/**********************************************************************************************************
* HTTP verb : GET
* URL: /questions/:question_id/answers/:answer_id/comments/:comment_id
* Request Parameters: question_id
* Description: Gets a comment from the list of comments of this answer which is related to this question
* Steps: Find the comment with the answer_id, and id of comment_id from comment model
**********************************************************************************************************/
app.get('/questions/:question_id/answers/:answer_id/comments/:comment_id', function (req, res) {
    req.models.comment.find(
        {'answer_id': req.params.answer_id,
            'id': req.params.comment_id},
        function (comment_for_answer_error, answer_comment) {
            if (comment_for_answer_error === null) {
                res.status(200).send(JSON.stringify(answer_comment, undefined, 2) + "\n");
            } else {
                console.log('Comment of answer error: ' + comment_for_answer_error);
                res.status(404).send('The comment requested for this answer was not found.\n');
            }
        }
    );
});

/**********************************************************************************************************
* HTTP verb : PUT
* URL: /questions/:question_id/answers/:answer_id/comments/:comment_id
* Request Parameters: question_id
* Description: Updates a specific comment of a specific answer which is related to this question
* Steps: Checks for the question, if question was found, then check for the answer, if the answer was found,
*           then check for the comment, if the comment was found, then update it with the body from the request
**********************************************************************************************************/
app.put('/questions/:question_id/answers/:answer_id/comments/:comment_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_find_err, question) {
            if (question_find_err === null) {
                req.models.answer.get(
                    req.params.answer_id,
                    function (answer_find_err, answer) {
                        if (answer_find_err === null) {
                            req.models.comment.find(
                                {'answer_id': req.params.answer_id,
                                    'id': req.params.comment_id},
                                function (comment_find_err, comment) {
                                    if (comment_find_err === null) {
                                        comment[0].save(
                                            {
                                                body: req.body.body
                                            },
                                            function (comment_save_err) {
                                                if (comment_save_err === null) {
                                                    res.status(201).send(JSON.stringify(comment, undefined, 2) + "\n");
                                                } else {
                                                    console.log('Updating a comment to the question error: ' + comment_save_err);
                                                    res.status(500).send('Error updating comment: ' + comment_save_err + "\n");
                                                }
                                            }
                                        );
                                    } else {
                                        console.log('Comment error: ' + comment_find_err);
                                        res.status(404).send('Comment not found \n');
                                    }
                                }
                            );
                        } else {
                            console.log('Answer error: ' + answer_find_err);
                            res.status(404).send('Answer not found \n');
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_find_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});

/**********************************************************************************************************
* HTTP verb : DELETE
* URL: /questions/:question_id/answers/:answer_id/comments/:comment_id
* Request Parameters: question_id
* Description: Deletes a specific comment of a specific answer which is related to this question
* Steps: Checks for the question first, if question was found then checks for the answer, if answer was found
*           then checks for the comment, if the comment was found, then remove it
**********************************************************************************************************/
app.del('/questions/:question_id/answers/:answer_id/comments/:comment_id', function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (question_find_err, question) {
            if (question_find_err === null) {
                req.models.answer.get(
                    req.params.answer_id,
                    function (answer_find_err, answer) {
                        if (answer_find_err === null) {
                            req.models.comment.get(
                                req.params.comment_id,
                                function (comment_find_err, comment) {
                                    if (comment_find_err === null) {
                                        comment.remove( // deleting this comment
                                            function (comment_del_err) {
                                                if (comment_del_err === null) {
                                                    res.status(204);
                                                    res.end();
                                                } else {
                                                    console.log('Updating a comment to the question error: ' + comment_del_err);
                                                    res.status(500).send('Error updating comment: ' + comment_del_err + "\n");
                                                }
                                            }
                                        );
                                    } else {
                                        console.log('Comment error: ' + comment_find_err);
                                        res.status(404).send('Comment not found \n');
                                    }
                                }
                            );
                        } else {
                            console.log('Answer error: ' + answer_find_err);
                            res.status(404).send('Answer not found \n');
                        }
                    }
                );
            } else {
                console.log('Question error: ' + question_find_err);
                res.status(404).send('Question not found \n');
            }
        }
    );
});