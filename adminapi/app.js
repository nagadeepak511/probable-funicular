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

app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('<h1>Hello world!</h1>')
})

// login
app.post('/authenticate', (req,res)=>{
    var {email,password} = req.body;
    if(!(email && password)) res.send({
        auth:false,
        message:"Please provide all details!"
    });
    else {
        db.collection('admin').find({email}).toArray((err, result)=>{
            if(err) throw err;
            if(result.length < 1) res.send({
                auth:false,
                message:"No such user"
            });
            else {
                if(bcrypt.compareSync(password, result[0].password)) {
                    res.send({
                        auth:true,
                        token:jwt.sign({id:result[0]._id}, secret, {expiresIn:86400}),
                        expiresIn:86400
                    })
                } else {
                    res.send({
                        auth:false,
                        message:"Invalid password"
                    })
                }
            }
        })
    } 
})

// add product
app.put('/addproduct',(req,res)=>{
    var token = req.headers["x-access-token"];
    if(!token) res.send({
        status:false,
        message:"No token provided"
    });
    else {
        jwt.verify(token, secret, (err,user)=>{
            if(err) res.send({
                status:false,
                message:"Invalid token provided"
            })
            else {
                var {name,cost,images,listitems,table,category_name,category_id,brand,brand_id} = req.body;
                if(!(name && cost && images && listitems && table && category_name && category_id && brand && brand_id)) res.send({
                    status:false,
                    message:"All details not provided"
                })
                else {
                    db.collection('products').insertOne({name,cost,images,listitems,table,category_name,category_id,rating:0,brand,brand_id}, (e,r)=>{
                        if(e) throw e;
                        res.send({
                            status:true,
                            message:"Successfully added new product!"
                        })
                    })
                }
            }
        })
    }
})

// get products
app.get('/products',(req,res)=>{
    db.collection('products').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

MongoClient.connect(mongoUrl, (err,client)=>{
    if(err) console.log("Error while connecting")
    else db = client.db('Amazon');
})

app.listen(port,()=>{console.log(`Listening to ${port}`)})