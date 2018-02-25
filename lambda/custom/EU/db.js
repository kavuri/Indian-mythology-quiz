/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*/

'use strict';

var DBConn = require('./db_connection.js');
var _ = require('lodash');

module.exports = class Db {
  constructor() {
    var dbConn = new DBConn(true);
    this.dynDB = dbConn.dynDB();
    this.dynDC = dbConn.dynDC();
  }

  /**
  * Function to get a list of available mythologies
  */
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

  /**
  * Function to get a count of questions for a mythology from database
  */
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

  /**
  * Function to get queastion from database
  */
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

  /**
  * Function to store user data to database
  * user_quiz_tracker = {userId:"1", "devices":["abc123"], "avble_qs":{"Ramayana":[2,6,10,23,30], "Mahabharata":[1,4,2,6,20,32]}, "scores": [{"mythology":"Ramayana", "sc":4, time":"timestamp"}]}
  */
  write_user_data(data, callback) {
    if (_.isEqual(data.n, true)) {
      // This is a new user, use put
      var params = {
        TableName: 'user',
        Item: _.omit(data, 'n')
      };

      this.dynDC.put(params, function(err, d) {
        if (err) {
          console.log('error in storing user info:', err);
        }
      })
    } else {
      console.log('====@@score=',data.scores);
      var params = {
        TableName: 'user',
        Key: {
          userId: data.userId
        },
        UpdateExpression: 'SET #avble_qs.#mythology = :avble_qs, scores = list_append(if_not_exists(scores, :empty_list), :sc)',
        ExpressionAttributeNames: {
          '#avble_qs':'avble_qs',
          '#mythology':data.avble_qs.mythology_choice
        },
        ExpressionAttributeValues: {
          ':sc': data.scores,
          ':avble_qs':data.avble_qs[data.avble_qs.mythology_choice],
          ':empty_list':[]
        }
      };

      this.dynDC.update(params, function(err, data) {
        if (err) {
          // return a error callback
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    }
}

/**
* Function to get available questions for a user
*/
get_user_data(userId, callback) {
  var params = {
    TableName: 'user',
    Key: {
      'userId': userId
    },
    AttributesToGet: [
      'avble_qs'
    ]
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
// var userId = "amzn1.ask.account.AGGLWT3Q5AJPQE6U52KYPQNILU5USAKXEJUTPKRU24QTV5AWNCG7GDSNV2S6C33CEKMTKE37NZGCHES7DFZEWY6UDMBL3UTKZOAZ46Z2NWC5QA354RTEBL3UX564SILYWKUOTBKK7L3LCHDZQYDLBYWW23SH7WXNZCLU3W457BZN7WUOM4JBQKH264RJ3G7AXVMH6KMJD6HEFLY";
// db.get_user_data(userId, (err, data) => {
//   console.log(data);
// })
// var user_add = {
//   "userId": "amzn1.ask.account.AGGLWT3Q5AJPQE6U52KYPQNILU5USAKXEJUTPKRU24QTV5AWNCG7GDSNV2S6C33CEKMTKE37NZGCHES7DFZEWY6UDMBL3UTKZOAZ46Z2NWC5QA354RTEBL3UX564SILYWKUOTBKK7L3LCHDZQYDLBYWW23SH7WXNZCLU3W457BZN7WUOM4JBQKH264RJ3G7AXVMH6KMJD6HEFLY",
//   "deviceId": "amzn1.ask.device.AH2GWVTDRNY7AKDPBC6K4NXPKDCZI7DZNJKDLNYMNSRX36I6R7QIYDTHBJWZENOXVS7LUZHSRKPPGAKJKZ3PF3FYZH63WFFHTH5SGRXUP2MZRTWN34PQJWQZF2PADKTQNFFUMS5Z7ZMFCTADPZT57UGUTMXA",
//   "avble_qs": {
//     "Ramayana": [],
//     "Mahabharata": [2,5,3,10,23,34,22],
//     "mythology_choice": "Mahabharata"
//   },
//   "scores": [{
//     "mythology": "Mahabharata",
//     "time": "2018-02-25T09:03:50.422Z",
//     "sc": 1
//   }],
//   "n":true
// }
//
// var user_update = {
//   "userId": "amzn1.ask.account.AGGLWT3Q5AJPQE6U52KYPQNILU5USAKXEJUTPKRU24QTV5AWNCG7GDSNV2S6C33CEKMTKE37NZGCHES7DFZEWY6UDMBL3UTKZOAZ46Z2NWC5QA354RTEBL3UX564SILYWKUOTBKK7L3LCHDZQYDLBYWW23SH7WXNZCLU3W457BZN7WUOM4JBQKH264RJ3G7AXVMH6KMJD6HEFLY",
//   "deviceId": "amzn1.ask.device.AH2GWVTDRNY7AKDPBC6K4NXPKDCZI7DZNJKDLNYMNSRX36I6R7QIYDTHBJWZENOXVS7LUZHSRKPPGAKJKZ3PF3FYZH63WFFHTH5SGRXUP2MZRTWN34PQJWQZF2PADKTQNFFUMS5Z7ZMFCTADPZT57UGUTMXA",
//   "avble_qs": {
//     "Mahabharata": [5,7,2,73,9],
//     "mythology_choice": "Mahabharata"
//   },
//   "scores": [{
//     "mythology": "Mahabharata",
//     "time": "2018-02-25T09:03:50.422Z",
//     "sc": 3
//   }],
//   "n":false
// }
//
// db.write_user_data(user_update, (err, d) => {
//   console.log('err=',err,'@@,data=', d)
// })
// db.question("Ramayana", 1, (err, data) => {
//   console.log(err, data)
// });
