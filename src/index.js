import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
const DEFAULT_COLOR = '#999';

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
    this.resizeHandler = debounce(this.resizeHandler, 300)
  }

  componentWillMount(){
    validateId(this.props.node)
  }

  componentDidMount(){
    this.getCtx(this.props)
    this.updatePosition(this.props)
    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillReceiveProps(nextProps) {
    this.getCtx(nextProps)
    validateId(nextProps.node)
  }

  componentDidUpdate(){
    this.updatePosition(this.props)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
    this.store = null
    this.ctx = null
    this.width = null
    this.height = null
  }

  resizeHandler = () => {
    this.getCtx(this.props)
    this.updatePosition(this.props)
  }

  getCtx = (p) => {
    const canvas = document.getElementById(p.id)
    canvas.width = this.width = p.width || this.wrap.clientWidth
    canvas.height = this.height = p.height || this.wrap.clientHeight
    this.ctx = canvas.getContext('2d')
  }

  updatePosition = (p) => {
    const {
      node,
      onUpdate
    } = p
    this.store = {};
    if (!node) return
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
    if (typeof onUpdate === 'function'){
      onUpdate(this.store)
    }
    this.drawEdge(p);
  }

  drawEdge = (p) => {
    const {
      edge,
    } = p
    if (!edge) return
    this.ctx.clearRect(0, 0, this.width, this.height);
    edge.forEach(ed => {
      const s = this.store[ed.source]
      const t = this.store[ed.target]
      if (!s || !t) return
      const {
        source,
        target
      } = findShortest(s.anchor, t.anchor)
      this.ctx.beginPath();
      this.ctx.strokeStyle = ed.color || DEFAULT_COLOR
      this.ctx.lineWidth = 1
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
      const {
        ele : CompOrElement,
        id,
        x,
        y,
        ...rest
      } = d
      if (React.isValidElement(CompOrElement)){
        return React.cloneElement(CompOrElement, {
          ref: el => this[d.id] = el,
          key: d.id,
          ...rest
        })
      } else if (typeof CompOrElement === "function" &&
        !!CompOrElement.prototype.render){
        return <CompOrElement key={d.id} ref={el => this[d.id] = el} {...rest}/>
      } else {
        return <div/>
      }
    })
  }

  getData(){
    return this.store
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
