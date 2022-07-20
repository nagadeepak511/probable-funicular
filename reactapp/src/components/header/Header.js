import React from 'react';
import {Link} from 'react-router-dom';
import './header.css';
import {BsCart3} from 'react-icons/bs';

var api = 'https://amazon-clone-filters.herokuapp.com';

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            categories:[
                {category_name:"Electronics",category_id:1},
                {category_name:"Watches",category_id:2},
                {category_name:"Fitness Needs",category_id:4},
                {category_name:"Footwear",category_id:5},
                {category_name:"Clothing",category_id:6}
            ],
            brands:[],
            products:[]
        }
    }

    fetchBrands = (e)=>{
        fetch(api+`/filters/brands/${e.target.value}`)
        .then(res=>res.json())
        .then(data=>this.setState({brands:data.results,selectedCategory:e.target.value}))
    }

    fetchProducts = (e)=>{
        var brand = e.target.value, category = this.state.selectedCategory;
        fetch(api+`/filters/products?category_id=${category}&brands=${brand}`)
        .then(res=>res.json())
        .then(data=>this.setState({products:data.results}));
    }

    redirect = (e)=>{
        this.props.redirect('/detailspage/'+e.target.value);
    }

    render(){
        return (
            <header id="top">
                <ul>
                    <li class="navbar-brand header-links"><Link to="/">A clone</Link></li>
                    <div>
                        {/* <!-- <li class="header-links"><i class="fas fa-search"></i></li> --> */}
                        <li class="header-links"><i class="fas fa-shopping-cart"><Link to="/cart"><BsCart3/></Link></i></li>
                        <li><Link to="/login" class='amazonoutlinebutton'>{
                            sessionStorage.username?sessionStorage.username:"Sign in"
                        }</Link></li>
                    </div>
                </ul>
                {this.props.showInputs?(<ul id="mobile-nav-links-list">
                    <li>
                        <select class="headerfontsize" onChange={this.fetchBrands}>
                            <option>--Select category--</option>
                            {this.state.categories.map((category)=>{
                                return <option value={category.category_id}>{category.category_name}</option>
                            })}
                        </select>
                    </li>
                    <li>
                        <div id="header-search-container">
                            <select class="headerfontsize" onChange={this.fetchProducts}>
                                <option value="">--Select brand--</option>
                                {this.state.brands.map(brand=><option value={brand.brand_id}>{brand.brand_name}</option>)}
                            </select>
                            <input class="headerfontsize" placeholder="search product.." list="products" onChange={this.redirect}/>

                            <datalist id="products">
                                {this.state.products.map(product=>{
                                    return <option value={product._id}>{product.name}</option>
                                })}
                            </datalist>
                            <button class="headerfontsize amazonbutton">Search</button>
                        </div>
                    </li>
                </ul>):null}
            </header>
        )
    }
};

export default Header;