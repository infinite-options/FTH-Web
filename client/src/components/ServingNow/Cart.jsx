import React, { useEffect, useState } from "react";

import "../ServingNow/Cart.css";
import CounterCart from "../ServingNow/CounterCart";
import { useSelector, useDispatch } from "react-redux";

import foodBankPic from "../Assets/foodBankPic.png";
// import apples from '../Assets/apple.png';
// import component2 from '../Assets/component2.png';
import deleteProduct from "../Assets/delete.svg";
// import line2 from '../Assets/line2.png';
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router";

// import itemsList from '../Assets/itemsList.png';

function Cart() {
  const history = useHistory();

  const cart = useSelector((state) => state.subscribe.cart);
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
  const [products, setProducts] = useState([]);

  const [itemCounter, setItemCounter] = useState(0);

  const increment = (uid) => {
    // console.log("(increment) min cart: ", minimizedCart);
    // console.log("(increment) uid: ", uid);

    if (itemCounter < 5) {
      let productsCopy = [...minimizedCart];
      let productIndex = minimizedCart.findIndex((prod) => {
        return prod.item_uid === uid;
      });

      // console.log("(increment) min cart: ", minimizedCart);
      // console.log("(increment) uid: ", uid);

      // console.log("(increment) itemCounter: ", itemCounter);
      setItemCounter(itemCounter + 1);

      let tempProduct = productsCopy[productIndex];

      tempProduct.qty = tempProduct.qty + 1;

      productsCopy[productIndex] = tempProduct;

      setMinCart(productsCopy);

      // dispatch({
      //     type: "SET_CART",
      //     payload: productsCopy
      // });
    }
  };

  const decrement = (uid) => {
    // console.log("(decrement) min cart: ", minimizedCart);
    // console.log("(decrement) uid: ", uid);

    if (itemCounter > 0) {
      let productsCopy = [...minimizedCart];
      let productIndex = minimizedCart.findIndex((prod) => {
        return prod.item_uid === uid;
      });

      let tempProduct = productsCopy[productIndex];

      if (tempProduct.qty > 0) {
        setItemCounter(itemCounter - 1);

        tempProduct.qty = tempProduct.qty - 1;

        productsCopy[productIndex] = tempProduct;

        setMinCart(productsCopy);

        // dispatch({
        //     type: "SET_CART",
        //     payload: productsCopy
        // });
      }
    }
  };

  // const displayProducts = () => {
  const [minimizedCart, setMinCart] = useState(() => {
    let nonzeroProducts = [];

    cart.forEach((product) => {
      if (product.qty > 0) {
        nonzeroProducts.push(product);
      }
    });

    return nonzeroProducts;
  });

  return (
    <>
      <div
        style={{
          // border: 'dashed',
          height: "80px",
          width: "100vw",
          maxWidth: "100%",
          backgroundColor: "#e7404a",
        }}
      >
        <div class="header">
          <h5>
            {" "}
            <b>Serving Now</b>{" "}
          </h5>
        </div>
      </div>

      <div class="foodbankHeader1">
        <img src={foodBankPic} alt="" class="foodBankPic" />

        <div class="foodBankText">
          <h5
            style={{
              fontSize: "23px",
              letterSpacing: "0.25px",
              color: "black",
            }}
          >
            {" "}
            <b> Feeding Orange County</b>
          </h5>
          <h6 style={{ fontSize: "16px", letterSpacing: "0.18px" }}>
            {" "}
            5.3 miles away
          </h6>
        </div>
      </div>

      <div
        style={{
          // border: '1px solid red',
          // marginTop: '20px',
          // marginLeft: '20px',
          // marginRight: '20px',
          margin: "20px",
          marginBottom: "50px",
          position: "relative",
          // height: '28px',

          display: "flex",
          // alignItems: 'center'
        }}
      >
        {/* <div 
                    class="header2"
                >
                    <h5> <b> My Shopping Cart </b> </h5>
                </div> */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            borderBottom: "solid",
            // border: '1px dashed',
            // height: '40px',
            width: "300px",
            maxWidth: "60%",
          }}
        >
          <h5>
            {" "}
            <b> My Shopping Cart </b>{" "}
          </h5>
        </div>

        {/* <div class="continueShoppingButton"> */}
        {/* <div> */}
        <button
          class="continueShoppingButton"
          onClick={() => history.push("pickitems")}
          // style={{
          //     color: "#E7404A",
          //     background: "white",
          //     border: 'none',
          //     display: 'flex',
          //     justifyContent: 'center',
          //     alignItems: 'center'
          // }}
        >
          Continue Shopping
        </button>
        {/* </div> */}
      </div>

      <div
        style={{
          // border: '1px dashed',
          borderBottom: "solid",
          marginTop: "20px",
          marginLeft: "20px",
          marginRight: "20px",
          height: "28px",
          display: "flex",
          position: "relative",
        }}
      >
        <div
        // class="product"
        >
          <h5>
            {" "}
            <b> Product </b>{" "}
          </h5>
        </div>

        <div
          // class="quantity"
          style={{
            // border: '1px dashed',
            width: "200px",
            textAlign: "center",
            position: "absolute",
            right: "200px",
          }}
        >
          <h5>
            {" "}
            <b> Quantity </b>{" "}
          </h5>
        </div>

        <div
          // class="remove"
          style={{
            // border: '1px dashed',
            width: "200px",
            textAlign: "center",
            position: "absolute",
            right: "0px",
          }}
        >
          <h5>
            {" "}
            <b> Remove </b>{" "}
          </h5>
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
          marginTop: "20px",
          marginBottom: "20px",
          // height: '500px'
        }}
      >
        <div
          class="productsList"
          style={{
            // border: '1px solid red',
            marginLeft: "20px",
            marginRight: "20px",
            width: "calc(100% - 40px)",
            display: "inline-block",
          }}
        >
          {/* {displayProducts()} */}
          {/* {minimizedCart} */}
          {minimizedCart.map((product) => (
            <div
              style={{
                // border: '1px solid blue',
                // width: '100px',
                // minWidth: '0px',
                height: "120px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* {console.log("render cart: ", cart)}
                        {console.log("render product: ", product)} */}
              <div
                style={{
                  // border: '1px solid green',
                  marginTop: "10px",
                  marginBottom: "10px",
                  height: "97px",
                  width: "100%",
                  borderRadius: "15px",
                  boxShadow: "0px 3px 6px #00000029",
                  position: "relative",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    // border: '1px dashed',
                    // marginTop: '50px',
                    // height: '100px',
                    height: "100%",
                    width: "140px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* {console.log("img url: ", product.image)} */}
                  <img
                    src={product.item_photo}
                    alt=""
                    // class="product_image2"
                    style={{
                      maxHeight: "90%",
                      maxWidth: "90%",
                    }}
                  />
                </div>

                <div
                  // class="productName"
                  style={{
                    // border: '1px dashed',
                    // marginTop: '50px',
                    // marginLeft: '50px',
                    // height: '29px',
                    height: "100%",
                    padding: "10px",
                    width: "200px",
                    // maxWidth: '23.6%',
                    // width: '50px'
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: 'left',
                  }}
                >
                  {product.item_name}
                </div>

                <div
                  class="productName"
                  style={{
                    // border: '1px dashed',
                    // marginTop: '50px',
                    marginLeft: "20px",
                    // height: '29px',
                    display: "flex",
                    // alignItems: 'left',
                    justifyContent: "left",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    right: "200px",
                    // bottom: '0px',
                    // border: '1px dashed',
                    // marginTop: '15px',
                    // height: '40px',
                    height: "100%",
                    width: "200px",
                    // width: '40%',
                    display: "flex",
                    justifyContent: "center",
                    // marginLeft: '1245px',
                    // marginBottom: '25px'
                    alignItems: "center",
                  }}
                >
                  {/* <div class="counter">  */}
                  <button
                    onClick={() => decrement(product.item_uid)}
                    style={{
                      // fontSize: "40px",
                      // color: "white",
                      // background: '#E7404A',
                      // border:"none",
                      // borderRadius: '25px',
                      // textAlign:"center",
                      // display: "flex",
                      // justifyContent: "center",
                      // alignItems: "center",
                      // padding: '15px',
                      // marginRight: '5px'
                      // fontSize: "30px",
                      fontSize: "30px",
                      color: "white",
                      background: "#E7404A",
                      border: "none",
                      // borderRadius: '25px',
                      borderRadius: "50%",
                      // textAlign:"center",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // padding: '15px',
                      paddingBottom: "6px",
                      marginRight: "10px",
                    }}
                  >
                    {" "}
                    -{" "}
                  </button>
                  <div
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      color: "#E7404A",
                      border: "1px solid #E7404A",
                      height: "55px",
                      width: "70px",
                      // borderRadius: '22px',
                      borderRadius: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // padding: '15px',
                      // font: 'normal normal bold 23px/28px SF Pro Display',
                      marginRight: "10px",
                    }}
                  >
                    {" "}
                    {product.qty}{" "}
                  </div>
                  <button
                    onClick={() => increment(product.item_uid)}
                    style={{
                      // fontSize: "30px",
                      fontSize: "30px",
                      color: "white",
                      background: "#E7404A",
                      border: "none",
                      // borderRadius: '25px',
                      borderRadius: "50%",
                      // textAlign:"center",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // padding: '15px',
                      paddingBottom: "6px",
                    }}
                  >
                    {" "}
                    +{" "}
                  </button>
                  {/* </div> */}
                </div>
                <div
                  onClick={() => {
                    // console.log("delete uid: ", product.item_uid);
                    // console.log("(increment) before itemCounter: ", itemCounter);
                    setMinCart(() => {
                      let remainingProducts = [];

                      minimizedCart.forEach((currProd) => {
                        if (currProd.item_uid === product.item_uid) {
                          // console.log("");
                          setItemCounter(itemCounter - currProd.qty);
                        } else {
                          remainingProducts.push(currProd);
                        }
                      });

                      return remainingProducts;
                    });
                    // console.log("(deletion) after itemCounter: ", itemCounter);
                  }}
                  style={{
                    position: "absolute",
                    right: "0px",
                    // bottom: '0px',
                    // border: '1px dashed',
                    // marginTop: '15px',
                    // height: '40px',
                    height: "100%",
                    width: "200px",
                    // width: '40%',
                    display: "flex",
                    justifyContent: "center",
                    // marginLeft: '1245px',
                    // marginBottom: '25px'
                    alignItems: "center",
                  }}
                >
                  <img src={deleteProduct} alt="" class="trashPic" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div class="continueCartButton">
          <a href="checkout">
            <button
              style={{
                color: "white",
                background: "none",
                border: "none",
                textAlign: "center",
                marginLeft: "25px",
              }}
            >
              <h5>
                <b> Continue to Checkout</b>
              </h5>
            </button>
          </a>
        </div>
      </div>
    </>
  );
}

export default Cart;
