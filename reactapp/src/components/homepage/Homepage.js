import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import {Link} from 'react-router-dom';
import './homepage.css';

class Homepage extends React.Component{
    componentDidMount(){
        window.scrollTo(0,0);
    }

    render(){
        return (
        <>
            <Header showInputs={true} redirect={(url)=>{this.props.history.push(url)}}/>
            <div class="categories-container">
                <div class="category">
                    <Link to="/filterpage/1">
                    <h2 class="category-header">Electronics</h2>
                    <div class="category-theme-container" style={{backgroundImage: "url('https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_Electronics_1x._SY304_CB432774322_.jpg')"}}></div>
                    </Link>
                </div>
                <div class="category">
                    <Link to="/filterpage/2">
                    <h2 class="category-header">Watches</h2>
                    <div class="category-theme-container" style={{backgroundImage: "url('https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Dash_SmartWatch_1X._SY304_CB639922137_.jpg')"}}></div>
                    </Link>
                </div>
                {/* <div class="category">
                    <Link to="/filterpage/3">
                    <h2 class="category-header">Books</h2>
                    <div class="category-theme-container" style={{backgroundImage: "url('https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Desktop_Dash_Kindle_1x._SY304_CB639752818_.jpg')"}}></div>
                    </Link>
                </div> */}
                <div class="category">
                    <Link to="/filterpage/4">
                    <h2 class="category-header">Fitness Needs</h2>
                    <div class="category-theme-container" style={{backgroundImage: "url('https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/September/DashboardCards/Fuji_Dash_Fitness_1X._SY304_CB639748186_.jpg')"}}></div>
                    </Link>
                </div>
                <div class="category">
                    <Link to="/filterpage/5">
                    <h2 class="category-header">Footwear</h2>
                    <div class="category-theme-container" style={{backgroundImage: "url('https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/December/EpicDailyDeals/Fuji_quad_fashion_1x._SY116_CB651061653_.jpg')"}}></div>
                    </Link>
                </div>
                <div class="category">
                    <Link to="/filterpage/6">
                    <h2 class="category-header">Clothing</h2>
                    <div class="category-theme-container" style={{backgroundImage: "url('https://images-na.ssl-images-amazon.com/images/G/01/US-hq/2021/img/Events/XCM_CUTTLE_1360298_1843011_US_186x116_1X_en_US._SY116_CB642508157_.jpg')"}}></div>
                    </Link>
                </div>
            </div>
            <Footer/>
        </>);
    }
};

export default Homepage;