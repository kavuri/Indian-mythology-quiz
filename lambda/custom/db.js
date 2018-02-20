/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

'use strict';

var DBConn = require('./db_connection.js');

module.exports = class Db {
  constructor() {
    var dbConn = new DBConn(false);
    this.dynDC = dbConn.dynDC();
  }

  available_mythologies() {
    var params = {
      TableName: "mythologies"
    };

    this.dynDC.get(params, function(err, data) {
      if (err) {
        // return a error callback
        callback(err, null);
      } else {
        callback(null, data.Item.alcohol.allowed.in_room);
      }
    });
  }

  save(deviceDetails, callback) {
    var params = {
      TableName: this.tableName,
      Item: deviceDetails
    };

    this.dynDC.put(params, function(err, data) {
      if (err) {
        // return a error callback
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  }
}
