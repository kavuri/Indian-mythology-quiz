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
    AWS.config.update({region: 'eu-west-1'});

    if (_.isEqual(aws, true)) {
      this.dynamoDB = new AWS.DynamoDB({api_version:"2012-08-10", accessKeyId:"AKIAIRJQTFYO62MCXCTQ", secretAccessKey:"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"});
      this.docClient = new AWS.DynamoDB.DocumentClient({api_version:"2012-08-10", accessKeyId:"AKIAIRJQTFYO62MCXCTQ", secretAccessKey:"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"});
    } else {
      AWS.config.update({ accessKeyId: "myKeyId", secretAccessKey: "secretKey", region: "eu-west-1" });
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
