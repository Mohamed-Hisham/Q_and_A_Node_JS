#           COMP6017
# Advanced Topics on Web Services
#     Coursework Documentation

# Outline:
# ------
# The purpose of this webservice is to create a forum: the users will have the
# possibility to create questions, comment on these questions, and also answer a
# question and creating comments related to answers. This webservice validates
# the user inputs as well as taking into account its possible requests.

# Setup:
# ------
# Project folder structure:
#   project.js : main project code with inline comments.
#   demonstration.sh : demonstration bash script + documentation.
#   test folder
#     project_test.js : mocha test suite.

# Installation:
#   express : npm install express
#   sqlite: npm install sqlite3@2.1.7 --save
#   orm: npm install orm

# Testing Packages:
#   mocha: npm  install  mocha
#   should:  npm  install  should

# The project was ran and tested on:
# * OSX Mavricks
# * Ubuntu Desktop 12.04.3-desktop-i386 (32 bit)

# Running:
# Main service
#   node project.js

# Mocha Test
#   cd test/
#   mocha -c project_test.js -R spec

# Notes:
# * -i for headers to be available every time.
# * For HEAD requests, as mentioned in curl documentation --head is equivalent to -I
# * POST for creation, PUT for updating.
# * Deletion is done on a specific resource not the whole collection
# * If the user tried to update or delete a question, then a 405 status code
#   will be returned, and according to the w3c HTTP header definitions an additional
#   header is added stating the allowed methods on this collection.
# * When running the tests close the node app server, as another one is started in the test with another empty database.

# API:
# ----

#**************************** Questions API calls ******************************
# ------------------------------------------------------------------------------

# Get all questions before any are created and verify that the list is empty
curl -i localhost:3000/questions

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 3
#Date: Tue, 10 Dec 2013 13:13:36 GMT
#Connection: keep-alive

#[]


# Try to create a question without a title
curl -i -d "body=Body of the first question" -X POST localhost:3000/questions

# Response Example:
#HTTP/1.1 400 Bad Request
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 68
#Date: Tue, 10 Dec 2013 13:20:47 GMT
#Connection: keep-alive

#Question was not created due to missing information Error: required


# Try to create a question without a title
curl -i -d "title=Title of the first question" -X POST localhost:3000/questions

# Response Example:
#HTTP/1.1 400 Bad Request
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 68
#Date: Tue, 10 Dec 2013 13:21:29 GMT
#Connection: keep-alive

#Question was not created due to missing information Error: required


# Try to create a question with a title more than 100 characters
curl -i -d "title=Title of the first questionTitle of the first questionTitle of the first questionTitle of the first question&body=Body of the first question" -X POST localhost:3000/questions

# Response Example:
#HTTP/1.1 400 Bad Request
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 113
#Date: Tue, 10 Dec 2013 13:21:59 GMT
#Connection: keep-alive

#Question was not created due to missing information Error: Question title can not be longer than 100 characters.


# Try to create a question with an empty title
curl -i -d "title=&body=Body" -X POST localhost:3000/questions

# Response Example:
#HTTP/1.1 400 Bad Request
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 124
#Date: Tue, 10 Dec 2013 13:29:45 GMT
#Connection: keep-alive

#Question was not created due to missing information Error: Question title can not be empty, must have at least 1 character.


# Try to create a question with an empty body
curl -i -d "title=Title&body=" -X POST localhost:3000/questions

# Response Example:
#HTTP/1.1 400 Bad Request
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 123
#Date: Tue, 10 Dec 2013 13:31:39 GMT
#Connection: keep-alive

#Question was not created due to missing information Error: Question body can not be empty, must have at least 1 character.


# Successfully creates a new question
curl -i -d "title=Title of the first question&body=Body of the first question" -X POST localhost:3000/questions

# Response Example:
#HTTP/1.1 201 Created
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 110
#Date: Tue, 10 Dec 2013 13:22:28 GMT
#Connection: keep-alive

#[
#  {
#    "title": "Title of the first question",
#    "body": "Body of the first question",
#    "id": 1
#  }
#]

# Get the headers of all questions
curl --head localhost:3000/questions

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 13:23:05 GMT
#Connection: keep-alive


# Get all questions
curl -i localhost:3000/questions

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 110
#Date: Tue, 10 Dec 2013 13:24:08 GMT
#Connection: keep-alive

#[
#  {
#    "title": "Title of the first question",
#    "body": "Body of the first question",
#    "id": 1
#  }
#]


# Try to delete all questions
curl -i -X DELETE localhost:3000/questions

# Response Example:
#HTTP/1.1 405 Method Not Allowed
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Access-Control-Allow-Methods: HEAD,GET,POST
#Date: Tue, 10 Dec 2013 13:24:36 GMT
#Connection: keep-alive
#Transfer-Encoding: chunked

#All questions cannot be deleted at the same time. Please delete the questions one by one.


# Try to update all questions
curl -i -X PUT localhost:3000/questions

# Response Example:
#HTTP/1.1 405 Method Not Allowed
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Access-Control-Allow-Methods: HEAD,GET,POST
#Date: Tue, 10 Dec 2013 13:25:11 GMT
#Connection: keep-alive
#Transfer-Encoding: chunked

#All questions cannot be updated at the same time. Please update the questions one by one.


# Get the headers of question with id 1
curl --head localhost:3000/questions/1

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 13:25:36 GMT
#Connection: keep-alive


# Get the question with id 1
curl -i localhost:3000/questions/1

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 96
#Date: Tue, 10 Dec 2013 13:26:07 GMT
#Connection: keep-alive

##{
#  "title": "Title of the first question",
#  "body": "Body of the first question",
#  "id": 1
#}


# Update the question with id 1
curl -i -d "title=NEW title of the first question&body=NEW body of the first question" -X PUT localhost:3000/questions/1

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 104
#Date: Tue, 10 Dec 2013 13:26:43 GMT
#Connection: keep-alive

##{
#  "title": "NEW title of the first question",
#  "body": "NEW body of the first question",
#  "id": 1
#}


# Verify that the question with id 1 was updated
curl -i localhost:3000/questions/1

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 104
#Date: Tue, 10 Dec 2013 13:27:17 GMT
#Connection: keep-alive

##{
#  "title": "NEW title of the first question",
#  "body": "NEW body of the first question",
#  "id": 1
#}


# Create a new question with id 2
curl -i -d "title=Title of the second question&body=Body of the second question" -X POST localhost:3000/questions

# Deleting question with id 2
curl -i -X DELETE localhost:3000/questions/2

# Response Example:
#HTTP/1.1 204 No Content
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 13:34:57 GMT
#Connection: keep-alive


# Verify that the question with id 2 was deleted
curl -i localhost:3000/questions/2

# Response Example:
#HTTP/1.1 404 Not Found
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 20
#Date: Tue, 10 Dec 2013 13:35:26 GMT
#Connection: keep-alive

#Question Not found

#**************************************************************

#********************** Answers API calls *********************
# -------------------------------------------------------------

#Get the answers related to question 1
curl -i localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 3
#Date: Tue, 10 Dec 2013 13:41:02 GMT
#Connection: keep-alive

#[]


#Try to create an answer related to question 1 without parameters
curl -i -d "" -X POST localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 400 Bad Request
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 36
#Date: Tue, 10 Dec 2013 13:42:23 GMT
#Connection: keep-alive

#cannot insert AnswerError: required


#Try to create an answer related to question 1 with an empty body
curl -i -d "body=" -X POST localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 400 Bad Request
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 100
#Date: Tue, 10 Dec 2013 13:42:44 GMT
#Connection: keep-alive

#cannot insert AnswerError: Answer content (body)  can not be empty, must have at least 1 character.


#Create an answer related to question 1
curl -i -d "body=First question answer 1" -X POST localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 201 Created
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 198
#Date: Tue, 10 Dec 2013 13:43:12 GMT
#Connection: keep-alive

##{
#  "body": "First question answer 1",
#  "id": 1,
#  "question_id": 1,
#  "question": {
#    "title": "NEW title of the first question",
#    "body": "NEW body of the first question",
#    "id": 1
#  }
#}


#Create another answer related to question 1
curl -i -d "body=First question answer 2" -X POST localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 201 Created
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 198
#Date: Tue, 10 Dec 2013 13:43:36 GMT
#Connection: keep-alive

##{
#  "body": "First question answer 2",
#  "id": 2,
#  "question_id": 1,
#  "question": {
#    "title": "NEW title of the first question",
#    "body": "NEW body of the first question",
#    "id": 1
#  }
#}


#Update the first answer related to question 1
curl -i -d "body=NEW answer 1 for first question" -X PUT localhost:3000/questions/1/answers/1

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 79
#Date: Tue, 10 Dec 2013 13:43:58 GMT
#Connection: keep-alive

##{
#  "body": "NEW answer 1 for first question",
#  "id": 1,
#  "question_id": 1
#}


#Get all the answers related to question 1
curl -i -X GET localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 175
#Date: Tue, 10 Dec 2013 13:45:05 GMT
#Connection: keep-alive

#[
#  {
#    "body": "NEW answer 1 for first question",
#    "id": 1,
#    "question_id": 1
#  },
#  {
#    "body": "First question answer 2",
#    "id": 2,
#    "question_id": 1
#  }
#]


#Delete the second answer related to question 1
curl -i -X DELETE localhost:3000/questions/1/answers/2

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 13:48:40 GMT
#Connection: keep-alive

# The answer has been deleted


# Try to delete all the answers related to question 1
curl -i -X DELETE localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 405 Method Not Allowed
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Access-Control-Allow-Methods: HEAD,GET,POST
#Date: Tue, 10 Dec 2013 13:49:35 GMT
#Connection: keep-alive
#Transfer-Encoding: chunked

#Method not allowed on collection.


#try to update all the answers related to question 1
curl -i -X PUT localhost:3000/questions/1/answers

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 60
#Date: Tue, 10 Dec 2013 13:52:05 GMT
#Connection: keep-alive

#cannot UPDATE all answers at once. error code:200 undefined

# try to post the first answer of question
curl -i -X POST localhost:3000/questions/1/answers/1

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 66
#Date: Tue, 10 Dec 2013 13:52:32 GMT
#Connection: keep-alive

#cannot insert, answer_id is auto number. error code:200 undefined

#**************************************************************
#**************************************************************

#********************** Comments API call ************************************
# ------------------------------------------------------------------------------

# Comments for questions

# Get the header of the comments related to question 1
curl --head localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 14:07:55 GMT
#Connection: keep-alive

# Get the comments related to question 1
curl -i localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 41
#Date: Tue, 10 Dec 2013 14:08:16 GMT
#Connection: keep-alive

#Comment list of this questions is empty.

# Try to put all the comments related to question 1
curl -i -X PUT localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 405 Method Not Allowed
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Access-Control-Allow-Methods: HEAD,GET,POST
#Date: Tue, 10 Dec 2013 14:08:53 GMT
#Connection: keep-alive
#Transfer-Encoding: chunked

#Method not allowed on collection.

# Try to delete all the comments related to question 1
curl -i -X DELETE localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 405 Method Not Allowed
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Access-Control-Allow-Methods: HEAD,GET,POST
#Date: Tue, 10 Dec 2013 14:09:26 GMT
#Connection: keep-alive
#Transfer-Encoding: chunked

#Method not allowed on collection.

# Try to post a comment with no parameters
curl -i -d "" -X POST localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 500 Internal Server Error
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 40
#Date: Tue, 10 Dec 2013 14:09:50 GMT
#Connection: keep-alive

#Error creating comment: Error: required

# Try to post a comment with an empty body
curl -i -d "body=" -X POST localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 500 Internal Server Error
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 105
#Date: Tue, 10 Dec 2013 14:10:12 GMT
#Connection: keep-alive

#Error creating comment: Error: Comment content (body)  can not be empty, must have at least 1 character.

# Create the first comment related to question 1
curl -i -d "body=Comment 1 of question 1" -X POST localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 201 Created
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 219
#Date: Tue, 10 Dec 2013 14:10:36 GMT
#Connection: keep-alive

##{
#  "body": "Comment 1 of question 1",
#  "id": 1,
#  "question_id": 1,
#  "answer_id": null,
#  "question": {
#    "title": "NEW title of the first question",
#    "body": "NEW body of the first question",
#    "id": 1
#  }
#}


# Create a second comment related to question 1
curl -i -d "body=Comment 2 of question 1" -X POST localhost:3000/questions/1/comments

# Get all the comments related to question 1
curl -i localhost:3000/questions/1/comments

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 213
#Date: Tue, 10 Dec 2013 14:11:16 GMT
#Connection: keep-alive

#[
#  {
#    "body": "Comment 1 of question 1",
#    "id": 1,
#    "question_id": 1,
#    "answer_id": null
#  },
#  {
#    "body": "Comment 2 of question 1",
#    "id": 2,
#    "question_id": 1,
#    "answer_id": null
#  }
#]


# Get the first comment related to question 1
curl -i localhost:3000/questions/1/comments/1

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 108
#Date: Tue, 10 Dec 2013 14:11:38 GMT
#Connection: keep-alive

#[
#  {
#    "body": "Comment 1 of question 1",
#    "id": 1,
#    "question_id": 1,
#    "answer_id": null
#  }
#]


# Update the first comment related to question 1
curl -i -d "body=NEW comment 1 of question 1" -X PUT localhost:3000/questions/1/comments/1

# Response Example:
#HTTP/1.1 201 Created
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 112
#Date: Tue, 10 Dec 2013 14:12:05 GMT
#Connection: keep-alive

#[
#  {
#    "body": "NEW comment 1 of question 1",
#    "id": 1,
#    "question_id": 1,
#    "answer_id": null
#  }
#]


# Delete the second comment related to question 1
curl -i -X DELETE localhost:3000/questions/1/comments/2

# Response Example:
#HTTP/1.1 204 No Content
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 14:12:24 GMT
#Connection: keep-alive

#****************************** Comments for answers ***************************

# Get the header of the comments related to the first answer of the first question
curl --head localhost:3000/questions/1/answers/1/comments

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 14:17:09 GMT
#Connection: keep-alive

# Get the list of comments related to the first answer of the first question
curl -i localhost:3000/questions/1/answers/1/comments

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 40
#Date: Tue, 10 Dec 2013 14:17:26 GMT
#Connection: keep-alive

#Empty list of comments for this answer.

# Create a comment related to the first answer of the first question
curl -i -d "body=Comment 1 of answer 1 of question 1" -X POST localhost:3000/questions/1/answers/1/comments

# Response Example:
#HTTP/1.1 201 Created
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 204
#Date: Tue, 10 Dec 2013 14:20:00 GMT
#Connection: keep-alive

##{
#  "body": "Comment 1 of answer 1 of question 1",
#  "id": 3,
#  "question_id": null,
#  "answer_id": 1,
#  "answer": {
#    "body": "NEW answer 1 for first question",
#    "id": 1,
#    "question_id": 1
#  }
#}

# Create a second comment related to the first answer of the first question
curl -i -d "body=Comment 2 of answer 1 of question 1" -X POST localhost:3000/questions/1/answers/1/comments

#Try to update all comments related to the first answer of the first question
curl -i -X PUT localhost:3000/questions/1/answers/1/comments

# Response Example:
#HTTP/1.1 405 Method Not Allowed
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Access-Control-Allow-Methods: HEAD,GET,POST
#Date: Tue, 10 Dec 2013 14:20:52 GMT
#Connection: keep-alive
#Transfer-Encoding: chunked

#Method not allowed on collection.

# Try to delete all comments related to the first answer of the first question
curl -i -X DELETE localhost:3000/questions/1/answers/1/comments

# Response Example:
#HTTP/1.1 405 Method Not Allowed
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Access-Control-Allow-Methods: HEAD,GET,POST
#Date: Tue, 10 Dec 2013 14:21:15 GMT
#Connection: keep-alive
#Transfer-Encoding: chunked

#Method not allowed on collection.

# Get the first comment of the first answer of the first question
curl -i localhost:3000/questions/1/answers/1/comments/3

# Response Example:
#HTTP/1.1 200 OK
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 120
#Date: Tue, 10 Dec 2013 14:22:28 GMT
#Connection: keep-alive

#[
#  {
#    "body": "Comment 1 of answer 1 of question 1",
#    "id": 3,
#    "question_id": null,
#    "answer_id": 1
#  }
#]

# Update the first comment the first answer of the first question
curl -i -d "body=NEW Comment 1 of answer 1 of question 1" -X PUT localhost:3000/questions/1/answers/1/comments/3

# Response Example:
#HTTP/1.1 201 Created
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Content-Length: 124
#Date: Tue, 10 Dec 2013 14:23:06 GMT
#Connection: keep-alive

#[
#  {
#    "body": "NEW Comment 1 of answer 1 of question 1",
#    "id": 3,
#    "question_id": null,
#    "answer_id": 1
#  }
#]

# Delete the second comment the first answer of the first question
curl -i -X DELETE localhost:3000/questions/1/answers/1/comments/4

# Response Example:
#HTTP/1.1 204 No Content
#X-Powered-By: Express
#Content-Type: application/vnd.questions.answers.comments+json
#Date: Tue, 10 Dec 2013 14:24:31 GMT
#Connection: keep-alive


# **************************** Testing the project with mocha ******************
# ------------------------------------------------------------------------------
# N.B: close the node server before running the test, as they should have separate databases. 

# mODY [system][test] : mocha -c project_test.js -R spec
# connect.multipart() will be removed in connect 3.0
# visit https://github.com/senchalabs/connect/wiki/Connect-3.0 for alternatives
# connect.limit() will be removed in connect 3.0


# Questions and answers webservice started..
#   Questions and Answers service tests
#     ✓ should be running the service
#     ◦ should not update a non existing question: Models are created in database
#     ✓ should not update a non existing question
#     ◦ should not update a non existing question: cannot update all answers at once : 405
#     ✓ should not update a non existing question
#     ◦ should not request the comments of a question as the question is not created: Question error: Error: Not found
#     ✓ should not request the comments of a question as the question is not created


#   4 passing (31ms)
