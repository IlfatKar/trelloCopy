export class Toast {
  constructor(configuration = {}) {
    this.title = 'toast'
    this.bgColor = configuration.bgColor || 'lightblue'
    this.errorColor = configuration.errorColor || 'red'
    this.duration = configuration.duration || 5
    this.animationTime = configuration.animationTime || '.5'
    this.textColor = configuration.textColor || 'white'
    this.border = configuration.border || 'none'
    this.callStack = []
    this.block = {
      width: 'auto',
      height: 40
    }
  }

  setStyle(type) {
    return (
      `margin-bottom: 10px;
      border-radius: 4px;
      display:flex;
      justify-content: center;
      background: ${type === 'msg' ? this.bgColor : this.errorColor};
      color: ${this.textColor};
      width: ${this.block.width}px; height: ${this.block.height}px;
      opacity: 0;
      transition: opacity ${this.animationTime}s;
      align-items: center;
      border: ${this.border};
      padding: 0 10px;
      `)
  }

  anim() {
    const callStack = this.getCallStack()
    const elements = this.addBlock(callStack)
    this.removeElement(elements.block, elements.callStackDiv)
  }

  getCallStack(){
    let callStack
    try {
      callStack = document.querySelector('.notifyStack')
      if (callStack === null) {
        throw new Error()
      }
    } catch (e) {
      callStack = document.createElement('div')
      callStack.style = 'position:absolute; right: 1rem; top:1rem'
      callStack.className = 'notifyStack'
    }
    return callStack
  }

  addBlock(callStack){
    const callStackDiv = document.querySelector('body').appendChild(callStack)
    const text = document.createElement('p')
    text.style = 'padding: 0; margin: 0;'
    text.textContent = this.callStack[this.callStack.length - 1].msg
    const block = document.createElement('div')
    block.style = this.setStyle(this.callStack[this.callStack.length - 1].type || 'msg')
    block.appendChild(text)
    callStackDiv.appendChild(block)
    setTimeout(() => {
      block.style.opacity = '1'
    }, 0)
    return {block, callStackDiv}
  }

  removeElement(block, callStackDiv){
    setTimeout(() => {
      this.callStack.shift()
      block.style.opacity = '0'
      setTimeout(()=>{
        callStackDiv.removeChild(block)
      }, this.animationTime * 1000)
    }, this.duration * 1000)
  }

  success(msg) {
    this.callStack.push({msg})
    this.anim()
  }

  error(msg) {
    this.callStack.push({msg, type: 'error'})
    this.anim()
  }

}