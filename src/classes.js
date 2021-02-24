export class App {
  constructor(workplace) {
    this.button = new Button()
    this.input = new Input()
    this.workplace = document.querySelector(workplace)
    this.init()
  }

  init() {
    this.workplace.append(this.button.element)
    this.button.element.addEventListener('click', this.addTask.bind(this))
    this.workplace.addEventListener('click', ev => {
      if(ev.target === this.input.createBtn){
        this.createCard(this.input.value)
      } else if(ev.target.closest('div') !== this.input.element && ev.target !== this.button.element){
        this.cancelTask()
      }
    })
  }

  addTask() {
    this.button.remove()
    this.workplace.append(this.input.element)
    this.input.clear()
  }

  cancelTask(){
    this.workplace.append(this.button.element)
    this.input.remove()
    this.input.clear()
  }

  createCard(title){
    const card = new Card(title)
    this.workplace.insertBefore(card.element, this.workplace.children[this.workplace.children.length - 1])
    this.cancelTask()
  }
}

class DOM {
  constructor(tag) {
    this.element = document.createElement(tag)
  }

  addClass(cl) {
    this.element.classList.add(cl)
  }

  removeClass(cl) {
    this.element.classList.remove(cl)
  }

  remove() {
    this.element.remove()
  }
}

class Button extends DOM {
  constructor() {
    super('div')
    this.addClass('button', 'button-outline')
    this.element.innerHTML = 'Добавить колонку'
  }
}

class Input extends DOM {
  constructor() {
    super('div')
    this.element.insertAdjacentHTML('beforeend', `
      <input placeholder="Колонка" type="text"/>
      <div class="close">OK</div>`)
    this.createBtn = this.element.children[1]
    this.addClass('inputBlock')
  }
  clear(){
    this.value = ''
  }
  get value(){
    return this.element.children[0].value
  }
  set value(val){
    this.element.children[0].value = val
  }
}

class Card extends DOM {
  constructor(title = 'Название') {
    super('div')
    this.addClass('card')
    this.element.insertAdjacentHTML('beforeend', `
      <div contenteditable="true">${title}</div>
      <div class="tasks">

      </div>`)
  }
  changeTitle(){
    
  }
}