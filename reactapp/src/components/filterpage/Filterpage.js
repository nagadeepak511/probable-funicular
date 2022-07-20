import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import {Link} from 'react-router-dom';
import './filterpage.css';

var api = 'https://amazon-clone-filters.herokuapp.com';

class Filterpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            category_id:1,
            productsperpage:6,
            brands:[],
            selectedBrands:[]
        }
    }

    static getDerivedStateFromProps(props, state){
        return {category_id:Number(props.match.params.category_id)}
    }

    componentDidMount(){
        window.scrollTo(0,0);
        fetch(api+'/filters/productcount/'+this.props.match.params.category_id)
        .then(res=>res.json())
        .then((data)=>{
            fetch(api+'/filters/brands/'+this.props.match.params.category_id)
            .then(r=>r.json())
            .then(d=>{
                var brands = [];
                d.results.map(brand=>{brands.push(brand.brand_id)});
                brands = brands.toString();
                sessionStorage.setItem('brands','0');
                sessionStorage.setItem('lcost','0');
                sessionStorage.setItem('hcost','100000000');
                sessionStorage.setItem('category_id',this.props.match.params.category_id);
                sessionStorage.setItem('sort',1);
                this.setState({brands:d.results,data});
            })
        })
    }

    renderProduct = (products)=>{
        return products.map((product)=>{
            return (
                <div class="filterresult">
                <Link to={"/detailspage/"+product._id}>
                    <div class="filterresultthumb" style={{backgroundImage: `url(${product.images[0]})`}}></div>
                    <h3 class="filterresultheading">{product.name}</h3>
                    <div class="filterresultratingcontainer"></div>
                    <p class="filterresultcost">&#8377; {product.cost}</p>
                </Link>
                </div>
            )
        })
    }

    fetchResults = (brands)=>{
        var {category_id,lcost,hcost,sort} = sessionStorage;
        var {data} = this.state;
        console.log(api+`/filters/products?category_id=${category_id}&brands=${brands}&lcost=${lcost}&hcost=${hcost}&sort=${sort}`)
        fetch(api+`/filters/products?category_id=${category_id}&brands=${brands}&lcost=${lcost}&hcost=${hcost}&sort=${sort}`)
        .then(res=>res.json())
        .then(d=>this.setState({data:{count:data.count,results:d.results}}))
    }

    handleBrandChange = (e)=>{
        var temp = sessionStorage.getItem('brands').split(',');
        temp = temp.filter(brand => (brand != e.target.value));
        if(e.target.checked) temp.push(e.target.value);
        sessionStorage.setItem('brands',temp.toString());
        if(temp.length == 1) this.state.brands.map(brand=>temp.push(brand.brand_id))
        this.fetchResults(temp.toString());
    }

    handleCostChange = (e)=>{
        var {lcost,hcost} = sessionStorage;
        var value = e.target.value;
        if(value == 1){ lcost = 0; hcost = 1001; }
        else if(value == 2){ lcost = 1000; hcost = 2001;}
        else if(value == 3){ lcost = 2000; hcost = 5001;}
        else { lcost = 5000; hcost = 1000000;}
        sessionStorage.setItem('lcost',lcost);
        sessionStorage.setItem('hcost',hcost);
        var temp = sessionStorage.getItem('brands').split(',');
        if(temp.length == 1) this.state.brands.map(brand=>temp.push(brand.brand_id))
        this.fetchResults(temp);
    }

    handleSort = (e)=>{
        var temp = sessionStorage.brands.split(',');
        sessionStorage.setItem('sort',e.target.value);
        if(temp.length == 1) this.state.brands.map(brand=>temp.push(brand.brand_id))
        this.fetchResults(temp);
    }

    render(){
        return (
        <>
            <Header/>
            <div class="filterpagecontainer">
                <div class="filterpageformcontainer">
                    <h2 class="filterformheading">FILTERS</h2>
                    <div class="filterpageformgroup">
                        <h2 class="formlabel">Brand</h2>
                        {this.state.brands.map((brand)=>{
                            return (<div class="forminputcontainer">
                            <input type="checkbox" onChange={this.handleBrandChange} name="brand" value={brand.brand_id}/><span>{brand.brand_name}</span>
                        </div>)
                        })}
                    </div>
                    <div class="filterpageformgroup">
                        <h2 class="formlabel">Cost</h2>
                        <div class="forminputcontainer">
                            <input type="radio" name="cost" value="1" onChange={this.handleCostChange}/><span>Less than 1000</span>
                        </div>
                        <div class="forminputcontainer">
                            <input type="radio" name="cost" value="2" onChange={this.handleCostChange}/><span>1000 to 2000</span>
                        </div>
                        <div class="forminputcontainer">
                            <input type="radio" name="cost" value="3" onChange={this.handleCostChange}/><span>2000 to 5000</span>
                        </div>
                        <div class="forminputcontainer">
                            <input type="radio" name="cost" value="4" onChange={this.handleCostChange}/><span>5000+</span>
                        </div>
                    </div>
                    <div class="filterpageformgroup">
                        <h2 class="formlabel">Rating</h2>
                        <div class="forminputcontainer">
                            <input type="radio" name="rating"/><span>Less than 3</span>
                        </div>
                        <div class="forminputcontainer">
                            <input type="radio" name="rating"/><span>3 to 4</span>
                        </div>
                        <div class="forminputcontainer">
                            <input type="radio" name="rating"/><span>4 to 5</span>
                        </div>
                    </div>
                    <div class="filterpageformgroup">
                        <h2 class="formlabel">Sort(Price)</h2>
                        <div class="forminputcontainer">
                            <input type="radio" name="sort" value="1" onChange={this.handleSort}/><span>Low to High</span>
                        </div>
                        <div class="forminputcontainer">
                            <input type="radio" name="sort" value="-1" onChange={this.handleSort}/><span>High to Low</span>
                        </div>
                    </div>
                </div>
                <div class="filterpageresultcontainer">
                    {this.state.data == undefined?"Loading..":this.renderProduct(this.state.data.results)}
                </div>
            </div>
            <Footer/>
        </>);
    }
};

export default Filterpage;