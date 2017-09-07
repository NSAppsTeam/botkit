var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/nickelbot';

// Use connect method to connect to the server


class Database {
    constructor() {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Error connecting to database: ' + err);
                exit();
            }
            this.db = db;
        }.bind(this));
    }

    addRequest(request, callback) {
        var collection = this.db.collection('mergerequests');
        collection.insert(request, function(err, result){
            if (callback && typeof callback === 'function') {
                callback(result);
            }
        });
    }

    updateStatus(url, newStatus, callback) {
        var collection = this.db.collection('mergerequests');
        collection.updateOne(
            {
                'merge_request.url': url
            },
            {
                $set: {
                    'merge_request.status': newStatus
                }
            },
            function(err, result) {
                if (typeof callback === 'function') {
                    callback(result);
                }
            }
        );
    }

    updateWipStatus(url, newWipStatus, callback) {
        var collection = this.db.collection('mergerequests');
        collection.updateOne(
            {
                'merge_request.url': url
            },
            {
                $set: {
                    'merge_request.work_in_progress': newWipStatus
                }
            },
            function(err, result) {
                if (typeof callback === 'function') {
                    callback(result);
                }
            }
        )
    }

    getOpenRequests(callback) {
        var collection = this.db.collection('mergerequests');
        collection.find({
            $and: [
                {'merge_request.status': 'open'},
                {'merge_request.work_in_progress': false}
            ]
        }).toArray(function(err, result) {
                if (typeof callback === 'function') {
                    callback(result);
                }
        });
    }
}

var test = new Database();