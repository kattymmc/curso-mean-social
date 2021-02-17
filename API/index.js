'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso-mean-social', 
        { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Se conectó a curso-mean-social")
        })
        .catch(err => console.log(err))