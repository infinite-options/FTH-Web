import React, { Component } from 'react';
import shoppingCart from '../Assets/shoppingcart.png'

class NavBar extends Component {
    render() {
        return (
            <div
                style={{
                    // border: 'dashed',
                    height: '80px',
                    width: '100vw',
                    maxWidth: '100%',
                    backgroundColor: '#e7404a'
                }}
            >

                <div class="header">
                    <h5> <b>Serving Now</b> </h5>
                </div>

                <div class="rectangle1"> </div>

                <div class="foodbanksbutton">
                    <button style={{color: "white", background: "none", border:"none", textAlign:"center"}}> Food Banks </button>
                </div>

                <div class="shopButton">
                    <button style={{color: "#E7404A", background: "white", border:"none", textAlign:"center"}}> Shop </button>
                </div>

                <div class="profileButton">
                    <button style={{color: "white", background: "none", border:"none", textAlign:"center"}}> Profile </button>
                </div>

                <div class="myordersButton">
                    <button style={{color: "white", background: "none", border:"none", textAlign:"center"}}> My Orders </button>
                </div>

                <div class="helplineButton">
                    <button style={{color: "white", background: "none", border:"none", textAlign:"center"}}> Helpline </button>
                </div>

                <div class="shoppingCartButton">
                    <a href="cart">
                    <button 
                        style={{background: "none", 
                                border:"none"
                                }}> 
                            <img src={shoppingCart} alt="" 
                                style={{
                                    // position: "relative",
                                    height: "51px",
                                    width: "50px",
                                }}
                            />
                    </button>
                    </a>
                </div>

            </div>
        )
    }
}

export default NavBar