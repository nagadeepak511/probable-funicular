var packages = require('./packages');
var {app,MongoClient,mongoUrl,mongodb} = packages;

var db;
MongoClient.connect(mongoUrl, (err,client)=>{
    if(err) console.log("Error while connecting")
    else db = client.db('Amazon');
});

// brands
app.get('/filters/brands/:category_id',(req,res)=>{
    var category_id = Number(req.params.category_id);
    db.collection('brands').find({category_id}).toArray((err,result)=>{
        if(err) throw err
        res.send({
            count:result.length,
            results:result
        })
    })
})

// product count per category
app.get('/filters/productcount/:category_id',(req,res)=>{
    var category_id = Number(req.params.category_id);
    db.collection('products').find({category_id}).toArray((err,result)=>{
        if(err) throw err;
        res.send({
            count:result.length,
            results:result
        })
    })
})

// filter products
app.get('/filters/products',(req,res)=>{
    var {category_id,lcost,hcost,sort,brands,rating} = req.query;
    brands = brands?brands.split(','):[];
    brands.map((brand,index)=>{brands[index]=Number(brand)})
    category_id = category_id?Number(category_id):1;
    lcost = lcost?Number(lcost):0;
    hcost = hcost?Number(hcost):1000000;
    rating = rating?Number(rating):3;
    sort = sort?Number(sort):1;
    var query = {
        brand_id:{$in:brands},
        category_id,
        $and:[{cost:{$gt:lcost,$lt:hcost}}],
        // $and:[{rating:{$gt:rating-1,$lt:rating}}]
    };
    db.collection('products').find(query).sort({cost:sort}).toArray((err,result)=>{
        if(err) throw err;
        res.send({
            count:result.length,
            results:result
        })
    })
})

// get product details
app.get('/filters/product/:product_id',(req,res)=>{
    var product_id = req.params.product_id;
    if(product_id.length != 24) {
        res.send([]);
        return;
    }
    db.collection('products').find({"_id":mongodb.ObjectId(product_id)}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})