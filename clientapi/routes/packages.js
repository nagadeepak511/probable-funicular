var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb+srv://naga:test123@edumato.1t9ez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
var db;

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret = 'thisisasecretthisisasecret'
var cors = require('cors');

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json())

module.exports = {app,MongoClient,secret,jwt,bcrypt,port,mongoUrl,mongodb};