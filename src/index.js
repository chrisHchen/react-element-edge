import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const DEFAULT_COLOR = '#eee'

import {
  validateId,
  initCanvas,
  getElementPosition,
  findShortest
} from './util'

export default class ReactElementEdge extends Component{
  constructor(props){
    super(props)
    this.store = {}
    this.ctx = null
    this.width = null
    this.height = null
  }

  componentWillMount(){
    validateId(this.props.node)
  }

  componentDidMount(){
    this.getCtx()
    this.updatePosition(this.props)
  }

  componentWillUnmount(){
    this.store = null
    this.ctx = null
    this.width = null
    this.height = null
  }

  componentWillReceiveProps(nextProps) {
    validateId(nextProps.node)
    this.updatePosition(nextProps)
  }

  getCtx = () => {
    const canvas = document.getElementById(this.props.id);
    canvas.width = this.width = this.wrap.clientWidth
    canvas.height = this.height = this.wrap.clientHeight
    this.ctx = canvas.getContext('2d');
  }

  updatePosition = (p) => {
    const {
      node,
    } = p
    node.forEach(n => {
      const dom = ReactDOM.findDOMNode(this[n.id])
      const {
        x,
        y,
      } = n
      dom.style.position = 'absolute'
      dom.style.left = x + 'px'
      dom.style.top = y + 'px'
      this.store[n.id] = getElementPosition(dom, n)
      // console.log(this.store)
    })
    this.drawEdge(p);
  }

  drawEdge = (p) => {
    const {
      edge,
    } = p
    this.ctx.clearRect(0, 0, this.width, this.height);
    edge.forEach(ed => {
      const {
        source,
        target
      } = findShortest(ed, this.store)
      this.ctx.beginPath();
      this.ctx.strokeStyle = ed.color || DEFAULT_COLOR
      this.ctx.moveTo(source.x, source.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.stroke();
      this.ctx.closePath();
    })
  }

  prepareEle = () => {
    const {
      node,
    } = this.props
    return node.map((d, index) => {
      const Comp = d.ele || <div/>
      const id = d.id
      return <Comp key={index} ref={el => this[id] = el}></Comp>
    })
  }

  render(){
    const {
      id,
      width,
      height = 300,
    } = this.props

    return (
      <div 
        ref={el => this.wrap = el}
        style={{ 
          width: width, 
          height: height,
          position: 'relative', 
          overflow: 'hidden', 
          border: `1px solid ${DEFAULT_COLOR}`}}>
        <canvas 
          id={id}
          style={{position:'absolute'}}></canvas>
        {
          this.prepareEle()
        }
      </div>
    )
  }
}
