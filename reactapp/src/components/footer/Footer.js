import React from 'react';
import './footer.css';

class Footer extends React.Component {
    render() {
        return(
            <>
            <button class="amazonlightbutton"><a href="#top" style={{color:"white",textDecoration:"none"}}>Back to top</a></button>
            <footer>
                <div class="footer-nav-links-container">
                    <h3>Know more ..</h3>
                    <ul>
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Terms</a></li>
                    </ul>
                </div>
                <div class="footer-nav-links-container">
                    <h3>Categories</h3>
                    <ul>
                        <li><a href="#">Electronics</a></li>
                        <li><a href="#">Watches</a></li>
                        <li><a href="#">Books</a></li>
                        <li><a href="#">Fitness Needs</a></li>
                        <li><a href="#">Footwear</a></li>
                        <li><a href="#">Clothing</a></li>
                    </ul>
                </div>
                <div class="footer-nav-links-container">
                    <h3>Bussiness</h3>
                    <ul>
                        <li><a href="#">Join us</a></li>
                        <li><a href="#">Terms</a></li>
                    </ul>
                </div>
                <div class="footer-nav-links-container">
                    <h3>Useful links</h3>
                    <ul>
                        <li><a href="#">Login</a></li>
                        <li><a href="#">Home</a></li>
                    </ul>
                </div>
                <div style={{width:"100%",textAlign: "center"}}>&copy; Naga Deepak</div>
            </footer>
            </>
        )
    }
};

export default Footer;