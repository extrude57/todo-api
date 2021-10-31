var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined,{
    'dialect' : 'sqlite',
    'storage' : __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            len: [1,250]
        }
    },
    completed: {
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
});

sequelize.sync({
    force:true
        }).then(function () {
    console.log('Everything is sycned');
        Todo.create({
            description:'Walk my dog',
            completed:false
        }).then(function(todo){
            console.log('Finished Here');
            console.log(todo);
        }).catch(function(e){
            console.log(e);
        });
});