var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var dbName = 'kuizu';
var connection_string;
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}else{
    connection_string = '127.0.0.1:27017/' + dbName;
}

var db = mongojs(connection_string, ['user','question','answer','statistics']);

db.user.createIndex( { dept_id: 1 }, { unique: true } )
module.exports = db;