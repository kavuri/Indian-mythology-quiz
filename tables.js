/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*/

'use strict';

var DBConn = require('./lambda/custom/EU/db_connection.js');

class Tables {
  constructor() {
    // get the db connection
    var dbConn = new DBConn(true);
    this.dynDB = dbConn.dynDB();
    this.dynDC = dbConn.dynDC();
  }

  create() {
    // read the tables json
    var tables = require('./tables.json');
    for (var i=0; i<tables.length; i++) {
      var params = tables[i];
      console.log(params)
      this.dynDB.createTable(params, function(err, data) {
        if (err) {
          console.log("Unable to create table-"+tables[i]+" Error JSON:", JSON.stringify(err, null, 2))
        } else {
          console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
      })
    }
  }

  list() {
    this.dynDB.listTables(function(err, data) {
      console.log('listTables', err, data);
    })
  }

  deleteTables(more) {
    var tables = require('./tables.json');
    tables.push.apply(tables, more);
    for (var i=0; i<tables.length; i++) {
      var params = {
        TableName: tables[i].TableName
      };
      this.dynDB.deleteTable(params, function(err, data) {
        if (err) {
          console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
      });
    }
  }

  addQuizFilesToDb() {
    var path = require('path'), fs=require('fs');
    var startPath = './', filter = '.csv';

    if (!fs.existsSync(startPath)){
      console.log("no dir ",startPath);
      return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
      var filename=path.join(startPath,files[i]);
      var stat = fs.lstatSync(filename);

      if (filename.indexOf(filter)>=0) {
        console.log('-- found: ',filename);
        var fn = filename.slice(0, -4);
        var mythology = fn.substring(fn.lastIndexOf(' ')+1, fn.length);

        // Add the mythology availability to mythologies table. This is used to prompt
        // to the user on the available mythology questions
        var params = {
          TableName: "mythologies",
          Item: {name:mythology}
        };

        this.dynDC.put(params, function(err, data) {
          if (err) {
            console.error("Unable to add "+ mythology +" entry to db. Error JSON:", JSON.stringify(err, null, 2));
          } else {
            console.log("Added " + mythology +" entry to db");
          }
        });

        var allQuiz = JSON.parse(fs.readFileSync(fn+'.json', 'utf8'));
        allQuiz.forEach((quiz) => {
          var params = {
            TableName: mythology,
            Item: {
              Counter: quiz.Counter,
              Question: quiz.Question,
              Responses: quiz.Responses,
              Answer: quiz.Answer,
              Type: quiz.Type
            }
          };

          // Add entry to db
          this.dynDC.put(params, (err, data) => {
            if (err) {
              console.error("Unable to add "+ JSON.stringify(params, null, 2) + " in " + mythology + " quiz. Error JSON:", JSON.stringify(err, null, 2));
            } else {
              console.log("Added "+ mythology + " quiz:");
            }
          })
        })  //allQuiz.forEach
      };
    }; //for (filename)
  }
}

var tables = new Tables();
// tables.create();
// tables.list();
// tables.deleteTables([ {'TableName': 'ramayana'}, {'TableName': 'Mahabharatha'}, {'TableName': 'Bhagavatha'} ]);

tables.addQuizFilesToDb()
