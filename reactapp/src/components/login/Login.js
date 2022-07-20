import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './form.css';
import { Link } from 'react-router-dom';

var api = 'https://amazon-clone-filters.herokuapp.com';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            email:"",
            password:""
        }
    }

    handleChange = (e)=>{
        sessionStorage.setItem(e.target.name,e.target.value);
        var {email, password} = sessionStorage;
        this.setState({email,password});
    }

    handleSubmit = (e)=>{
        fetch(api+'/login',{
            method:"POST",
            headers:{
                'accept':'application/json',
                'content-type':'application/json'
            },
            body:JSON.stringify(this.state)
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.auth == false) alert(data.message);
            else{
                sessionStorage.setItem('token',data.token);
                fetch(api+'/user',{
                    method:"GET",
                    headers:{
                        'accept':'application/json',
                        'content-type':'application/json',
                        'x-access-token':data.token
                    }
                })
                .then(res=>res.json())
                .then(data=>{
                    sessionStorage.setItem('username',data.name);
                    this.props.history.push('/cart');
                })
            }
        })
    }

    render(){
        return(
            <>
                <Header/>
                <div class="loginformcontianer" onChange={this.handleChange}>
                    <h1 class="formheading">Sign in</h1>
                    <h3 class="formlabel">Enter your email address</h3>
                    <input name="email" type="text" class="formcontrol"/>
                    <h3 class="formlabel">Enter your password</h3>
                    <input type="password" name="password" class="formcontrol"/>
                    <button class="amazonbutton blockbutton" onClick={this.handleSubmit}>Login</button>
                    <Link to="/register">Don't have an account?</Link>
                </div>
                <Footer/>
            </>
        )
    }
};

export default Login;