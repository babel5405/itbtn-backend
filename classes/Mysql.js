var connector = require('mysql');
class Mysql {
    constructor() {
        this.host = "localhost";
        this.user = "itbtn";
        this.password = "itbtnPass";
        this.database = "itbtn";
        this.pool = connector.createPool(
            {
                connectionLimit : 20,
                host: this.host,
                port: 3306,
                user: this.user,
                password: this.password,
                database: this.database
            }
        )
    }
    
    Get() {
        return mysql;
    }
    
    async Query(queryString, completed_cb) {
        completed_cb = completed_cb || function(){};
        try {
            if (this.pool != undefined && this.pool != null) {
                this.pool.getConnection(function(err, connection) {
                    if (err) {
                        throw new Error(err)
                    } else {
                        connection.query(queryString, function(error, results, fields) {
                            connection.release();
                            if (error) {
                                throw new Error(error);
                            } else {
                                completed_cb(results, fields);
                            }
                        });
                    }
                });
            }
        } catch(e) {
            throw new Error(e);
        }
        
        
    }
}

let mysql = new Mysql();
module.exports = mysql;