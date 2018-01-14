import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default function(Comp){
  return class WrappedEdge extends Component {
    componentDidMount(){
      const dom = ReactDOM.findDOMNode(this.d)
      dom.style.position = 'absolute'
    }

    render() {
      return <Comp ref={el => this.d = el}/>
    }
  }
}
 
