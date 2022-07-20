import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './form.css';
import { Link } from 'react-router-dom';

var api = 'https://amazon-clone-filters.herokuapp.com';

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:"",
            email:"",
            password:""
        }
    }

    handleChange = (e)=>{
        sessionStorage.setItem(e.target.name,e.target.value);
        var {name,email,password} = sessionStorage;
        this.setState({
            name,email,password
        })
    }

    handleSubmit = (e)=>{
        var {name,email,password} = sessionStorage;
        fetch(api+'/register',{
            method:"POST",
            headers:{
                'accept':'application/json',
                'content-type':'application/json'
            },
            body:JSON.stringify({
                name,email,password
            })
        })
        .then((res)=>res.json())
        .then(data=>{
            if(data.auth == undefined) {
                this.props.history.push('/login');
                alert('Registration successful!');
            }
            else alert(data.message);
        })
    }

    render(){
        return(
            <>
                <Header/>
                <div class="loginformcontianer" onChange={this.handleChange}>
                    <h1 class="formheading">Register</h1>
                    <h3 class="formlabel">Enter your name</h3>
                    <input name="name" type="text" id="" class="formcontrol"/>
                    <h3 class="formlabel">Enter your email address</h3>
                    <input name="email" type="text" class="formcontrol"/>
                    <h3 class="formlabel">Enter your password</h3>
                    <input name="password" type="password" id="" class="formcontrol"/>
                    <button onClick={this.handleSubmit} class="amazonbutton blockbutton">Register</button>
                    <Link to="/login">Already have an account?</Link>
                </div>
                <Footer/>
            </>
        )
    }
};

export default Register;