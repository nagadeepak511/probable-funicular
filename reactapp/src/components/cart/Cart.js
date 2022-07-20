import react from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import '../header/header.css';
import '../footer/footer.css';
import './cart.css';

var api = 'https://amazon-clone-filters.herokuapp.com';

class Cart extends react.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    fetchResults = ()=>{
        fetch(api+'/cart/showcart',{
            method:"GET",
            headers:{
                'x-access-token':sessionStorage.token
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.auth == false){
                alert(data.message);
                this.props.history.push('/login');
                return;
            }
            fetch(api+'/user',{
                method:"GET",
                headers:{
                    'x-access-token':sessionStorage.token
                }
            })
            .then(res1=>res1.json())
            .then(data1=>{
                if(data1.auth == false){
                    alert(data1.message);
                    this.props.history.push('/login');
                    return;
                }
                this.setState({data,countdata:data1});
            })
        });
    }

    componentDidMount(){
        this.fetchResults();
    }

    static getDerivedStateFromProps(props,state){
        if(sessionStorage.token == null){
            props.history.push('/login');
        }
    }

    deleteItem = (cartitemid)=>{
        fetch(api+'/cart/deleteitem',{
            method:"PUT",
            headers:{
                'x-access-token':sessionStorage.token,
                'accept':'application/json',
                'content-type':'application/json'
            },
            body:JSON.stringify({
                'cartitem':cartitemid
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.auth == false){
                alert(data.message);
                return;
            }
            this.fetchResults();
        });
    }

    findCount = (id)=>{
        if(this.state.countdata == undefined) return 0;
        var i = this.state.countdata.cart.filter((i)=>{return i.id == id});
        if(i.length == 0) return 0;
        console.log(i[0].count);
        return i[0].count;
    }

    updateCount = (id,count)=>{
        fetch(api+'/cart/additem',{
            method:"PUT",
            headers:{
                'accept':'application/json',
                'content-type':'application/json',
                'x-access-token':sessionStorage.token
            },
            body:JSON.stringify({
                cartitem:{
                    "id":id,
                    "count":Number(count)
                }
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.auth == false){
                alert(data.message)
                return;
            }
            this.fetchResults();
        })
    }

    renderCart = ()=>{
        var total = 0;
        if(this.state.data == undefined) return "Loading ..";
        else return (
            <>
                {
                    this.state.data.map((item)=>{
                        var count = this.findCount(item._id)
                        total += (count*item.cost);
                        return (<div class="cart">
                                    <input type="checkbox" checked={true} onChange={()=>{this.deleteItem(item._id)}}/>
                                    <img src={item.images[0]} class="cartimagecontainer"/>
                                    <div class="cartdetailscontainer">
                                        <div class="cartdetailsheader">
                                            <h3 class="cartitemname">{item.name}
                                            </h3>
                                            <h2 class="cartitemprice">INR {item.cost} X {count}</h2>
                                        </div>
                                        <h5 class="cartitembrand">By {item.brand}</h5>
                                        <div class="cartitemspec"><strong>Category:</strong>{item.category_name}</div>
                                        <div class="cartitemspec"><strong>Cost:</strong>{item.cost}</div>
                                        <select class="cartitemquantity" onChange={(e)=>{this.updateCount(item._id,e.target.value)}}>
                                            <option value={count}>-</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                        <button class="cartitemdeletebutton" onClick={()=>{this.deleteItem(item._id)}}>Delete</button>
                                    </div>
                                </div>)
                    })
                }
            </>
        )
    }

    static getDerivedStateFromProps(props,state){
        window.scrollTo(0,0);
    }

    renderTotalCost = ()=>{
        var total = 0;
        if(this.state.data == undefined) return 0;
        this.state.data.map((item)=>{
            var count = this.findCount(item._id)
            total += (count*item.cost);
        });
        return total;
    }

    render(){
        return(
            <>
                <Header/>
                <div class="cartcontainer">
                    <div class="cartheader">
                        <h1 class="cartheading">Your shopping cart</h1>
                    </div>
                    <div class="cartbody">
                        {this.renderCart()}
                    </div>
                    <div class="cartfooter">SubTotal(3 Items): INR {this.renderTotalCost()} <button id="checkoutbutton" class="amazonoutlinebutton">Check out</button></div>
                </div>
                <Footer/>
            </>
        )
    }
};

export default Cart;