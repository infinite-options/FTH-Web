import { useEffect, useState } from 'react';
import axios from "axios";
import "../ServingNow/PickItems.css";
import Counter from '../ServingNow/Counter'
import foodBankPic from '../Assets/foodBankPic.png';
import apples from '../Assets/apple.png';
import component from '../Assets/component.png';
import shoppingcart from '../Assets/shoppingcart.svg';


// import itemsList from '../Assets/itemsList.png';

function PickItems() {

    const[filter, setFilter] = useState([]);
    // const[products, setProducts] = useState([
    //     {
    //         name: 'Apples (2)',
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Red Apples (2)', 
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Green Apples (2)', 
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Fuji Apples (2)',
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Washington Apples (2)', 
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Crab Apples (2)', 
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Them Apples (2)',
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Apples Not Oranges (2)', 
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Hungry for Apples? (2)', 
    //         image: apples,
    //         component: component, 
    //         category: 'Fruits'
    //     },
    //     {
    //         name: 'Not a Fruit', 
    //         image: shoppingcart,
    //         component: component, 
    //         category: 'Meals'
    //     },
    // ]);
    const[products, setProducts] = useState([]);
    const[itemCounter, setItemCounter] = useState(0);

    useEffect(() => {
        axios
            .post('https://c1zwsl05s5.execute-api.us-west-1.amazonaws.com/dev/api/v2/getItems',
                {
                    type: ["fruit", "desert", "vegetable", "other"],
                    ids: ["200-000019"]
                }
            )
            .then((res) => {
                console.log("(getItems) res: ", res);
                let products_with_qty = [];
                res.data.result.forEach(prod => {
                    console.log("(getItems) prod: ", prod)
                    prod['qty'] = 0;
                    products_with_qty.push(prod);
                });
                console.log("(getItems) res 2: ", products_with_qty);
                setProducts(products_with_qty);
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response);
                }
                console.log(err);
            });
      }, []);

    const applyFilter = (clickedCategory) => {
        let newFilter = [...filter];

        console.log(" ");
        console.log("clicked product: ", clickedCategory)
        console.log("filter before: ", filter);

        
        if(filter.includes(clickedCategory)) {
            console.log("\n====================");
            let deleteIndex = filter.findIndex((category) => {
                // console.log("product: ", product);
                
                console.log("category: ", category);
                console.log("clickedCategory: ", clickedCategory);
                return category === clickedCategory
            });
            console.log("delete index: ", deleteIndex)
            newFilter.splice(deleteIndex, 1);
            console.log("====================\n\n");
        } else {
            newFilter.push(clickedCategory);
        }
        // console.log("====================\n");
        console.log("filter after: ", newFilter);

        setFilter(newFilter);
    }

    const increment = (uid) => {
        console.log("increment product uid: ", uid);
        if(itemCounter < 5) {
            let productsCopy = [...products];
            let productIndex = products.find((prod) => {
                // console.log("product: ", product);
                
                // console.log("category: ", category);
                // console.log("clickedCategory: ", clickedCategory);

                return prod.item_uid === uid
            });
            console.log("(increment) productIndex: ", productIndex);
        }
    };

    const decrement = (prod) => {
        console.log("decrement product: ", prod);
        if(itemCounter > 0) {

        }
    };

    const displayProducts = () => {
        let filteredProducts = [];
        
        products.forEach(product => {
            // if(filter.includes(product.category) || filter.length === 0) {
            if(filter.includes(product.item_type) || filter.length === 0) {
                filteredProducts.push(
                    <div
                        style={{
                            height: '220px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
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
                                    marginTop: '15px',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <img src={product.item_photo} alt="" class="product_image"/>
                            </div>
                            <div
                                style={{
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {product.item_name}
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    borderRadius: '0px 0px 15px 15px',
                                    backgroundColor: '#e7404a',
                                    height: '40px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {/* <Counter class="counter"> </Counter> */}
                                <div class="counter"> 
                                    <button 
                                        onClick={() => decrement(product.item_uid)} 
                                        style={{
                                            fontSize: "40px", 
                                            color: "white", 
                                            background: "none", 
                                            border:"none", 
                                            // border: "1px solid cyan",
                                            textAlign:"center",
                                            width: "40%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            // paddingBottom: "5px"
                                        }}
                                    > - </button>
                                    <div
                                        style={{
                                            fontSize: "40px", 
                                            // fontWeight: "600",
                                            color:"white",
                                            // border:"none", 
                                            // border: "1px solid cyan",
                                            width: "20%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    > {product.qty} </div>
                                    <button 
                                        onClick={() => increment(product.item_uid)} 
                                        style={{
                                            fontSize: "40px", 
                                            color: "white", 
                                            background: "none", 
                                            border:"none", 
                                            // border: "1px solid cyan",
                                            textAlign:"center",
                                            width: "40%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                            // paddingBottom: "8px"
                                        }}
                                    > + </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return filteredProducts;
    }

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
                    width: 'calc(100vw - 40px)',
                    marginLeft: '20px',
                    marginRight: '20px',
                    maxWidth: 'calc(100% - 40px)',
                    marginTop: '10px',
                    height: '40px',
                    display: 'flex'
                }}
            >
                <div 
                    class="filterButtonWrapper"
                    style={{
                        marginLeft: '2%'
                    }}
                >
                    <button 
                        class={filter.includes("beverage") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("beverage")
                        }}
                    > 
                        Beverages
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter.includes("fruit") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("fruit")
                        }}
                    > 
                        Fruits
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter.includes("vegetable") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("vegetable")
                        }}
                    > 
                        Vegetables
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter.includes("meal") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("meal")
                        }}
                    > 
                        Meals
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter.includes("dessert") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("dessert")
                        }}
                    > 
                        Desserts
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter.includes("canned") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("canned")
                        }}
                    > 
                        Canned
                    </button>
                </div>

                <div class="filterButtonWrapper">
                    <button 
                        class={filter.includes("dairy") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("dairy")
                        }}
                    > 
                        Dairy
                    </button>
                </div>

                <div 
                    class="filterButtonWrapper"
                    style={{
                        marginRight: '2%'
                    }}
                >
                    <button 
                        class={filter.includes("snack") ? (
                            "filterButton_selected"
                        ) : (
                            "filterButton"
                        )}
                        onClick={() => {
                            applyFilter("snack")
                        }}
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
                {displayProducts()}
                {/* {products.map(product => (
                    <div
                        style={{
                            height: '220px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
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
                                    borderRadius: '0px 0px 15px 15px',
                                    backgroundColor: '#e7404a',
                                    height: '40px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Counter class="counter"> </Counter>
                            </div>
                        </div>
                    </div>
                ))} */}
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