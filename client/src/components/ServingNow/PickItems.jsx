import React, { useState } from 'react';

import "../ServingNow/PickItems.css";
import Counter from '../ServingNow/Counter'

import foodBankPic from '../Assets/foodBankPic.png';
import apples from '../Assets/apple.png';
import component from '../Assets/component.png';
import shoppingcart from '../Assets/shoppingcart.svg';


// import itemsList from '../Assets/itemsList.png';

function PickItems() {
    const[products] = useState([
        {
            name: 'Apples (2)',
            image: apples,
            component: component, 
        },
        {
            name: 'Apples (2)', 
            image: apples,
            component: component, 
        },
        {
            name: 'Apples (2)', 
            image: apples,
            component: component, 
        },
    ])

    return (
         <div>

            <img src={foodBankPic} alt="" class="foodBankPic"/>
            {/* <img src={itemsList} alt="" class="itemsList"/> */}

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

            <div class="foodbankHeader"> </div>

            <div class="foodBankText">
                <h5 style={{fontSize: "23px", letterSpacing: "0.25px", color: "black"}}> <b> Feeding Orange County</b></h5>
                <h6 style={{fontSize: "16px", letterSpacing: "0.18px", }}> 5.3 miles away</h6>
            </div>

            <div class="itemLimitText">
                <h5> <b>You can pick any 5 items</b> </h5>
            </div>

            {/* <div class="beverages">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}> <b> Beverages </b> </button>
            </div>

            <div class="fruits">
                <button style={{color: "white", background: "#E7404A", border: "none", textAlign:"center"}}> <b> Fruits </b> </button>
            </div>

            <div class="vegetables">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}> <b> Vegetables </b> </button>
            </div>

            <div class="meals">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}> <b> Meals </b> </button>
            </div>

            <div class="desserts">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}> <b> Desserts </b> </button>
            </div>

            <div class="canned">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}> <b> Canned </b> </button>
            </div>

            <div class="dairy">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}> <b> Dairy </b> </button>
            </div>

            <div class="snacks">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}> <b> Snacks </b> </button>
            </div> */}

            <div class="shoppingcart">
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}>
                    <img src={shoppingcart} alt="" class="shoppingcart"/>
                </button>
            </div>

            <div class="productsList"> 
            {products.map(product => (
                <>
                    <div>
                        <h5 style={{fontFamily: "SF Pro Display"}} class="name">{product.name}</h5>
                        <img src={product.image} alt="" class="apple"/>
                        <img src={product.component} alt="" class="component"/>
                        <Counter class="counter"> </Counter>
                    </div>
                </>
            ))}
            </div>

        </div>
    )
}

export default PickItems