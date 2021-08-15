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
                <button onClick={this.decrement} style={{fontSize: "40px", color: "white", background: "none", border:"none", textAlign:"center"}}> - </button>
                <h2 style={{fontSize: "40px", color:"white"}}> {this.state.count} </h2>
                <button onClick={this.increment} style={{fontSize: "40px", color: "white", background: "none", border:"none", textAlign:"center"}}> + </button>
            </div>
        )
    }
}

export default Counter