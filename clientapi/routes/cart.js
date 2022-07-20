var packages = require('./packages');
var {app,MongoClient,secret,jwt,bcrypt,mongoUrl,mongodb} = packages;

var db;
MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log("Error while connecting");
    else db = client.db('Amazon');
})

// add item
app.put('/cart/additem',(req,res)=>{
    var token = req.headers['x-access-token'];
    jwt.verify(token,secret,(err,user)=>{
        if(err) {
            res.send({auth:false,message:"Invalid token"});
            return;
        }
        if(req.body.cartitem == undefined || typeof(req.body.cartitem.id) != 'string' || req.body.cartitem.id.length != 24 || !req.body.cartitem.count){
            res.send({auth:false,message:"Invalid product selected"})
            return;
        }
        db.collection('products').find({"_id":mongodb.ObjectId(req.body.cartitem.id)}).toArray((err,result)=>{
            if(err) throw err;
            if(!result.length){
                res.send({auth:false,message:"Invalid product selected"});
                return;
            }
            db.collection('users').find({"_id":mongodb.ObjectId(user.id)}).toArray((err1,result1)=>{
                if(err1) throw err1;
                var {cart} = result1[0];
                cart = cart.filter(i=> {return i.id!=req.body.cartitem.id});
                cart.push(req.body.cartitem);
                console.log(cart,result1[0]);
                db.collection('users').update({"_id":mongodb.ObjectId(user.id)},{$set:{cart}},(err,result)=>{
                    if(err) throw err;
                    res.send(result);
                })
            })
        })
    })
});

// delete item
app.put('/cart/deleteitem',(req,res)=>{
    var token = req.headers['x-access-token'];
    jwt.verify(token,secret,(err,user)=>{
        if(err) {
            res.send({auth:false,message:"Invalid token"});
            return;
        }
        if(typeof(req.body.cartitem) != 'string' || req.body.cartitem.length != 24){
            res.send({auth:false,message:"Invalid product selected"})
            return;
        }
        db.collection('products').find({"_id":mongodb.ObjectId(req.body.cartitem)}).toArray((err,result)=>{
            if(err) throw err;
            if(!result.length){
                res.send({auth:false,message:"Invalid product selected"});
                return;
            }
            db.collection('users').find({"_id":mongodb.ObjectId(user.id)}).toArray((err1,result1)=>{
                if(err1) throw err1;
                var {cart} = result1[0];
                cart = cart.filter(i=> {return i.id!=req.body.cartitem});
                console.log(cart,result1[0]);
                db.collection('users').update({"_id":mongodb.ObjectId(user.id)},{$set:{cart}},(err,result)=>{
                    if(err) throw err;
                    res.send(result);
                })
            })
        })
    })
});

// show cart
app.get('/cart/showcart',(req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token){
        res.send({auth:false, message:"No token provided!"});
        return;
    }
    jwt.verify(token,secret,(err,user)=>{
        if(err) {
            res.send({auth:false,message:"Invalid token"});
            return;
        }
        db.collection('users').find({"_id":mongodb.ObjectId(user.id)}).toArray((err,users)=>{
            if(err) throw err;
            var cart = users[0].cart;
            var cartids = [];
            cart.map((item)=>{cartids.push(mongodb.ObjectId(item.id))});
            db.collection('products').find({"_id":{$in:cartids}}).toArray((err,products)=>{
                if(err) throw err;
                res.send(products);
            })
        })
    })
})