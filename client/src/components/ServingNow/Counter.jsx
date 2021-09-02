import React, { Component } from 'react';

class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0
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
    };

    render() {
        return (
            <div class="counter"> 
                <button 
                  onClick={this.decrement} 
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
                > {this.state.count} </div>
                <button 
                  onClick={this.increment} 
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
        )
    }
}

export default Counter