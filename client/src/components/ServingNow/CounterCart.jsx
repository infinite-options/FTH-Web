import React, { Component } from 'react';

class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 1
        }
    }

    increment = () => {
        // this.setState({
        //     count: this.state.count + 1
        // })
        if(this.state.count < 5) {
            this.setState({
              count: this.state.count + 1,
              message: null
            });
          } else {
            this.setState({
              message: "Can't increment. Since 10 is the max value"
            });
          }
    };

    decrement = () => {
        // this.setState({
        //     count: this.state.count - 1
        // })
        if(this.state.count) {
            this.setState({
              count: this.state.count - 1,
              message: null
            });
          } else {
            this.setState({
              message: "Can't decrement. Since 0 is the min value"
            });
          }
    // const increment = (uid) => {
    //     console.log("increment product uid: ", uid);
    //     if(itemCounter < 5) {
    //         let productsCopy = [...products];
    //         let productIndex = products.findIndex((prod) => {
    //             return prod.item_uid === uid
    //         });
    //         console.log("(increment) productIndex: ", productIndex);

    //         setItemCounter(itemCounter + 1);

    //         let tempProduct = productsCopy[productIndex];

    //         tempProduct.qty = tempProduct.qt
    //         productsCopy[productIndex] = tempProduct;

    //         setProducts(productsCopy);

    //         dispatch({
    //             type: "SET_CART",
    //             payload: products
    //         });
    //     }
    // };
    // const decrement = (uid) => {
    //     console.log("decrement product uid: ", uid);
    //     if(itemCounter > 0) {
    //         let productsCopy = [...products];
    //         let productIndex = products.findIndex((prod) => {
    //             return prod.item_uid === uid
    //         });
    //         console.log("(increment) productIndex: ", productIndex);

    //         setItemCounter(itemCounter - 1);

    //         let tempProduct = productsCopy[productIndex];

    //         tempProduct.qty = tempProduct.qty - 1;

    //         productsCopy[productIndex] = tempProduct;

    //         setProducts(productsCopy);

    //         dispatch({
    //             type: "SET_CART",
    //             payload: products
    //         });
    //     }
    // };
    };

    render() {
        return (
            <div class="counter"> 
                <button 
                  onClick={this.decrement} 
                  style={{
                    fontSize: "40px", 
                    color: "white", 
                    background: '#E7404A', 
                    border:"none", 
                    borderRadius: '25px',
                    textAlign:"center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: '15px',
                    marginRight: '5px'
                  }}
                > - </button>
                <div
                  style={{
                    fontSize: "40px", 
                    color:"#E7404A",
                    border: '1px solid #E7404A',
                    borderRadius: '22px',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: '15px',
                    font: 'normal normal bold 23px/28px SF Pro Display',
                    marginRight: '5px'
                  }}
                > {this.state.count} </div>
                <button 
                  onClick={this.increment} 
                  style={{
                    fontSize: "30px", 
                    color: "white", 
                    background: "#E7404A", 
                    border:"none", 
                    borderRadius: '25px',
                    textAlign:"center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: '15px',
                  }}
                > + </button>
            </div>
        )
    }
}

export default Counter