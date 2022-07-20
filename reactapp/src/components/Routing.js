import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Homepage from './homepage/Homepage';
import Filterpage from './filterpage/Filterpage';
import Detailspage from './detailspage/Detailspage';
import Cart from './cart/Cart';
import Login from './login/Login'
import Register from './login/Register';

class Routing extends React.Component{
    render(){
        return (
            <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Homepage}/>
                <Route path="/filterpage/:category_id" component={Filterpage}/>
                <Route path="/detailspage/:product_id" component={Detailspage}/>
                <Route path="/cart" component={Cart}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>
            </BrowserRouter>
        )
    }
};

export default Routing;