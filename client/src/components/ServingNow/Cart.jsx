import React, { useState } from 'react';

import "../ServingNow/Cart.css";
import CounterCart from '../ServingNow/CounterCart'
import { useSelector, useDispatch } from 'react-redux'

import foodBankPic from '../Assets/foodBankPic.png';
// import apples from '../Assets/apple.png';
// import component2 from '../Assets/component2.png';
// import deleteProduct from '../Assets/delete.svg';
// import line2 from '../Assets/line2.png';
import { Grid } from '@material-ui/core';


// import itemsList from '../Assets/itemsList.png';

function Cart() {
    const cart = useSelector(state => state.subscribe.cart);
    const dispatch = useDispatch();
    // const[products, setProducts] = useState([
    //     {
    //         name: 'Apples (2)',
    //         image: apples,
    //         component2: component2, 
    //     },
    //     {
    //         name: 'Red Apples (2)', 
    //         image: apples,
    //         component2: component2, 
    //     },
    //     {
    //         name: 'Green Apples (2)', 
    //         image: apples,
    //         component2: component2, 
    //     },
    //     {
    //         name: 'Fuji Apples (2)',
    //         image: apples,
    //         component2: component2, 
    //     },
    // ]);
    const[products, setProducts] = useState([
    ]);
    
    const[itemCounter, setItemCounter] = useState(0);
    
    const increment = (uid) => {
        console.log("increment product uid: ", uid);
        if(itemCounter < 5) {
            let productsCopy = [...products];
            let productIndex = products.findIndex((prod) => {
                return prod.item_uid === uid
            });
            console.log("(increment) productIndex: ", productIndex);

            setItemCounter(itemCounter + 1);

            let tempProduct = productsCopy[productIndex];

            tempProduct.qty = tempProduct.qt
            productsCopy[productIndex] = tempProduct;

            setProducts(productsCopy);

            dispatch({
                type: "SET_CART",
                payload: products
            });
        }
    };
    const decrement = (uid) => {
        console.log("decrement product uid: ", uid);
        if(itemCounter > 0) {
            let productsCopy = [...products];
            let productIndex = products.findIndex((prod) => {
                return prod.item_uid === uid
            });
            console.log("(increment) productIndex: ", productIndex);

            setItemCounter(itemCounter - 1);

            let tempProduct = productsCopy[productIndex];

            tempProduct.qty = tempProduct.qty - 1;

            productsCopy[productIndex] = tempProduct;

            setProducts(productsCopy);

            dispatch({
                type: "SET_CART",
                payload: products
            });
        }
    };

    return (
        <>
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
            </div>

            <div class="foodbankHeader1">
                <img src={foodBankPic} alt="" class="foodBankPic"/>

                <div class="foodBankText">
                    <h5 style={{fontSize: "23px", letterSpacing: "0.25px", color: "black"}}> <b> Feeding Orange County</b></h5>
                    <h6 style={{fontSize: "16px", letterSpacing: "0.18px", }}> 5.3 miles away</h6>
                </div>
            </div>

            <div
                style={{
                    // border: 'dashed',
                    marginTop: '20px',
                    marginLeft: '20px',
                    height: '28px',
                    display: 'flex'
                }}
            >
                <div class="header2">
                    <h5> <b> My Shopping Cart </b> </h5>
                </div>

                <div class="continueShoppingButton">
                    <button style={{color: "#E7404A", background: "white", border: 'none', textAlign:"center"}}> <b> Continue Shopping </b> </button>
                </div>
            </div>

            <div
                style={{
                    // border: 'dashed',
                    marginTop: '20px',
                    marginLeft: '20px',
                    height: '28px',
                    display: 'flex'
                }}
            >
                <div class="product">
                    <h5> <b> Product </b> </h5>
                </div>

                <div class="quantity">
                    <h5> <b> Quantity </b> </h5>
                </div>

                <div class="remove">
                    <h5> <b> Remove </b> </h5>
                </div>
            </div>

            {/* <div
                style={{
                    marginLeft: '20px',
                    width: '97.5%'
                }}
            >
                <img src={line2} alt="" class="line2"/>

            </div> */}
            
            <div
                style={{
                    // border: 'dashed',
                    marginTop: '20px',
                    marginBottom: '20px'
                    // height: '500px'
                }}
            >
                <div 
                    class="productsList"
                    style={{
                        // border: '1px solid red',
                        marginLeft: '20px',
                        marginRight: '20px',
                        width: 'calc(100% - 40px)',
                        display: 'inline-block',
                    }}
                > 
                {products.map(product => (
                    <div
                        style={{
                            // border: '1px solid blue',
                            // width: '100px',
                            // minWidth: '0px',
                            height: '120px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
                                // border: '1px solid green',
                                marginTop: '10px',
                                marginBottom: '10px',
                                height: '97px',
                                width: '100%',
                                borderRadius: '15px',
                                boxShadow: '0px 3px 6px #00000029',
                                position: 'relative'
                            }}
                        >
                            <div
                                style={{
                                    // border: '1px dashed',
                                    marginTop: '50px',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <img src={product.image} alt="" class="product_image2"/>
                            </div>
                            
                            <div
                                class="productName"
                                style={{
                                    // border: '1px dashed',
                                    // marginTop: '50px',
                                    marginLeft: '50px',
                                    // height: '29px',
                                    display: 'flex',
                                    // alignItems: 'left',
                                    justifyContent: 'left',
                                }}
                            >
                                {product.name}
                            </div>

                            <div
                                class="productName"
                                style={{
                                    // border: '1px dashed',
                                    // marginTop: '50px',
                                    marginLeft: '20px',
                                    // height: '29px',
                                    display: 'flex',
                                    // alignItems: 'left',
                                    justifyContent: 'left',
                                }}
                            >
                                {/* <img src={deleteProduct} alt="" class="delete"/> */}
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    // border: '1px dashed',
                                    // marginTop: '15px',
                                    height: '40px',
                                    // width: '40%',
                                    display: 'flex',
                                    marginLeft: '1245px',
                                    marginBottom: '25px'
                                    // alignItems: 'center'
                                }}
                            >
                                <CounterCart class="countercart"> </CounterCart>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                
                <div class="continueCartButton">
                    <a href="checkout"> 
                    <button style={{
                        color: "white", 
                        background: "none", 
                        border: 'none', 
                        textAlign:"center",
                        marginLeft: "25px"
                        }}> 
                        <h5><b> Continue to Checkout</b></h5> 
                    </button>
                    </a>
                </div>

            </div>
        </>
    )
}

export default Cart