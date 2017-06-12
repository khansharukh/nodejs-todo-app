var bodyParser = require('body-parser');
var mysql = require('mysql');
var moment = require('moment');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'todo',
    multipleStatements: true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS todo", function (err, result) {
        if (err) throw err;
        //console.log("Database created");
    });

    var sql = "CREATE TABLE  IF NOT EXISTS lists (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, item VARCHAR(255), sel_date DATE NOT NULL, cid INT(11), is_completed ENUM('0', '1') DEFAULT '0', idate DATETIME NOT NULL)";
    con.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("Table created");
    });
    var sql2 = "CREATE TABLE  IF NOT EXISTS category (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, cate VARCHAR(255))";
    con.query(sql2, function (err, result) {
        if (err) throw err;
        //console.log("Table created");
    });
});

var urlencodedParser = bodyParser.urlencoded({extended: false}) ;

module.exports = function(app) {

    app.get('/todo', function(req, res) {
        con.query("SELECT * FROM lists WHERE is_completed = '0' ORDER BY sel_date ASC; SELECT * FROM category", [1, 2], function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.render('todo', {todos: result[0], category: result[1], cid: [{cid: '0'}], moment: moment})
        });
    });
    app.get('/todo/task', function(req, res) {
        con.query("SELECT * FROM lists; SELECT * FROM category", [1, 2], function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.render('add_todo', {todos: result[0], category: result[1], cid: [{cid: '0'}]})
        });
    });
    app.get('/todo/list', function(req, res) {
        con.query("SELECT * FROM category", function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.render('add_list', {category: result, cid: [{cid: '0'}]})
        });
    });
    app.get('/todo/:id', function(req, res) {
        var $id = req.params.id;
        con.query("SELECT * FROM lists WHERE cid = '"+$id+"' ORDER BY sel_date ASC; SELECT * FROM category", [1, 2], function (err, result) {
            if (err) throw err;
            console.log(result[0]);
            res.render('todo', {todos: result[0], category: result[1], cid: [{cid: $id}], moment: moment})
        });
    });
    app.get('/completed/', function(req, res) {
        con.query("SELECT * FROM lists WHERE is_completed = '1' ORDER BY sel_date ASC; SELECT * FROM category", [1, 2], function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.render('completed', {todos: result[0], category: result[1], cid: [{cid: '0'}], moment: moment})
        });
    });

    // Add a Tasks via $.ajax (sodo-list.js)
    app.post('/todo', urlencodedParser, function(req, res) {
        //console.log(moment(req.body.sel_date).format("YYYY-MM-DD"));
        var post  = {item: req.body.item, sel_date: moment(req.body.sel_date).format("YYYY-MM-DD"), cid: req.body.cid, idate: moment().format()};
        var query = con.query('INSERT INTO lists SET ?', post, function(err, result) {
            // Neat!
        });
        console.log(query.sql);
        res.json(post);

    });
    app.post('/addList', urlencodedParser, function (req, res) {
        var post  = {cate: req.body.item};
        var query = con.query('INSERT INTO category SET ?', post, function(err, result) {
            // Neat!
        });
        res.json(post);
    });
    app.post('/change_status', urlencodedParser, function (req, res) {
        var is_completed =  req.body.status;
        var $id = req.body.id;
        var query = con.query("UPDATE lists SET is_completed = '"+is_completed+"' WHERE id = '"+$id+"' LIMIT 1", function(err, result) {
            // Neat!
        });
        res.json($id);
    });

    // Delete a Task via $.ajax (sodo-list.js)
    app.delete('/todo/:item', function(req, res) {
        var d_item =  req.params.item.replace(/-/g, ' ');
        console.log(d_item);return false;
        var sql = "DELETE FROM lists WHERE item = 'd_item' LIMIT 1";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records deleted: " + result.affectedRows);
        });
        res.json(req.params.item);
    })

};
