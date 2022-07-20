var packages = require('./packages');
var {app,MongoClient,secret,jwt,bcrypt,mongoUrl,mongodb} = packages;

var db;
MongoClient.connect(mongoUrl, (err,client)=>{
    if(err) console.log("Error while connecting")
    else db = client.db('Amazon');
})

app.get('/',(req,res)=>{
    res.send('<h1>Hello world!</h1>')
})

// register
app.post('/register',(req,res)=>{
    var {name,email,password} = req.body;
    if(!(name && email && password)) res.send({
        status:false,
        message:"Please provide all details"
    });
    else {
        db.collection('users').find({email}).toArray((err,result)=>{
            if(err) throw err;
            if(result.length > 0) res.send({
                status:false,
                message:"Email already registered with us"
            });
            else {
                db.collection('users').insert([{
                    name, email,
                    password:bcrypt.hashSync(password,8),
                    cart:[]
                }], (e,r)=>{
                    if(e) throw e;
                    res.send({
                        status:true,
                        message:"Successfully registered!"
                    })
                })
            }
        })
    }
});

// login
app.post('/login', (req,res)=>{
    var {email,password} = req.body;
    if(!(email && password)) res.send({
        auth:false,
        message:"Please provide all details!"
    });
    else {
        db.collection('users').find({email}).toArray((err, result)=>{
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

// fetch user details
app.get('/user',(req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token){
        res.send({auth:false,message:"No token provided!"})
        return;
    }
    jwt.verify(token,secret,(err,user)=>{
        if(err){
            res.send({auth:false,message:"Invalid token"})
            return;
        }
        db.collection('users').find({"_id":mongodb.ObjectId(user.id)}).toArray((err,result)=>{
            if(err) throw err;
            res.send({
                name:result[0].name,
                email:result[0].email,
                cart:result[0].cart,
            })
        })
    })
})
