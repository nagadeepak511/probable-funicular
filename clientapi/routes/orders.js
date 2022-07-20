var packages = require('./packages');
var {mongodb,MongoClient,mongoUrl,jwt,secret,app} = packages;

var db;
MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log("Error while connecting")
    else db = client.db('Amazon')
})

// get my orders
app.get('/orders/myorders',(req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token) {
        res.send({auth:false,message:"No token provided!"});
        return;
    }
    jwt.verify(token,secret,(err,user)=>{
        if(err) {
            res.send({auth:false,message:"Invalid token!"})
            return;
        }
        db.collection('orders').find({user_id:user.id}).toArray((err,result)=>{
            if(err) throw err;
            res.send({auth:true,result})
        })
    })
})

// place order
app.post('/orders/placeorder',(req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token){
        res.send({auth:false,message:"No token provided!"});
        return;
    }
    jwt.verify(token,secret,(err,user)=>{
        if(err) {
            res.send({auth:false,message:"Invalid token"});
            return;
        }
        var {cartItems} = req.body;
        if(!cartItems) {
            res.send({auth:false,message:"Cart items not provided"});
            return;
        }
        cartItems.map((cartItem)=>{
            if((!cartItem.product_id) || cartItem.product_id.length != 24){
                res.send({auth:false,message:"Invalid order id"});
                return;
            }
        })
        db.collection('orders').insert([{
            user_id:user.id,
            cartItems,
            timestamp:Date.now()
        }],(err,result)=>{
            if(err) throw err;
            res.send({auth:true,result});
        })
    })
})

// cancel order
app.delete('/orders/cancelorder',(req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token){
        res.send({auth:false,message:"No token provided!"})
        return;
    }
    jwt.verify(token,secret,(err,user)=>{
        if(err) {
            res.send({auth:false,message:"Invalid token!"})
            return;
        }
        var {order_id} = req.body;
        if((!order_id) || order_id.length != 24){
            res.send({auth:false,message:"Invalid order id"})
            return;
        }
        db.collection('orders').remove({"_id":mongodb.ObjectId(order_id)},(err,result)=>{
            if(err) throw err;
            res.send({
                auth:true,
                result
            })
        })
    })
});