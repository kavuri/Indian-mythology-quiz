/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

'use strict';

var DBConn = require('./db_connection.js');

module.exports = class Db {
  constructor() {
    var dbConn = new DBConn(true);
    this.dynDB = dbConn.dynDB();
    this.dynDC = dbConn.dynDC();
  }

  available_mythologies(callback) {
    var params = {
      TableName: "mythologies"
    };

    this.dynDC.scan(params, function(err, data) {
      if (err) {
        // return a error callback
        callback(err, null);
      } else {
        callback(null, data.Items);
      }
    });
  }

  count(mythology, callback) {
    var params = {
      TableName: mythology
    }

    this.dynDB.describeTable(params, (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data.Table.ItemCount);
      }
    })
  }

  question(mythology, counter, callback) {
    var params = {
      TableName: mythology,
      Key: {
        'Counter': counter
      }
    };

    this.dynDC.get(params, function(err, data) {
      if (err) {
        // return a error callback
        callback(err, null);
      } else {
        callback(null, data.Item);
      }
    });
  }
}

// var Db = require('./db.js')
// var db = new Db();
// db.question("Ramayana", 1, (err, data) => {
//   console.log(err, data)
// });
