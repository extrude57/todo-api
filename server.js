var express = require('express');
var bodyParser = require('body-parser');
var  _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 5045;
var todoNextId = 1;
 


// var todos = [];
var todos = [{

    description:'Meet dead pigs at lunch',
    completed: false,
    id:1
}, {
 
    description: 'Go to market',
    completed: false,
    id:2

}, {
    
    description: 'He told youhe made you mad',
    completed: true,
    id:3
}];

app.use(bodyParser.json());
app.get('/', function(req,res){
    res.send('Todo API Root');
});

//GET req /todos

app.get('/todos',function(req,res){
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, {completed:true});

    }else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
        filteredTodos = _.where(filteredTodos, {completed:false});
    }
    
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ) {
        filteredTodos = _.filter(filteredTodos,function(todo){
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        })
    }
    // "Go to work on Staurday".indexOf('work');
    res.json(filteredTodos);
    // debugger;

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
    var body =_.pick( req.body, 'description', 'completed');
    db.todo.create(body).then(function (todo){
        res.json(todo.toJSON());
    },function (e){
        res.status(400).json(e);
    });
    // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    //     return res.status(400).send();
    // }
    // body.description = body.description.trim();
    // body.id = todoNextId++;
    // todos.push(body);
    // console.log('Description: ' + body.description);
    // res.json(body);
});

app.delete('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});
    if (!matchedTodo){
        res.status(404).json({"error":"no todo found with that id"});
    }else{
        todos = _.without(todos,matchedTodo);
        res.json(matchedTodo);
    }
});
// PUT /todos/:id
app.put('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});
    var body =_.pick( req.body, 'description', 'completed');
    var validAttributes = {};
    if (!matchedTodo){
        return res.status(404).send();
    }
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    }else if(body.hasOwnProperty('completed')){
        //bad
        return res.status(400).send();
    }
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description;
    }else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }
     _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

});

db.sequelize.sync().then(function (){
    app.listen(PORT, function(){
        console.log('Express Listening on port ' + PORT + '!');
    });
})

