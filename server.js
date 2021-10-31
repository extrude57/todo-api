var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 5045;
var todoNextId = 1;
 
var  _ = require('underscore');

var todos = [{
    id:1,
    description:'Meet dead pigs at lunch',
    completed: false
}, {
    id:2, 
    description: 'Go to market',
    completed: false
}, {
    id:3,
    description: 'He told youhe made you mad',
    completed: true
}];

app.use(bodyParser.json());
app.get('/', function(req,res){
    res.send('Todo API Root');
});

//GET req /todos

app.get('/todos',function(req,res){
    res.json(todos);
});

app.get('/todos/:id', function (req,res){
    var todoId = parseInt(req.params.id,10); 
    // var matchedTodo;
    // todos.forEach(function (todo){
    //     if (todoId === todo.id){
    //         matchedTodo = todo; 
    //     }
    // });

    var matchedTodo = _.findWhere(todos, {id:todoId});

    if (matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send();
    }
    // res.send('Asking for todo with id of ' + req.params.id);
});

// POST / todos
app.post('/todos',function(req,res){
    var body = req.body;
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }

    body.id = todoNextId++;
    todos.push(body);
    console.log('Description: ' + body.description);
    res.json(body);
});



app.listen(PORT, function(){
    console.log('Express Listening on port ' + PORT + '!');
});