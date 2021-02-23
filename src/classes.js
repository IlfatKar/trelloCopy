export class App {
  constructor(workplace) {
    this.button = new Button()
    this.input = new Input()
    this.workplace = document.querySelector(workplace)
    this.init()
  }

  init() {
    this.workplace.append(this.button.button)
    this.workplace.append(this.input.input)
  }

  addTast() {
    this.button.hide()
    this.input.unhide()
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

  hide() {
    this.element.addClass('hidden')
  }

  unhide() {
    this.element.removeClass('hidden')
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
    super('input')
    this.element.placeholder = 'Колонка'
    this.element.type = 'text'
    this.addClass('hidden')
  }
}

class Card extends DOM {
  constructor(title = 'Название') {
    super('div')
    this.element.insertAdjacentHTML(`
      <div contenteditable="true">${title}</div>
      <div class="tasks">

      </div>`)
  }
  changeTitle(){
    
  }
}