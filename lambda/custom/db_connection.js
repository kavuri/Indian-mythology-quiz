/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

'use strict';

var _ = require('lodash');
var AWS = require('aws-sdk');

module.exports = class DBConn {
  constructor(aws) {
    // Set the region
    AWS.config.update({region: 'us-east-1'});

    if (_.isEqual(aws, true)) {
      this.dynamoDB = new AWS.DynamoDB({api_version:"2012-08-10"});
      this.docClient = new AWS.DynamoDB.DocumentClient({api_version:"2012-08-10"});
    } else {
      AWS.config.update({ accessKeyId: "myKeyId", secretAccessKey: "secretKey", region: "us-east-1" });
      var localUrl = 'http://localhost:8000';

      this.dynamoDB = new AWS.DynamoDB({ endpoint: new AWS.Endpoint(localUrl) });
      this.docClient = new AWS.DynamoDB.DocumentClient({ endpoint: new AWS.Endpoint(localUrl) });
    }

    return this;
  }

  dynDB() {
    return this.dynamoDB;
  }

  dynDC() {
    return this.docClient;
  }
}

var DBConn = require('./db_connection.js');

let testDbConn = new DBConn(false);
var dynamoDB = testDbConn.dynDB(),
    docClient = testDbConn.dynDC();
