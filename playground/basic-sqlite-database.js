var Sequelize = require('sequelize');
// var sequelize = new Sequelize('sqlite::memory:'){
//     'dialect' : 'sqlite',
//     'storage' : __dirname + '/basic-sqlite-database.sqlite'
// };
// const sequelize = new Sequelize('sqlite::memory:');
var sequelize = new Sequelize( {
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
    // force:true
        }).then(function () {
    console.log('Everything is sycned');
            Todo.findByPk(1).then(function (todo){
                if (todo){
                    console.log(todo.toJSON());
                }else {
                    console.log('Todo Not found');
                }
            })


        });
        // Todo.create({
        //     description:'Take out trash',
        //     completed:false
        // }).then(function(todo){
        //     return Todo.create({
        //         description:'Clean office'
        //     });
        //     // console.log('Finished Here');
        //     // console.log(todo);
        // }).then(function(){
        //     return Todo.findAll({
        //         where:{
        //             description:{
        //                 $like: '%trash%'
        //             }
        //         }
        //     })
        // }).then(function(todos){
        //     if (todos){
        //         todos.forEach(function(todo){
        //             console.log(todo.toJSON());
        //         });
        //         // console.log(todo.toJSON());
        //     }else{
        //         console.log('No todo found!');
        //     }
        // }).catch(function(e){
        //     console.log(e);
        // });
