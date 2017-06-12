var express = require('express'); 

var todoController = require('./controllers/todoController');

var app = express();

//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));
app.use(express.static('./semantic'));

todoController(app);

//listen to port
app.listen(3000);
console.log('listening on port 3000');
