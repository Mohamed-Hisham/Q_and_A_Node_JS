Outline:
------
The purpose of this webservice is to create a forum: the users will have the
possibility to create questions, comment on these questions, and also answer a
question and creating comments related to answers. This webservice validates
the user inputs as well as taking into account its possible requests.

Setup:
------
Project folder structure:
  project.js : main project code with inline comments.
  demonstration.sh : demonstration bash script + documentation.
  test folder
    project_test.js : mocha test suite.

Installation:
  express : npm install express
  sqlite: npm install sqlite3@2.1.7 --save
  orm: npm install orm

Testing Packages:
  mocha: npm  install  mocha
  should:  npm  install  should

The project was ran and tested on:
* OSX Mavricks
* Ubuntu Desktop 12.04.3-desktop-i386 (32 bit)

Running:
Main service
  node project.js

Mocha Test
  cd test/
  mocha -c project_test.js -R spec

Notes:
* -i for headers to be available every time.
* For HEAD requests, as mentioned in curl documentation --head is equivalent to -I
* POST for creation, PUT for updating.
* Deletion is done on a specific resource not the whole collection
* If the user tried to update or delete a question, then a 405 status code
  will be returned, and according to the w3c HTTP header definitions an additional
  header is added stating the allowed methods on this collection.
* When running the tests close the node app server, as another one is started in the test with another empty database.
