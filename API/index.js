'use strict'

var mongoose = require('mongoose');
var app = require('./app')
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso-mean-social', 
        { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false })
        .then(() => {
            console.log("Se conectó a curso-mean-social")

            app.listen(port, ()=>{
                console.log(`Servidor corriendo en http://localhost:${port}/`);
            });
            
        })
        .catch(err => console.log(err))