import React, { Component } from 'react';

import "../ServingNow/Cart.css";

import foodBankPic from '../Assets/foodBankPic.png';
import cartitems from '../Assets/cartitems.png';


class Cart extends Component {

    render() {
        return (
            <div>

                <img src={foodBankPic} alt="" class="foodBankPic"/>
                <img src={cartitems} alt="" class="cartitems"/>


                <div class="header">
                    <h5> <b>Serving Now</b> </h5>
                </div>

                <div class="rectangle1"> </div>

                <div class="foodbankHeader"> </div>

                <div class="foodBankText">
                    <h5 style={{fontSize: "23px", letterSpacing: "0.25px", color: "black"}}> <b> Feeding Orange County</b></h5>
                    <h6 style={{fontSize: "16px", letterSpacing: "0.18px", }}> 5.3 miles away</h6>
                </div>

                <div class="itemLimitText">
                    <h5> <b>You can pick any 5 items</b> </h5>
                </div>

            </div>
        )
    }
}

export default Cart