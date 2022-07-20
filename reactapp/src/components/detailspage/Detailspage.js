import React, { Component } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './detailspage.css';

var api = 'https://amazon-clone-filters.herokuapp.com';

class Detailspage extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount() {
        window.scrollTo(0,0);
        fetch(api+'/filters/product/'+this.props.match.params.product_id)
        .then((res)=>res.json())
        .then(data=>this.setState({data}))
    }

    addToCart = (e)=>{
        fetch(api+'/cart/additem',{
            method:"PUT",
            headers:{
                'accept':'application/json',
                'content-type':'application/json',
                'x-access-token':sessionStorage.token
            },
            body:JSON.stringify({
                cartitem:{
                    "id":this.props.match.params.product_id,
                    "count":1
                }
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.auth == false){
                alert(data.message);
                this.props.history.push('/login');
                return;
            }
            this.props.history.push('/cart');
        })
    }

    renderProduct(product){
        return (
            <div class="detailspagecontainer">
                <div class="detailspageimagegallerycontainer">
                    <div class="imagegallery" style={{backgroundImage:`url(${product.images[0]})`}}></div>
                </div>
                <div class="detailscontainer">
                    <div class="titlecontanier">
                        <h2 class="detailspageproductname">{product.name}</h2>
                        <div class="ratingcontainer"></div>
                        <p class="productcost">&#8377; {product.cost}</p>
                        <div class="detailspageimagegallerycontainermobile">
                            <div class="imagegallery" style={{backgroundImage:`url(${product.images[0]})`}}></div>
                        </div>
                        {/* <button class='amazonoutlinebutton'>Buy now</button> */}
                        <button class="headerfontsize amazonbutton" onClick={this.addToCart}>Add to cart</button>
                    </div>
                    <div class="featurescontainer">
                        <ul class="detailsul">
                            <h3>More information</h3>
                            {product.listitems.map((litem)=>{
                                return <li>{litem}</li>
                            })}
                        </ul>
                        <div class="productdetailscontainer">
                            <h3 class="heading">Product details</h3>
                            <table>
                                <tbody>
                                    {product.table.map((ti)=>{
                                        return(<tr>
                                            <td>{ti[0]}</td>
                                            <td>{ti[1]}</td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static getDerivedStateFromProps(props,state){
        return {product_id:props.match.params.product_id}
    }

    render() { 
        return ( 
        <>
            <Header/>
            {
                this.state.data == undefined?"Loading..":(
                    (()=>{
                        if(this.state.data.length == 0) return "No results!"
                        return this.renderProduct(this.state.data[0]);
                    })()
                )
            }
            <Footer/>
        </>
        );
    }
}
 
export default Detailspage;