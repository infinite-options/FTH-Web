import React, { useState } from 'react';

import "../ServingNow/PickItems.css";
import Counter from '../ServingNow/Counter'

import foodBankPic from '../Assets/foodBankPic.png';
import apples from '../Assets/apple.png';
import component from '../Assets/component.png';
import shoppingcart from '../Assets/shoppingcart.svg';


// import itemsList from '../Assets/itemsList.png';

function PickItems() {

    const[filter, setFilter] = useState(null);
    const[products, setProducts] = useState([
        {
            name: 'Apples (2)',
            image: apples,
            component: component, 
        },
        {
            name: 'Red Apples (2)', 
            image: apples,
            component: component, 
        },
        {
            name: 'Green Apples (2)', 
            image: apples,
            component: component, 
        },
        {
            name: 'Fuji Apples (2)',
            image: apples,
            component: component, 
        },
        {
            name: 'Washington Apples (2)', 
            image: apples,
            component: component, 
        },
        {
            name: 'Crab Apples (2)', 
            image: apples,
            component: component, 
        },
        {
            name: 'Dem Apples (2)',
            image: apples,
            component: component, 
        },
        {
            name: 'Apples Not Oranges (2)', 
            image: apples,
            component: component, 
        },
        {
            name: 'Hungry for Apples? (2)', 
            image: apples,
            component: component, 
        },
    ]);

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

                {/* <img src={foodBankPic} alt="" class="foodBankPic"/>

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
                </div> */}
            </div>

            <div class="foodbankHeader">
                <img src={foodBankPic} alt="" class="foodBankPic"/>

                <div class="foodBankText">
                    <h5 style={{fontSize: "23px", letterSpacing: "0.25px", color: "black"}}> <b> Feeding Orange County</b></h5>
                    <h6 style={{fontSize: "16px", letterSpacing: "0.18px", }}> 5.3 miles away</h6>
                </div>

                {/* <div class="itemLimitText">
                    <h5> <b>You can pick any 5 items</b> </h5>
                </div> */}
                <div class="itemLimitWrapper">
                    <div class="itemLimitText">
                        <h5> <b>You can pick any 5 items</b> </h5>
                    </div>
                </div>
            </div>

            <div
                style={{
                    // border: 'dashed',
                    marginTop: '20px',
                    height: '60px',
                    display: 'flex'
                }}
            >
                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Beverages" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Beverages")}}
                    > 
                        Beverages
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Fruits" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Fruits")}}
                    > 
                        Fruits
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Vegetables" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Vegetables")}}
                    > 
                        Vegetables
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Meals" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Meals")}}
                    > 
                        Meals
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Desserts" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Desserts")}}
                    > 
                        Desserts
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Canned" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Canned")}}
                    > 
                        Canned
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Dairy" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Dairy")}}
                    > 
                        Dairy
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter === "Snacks" ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {setFilter("Snacks")}}
                    > 
                        Snacks
                    </button>
                </div>
            </div>

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
                        width: 'calc(100% - 40px)'
                    }}
                > 
                {products.map(product => (
                    <div
                        style={{
                            // border: '1px solid blue',
                            // width: '100px',
                            // minWidth: '0px',
                            height: '220px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        {/* APPLES */}
                        {/* <h5 style={{fontFamily: "SF Pro Display"}} class="name">{product.name}</h5> */}
                        {/* <img src={product.image} alt="" class="apple_fruit"/> */}
                        {/* <img src={product.component} alt="" class="component"/> */}
                        {/* <Counter class="counter"> </Counter> */}
                        <div
                            style={{
                                // border: '1px solid green',
                                marginTop: '10px',
                                marginBottom: '10px',
                                width: '150px',
                                borderRadius: '15px',
                                boxShadow: '0px 3px 6px #00000029',
                                position: 'relative'
                            }}
                        >
                            <div
                                style={{
                                    // border: '1px dashed',
                                    marginTop: '15px',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <img src={product.image} alt="" class="product_image"/>
                            </div>
                            <div
                                style={{
                                    // border: '1px dashed',
                                    // marginTop: '15px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {product.name}
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    // border: '1px dashed',
                                    borderRadius: '0px 0px 15px 15px',
                                    backgroundColor: '#e7404a',
                                    // marginTop: '15px',
                                    height: '40px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {/* <div>
                                    -
                                </div>
                                <div>

                                </div>
                                <div>
                                    +
                                </div> */}
                                <Counter class="counter"> </Counter>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
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

            {/* <div 
                class="shoppingcart"
                style={{
                    border: 'solid blue'
                }}
            >
                <button style={{color: "#E7404A", background: "white", border: "none", textAlign:"center"}}>
                    <img src={shoppingcart} alt="" class="shoppingcart"/>
                </button>
            </div> */}

            {/* <div 
                class="productsList"
                style={{
                    border: 'solid red'
                }}
            > 
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
            </div> */}

        {/* </div> */}
        </>
    )
}

export default PickItems