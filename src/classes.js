import dispatch from './utils/dispatch'
import location from './utils/location'


export class App {
  constructor(workplace) {
    this.button = new Button('Добавать колонку')
    this.saveBtn = new Button('Сохранить', 'saveBtn')
    this.input = new Input()
    this.workplace = document.querySelector(workplace)
    this.storage = []
    this.utils = {}
    this.init()
    return this
  }

  async init() {
    this.workplace.append(this.button.element)
    this.workplace.append(this.saveBtn.element)
    this.saveBtn.element.addEventListener('click', this.save.bind(this))
    this.button.element.addEventListener('click', this.addTask.bind(this))
    this.workplace.addEventListener('click', ev => {
      if (ev.target === this.input.createBtn) {
        this.createCard(this.input.value)
      } else if (ev.target.closest('div') !== this.input.element && ev.target !== this.button.element) {
        this.cancelTask()
      }
    })

    if(location.getId()){
      localStorage.clear()
      const id = location.getId()
      this.storageInit(await dispatch.getTasks(id))
    } else {
      this.storageInit()
    }

  }

  use(obj) {
    this.utils[obj.title] = obj
  }

  storageInit(obj = []) {
    if(!obj){
      let localTasks = JSON.parse(localStorage.getItem('storage'))
      if (localTasks && localTasks.length) {
        localTasks.forEach(card => {
          this.createCard(card.title, card.tasks)
        })
      }
    } else {
      obj.forEach(card => {
        this.createCard(card.title, card.tasks)
      })
    }

  }

  async save() {
    let tmpStorage = [], storageToSave = []
    this.storage.forEach(item => {
      item.tasks = item._card.tasksStorage
      storageToSave.push({title: item._card.title, tasks: item._card.tasksStorage})
      tmpStorage.push({title: item._card.title, tasks: item._card.tasksStorage, _card: item._card})
    })
    this.storage = tmpStorage
    try{
      const key = await dispatch.saveTasks(storageToSave)
      this.utils.toast.success(`Сохранено локально`)
      this.utils.toast.success(`Сохранено по адресу: ${location.getUrl()}/?id=${key}`)
    }catch (e) {
      this.utils.toast.error(e.message)
    }

    localStorage.setItem('storage', JSON.stringify(storageToSave))
    location.change(location.getUrl())
  }

  addTask() {
    this.button.remove()
    this.workplace.append(this.input.element)
    this.input.clear()
  }

  cancelTask() {
    this.workplace.append(this.button.element)
    this.input.remove()
    this.input.clear()
  }

  createCard(title, tasks = []) {
    let idx = tasks.length ? tasks[tasks.length - 1].idx : 0
    const card = new Card(title, tasks, idx, title => this.removeFromStorage(title))
    this.workplace.insertBefore(card.element, this.workplace.children[this.workplace.children.length - 1])
    this.cancelTask()
    this.storage.push({title, tasks: tasks, _card: card})
  }
  removeFromStorage(title){
   this.storage = this.storage.filter(item => item.title !== title)
  }
}

class DOM {
  constructor(tag) {
    this.element = document.createElement(tag)
  }

  addClass(cl) {
    cl.forEach(cls => {
      this.element.classList.add(cls)
    })

  }

  removeClass(cl) {
    cl.forEach(cls => {
      this.element.classList.remove(cls)
    })
  }

  remove() {
    this.element.remove()
  }
}

class Button extends DOM {
  constructor(text, cls = 'addBtn') {
    super('div')
    this.addClass(['button', cls])
    this.element.innerHTML = text
  }
}

class Input extends DOM {
  constructor() {
    super('div')
    this.element.insertAdjacentHTML('beforeend', `
      <input placeholder="Колонка" type="text"/>
      <div class="close">OK</div>`)
    this.createBtn = this.element.children[1]
    this.addClass(['inputBlock'])
  }

  clear() {
    this.value = ''
  }

  get value() {
    return this.element.children[0].value
  }

  set value(val) {
    this.element.children[0].value = val
  }

}

class Card extends DOM {
  constructor(title = 'Название', tasks, idx = 0, remove) {
    super('div')
    this.remove = remove
    this.addClass(['card'])
    this.title = title
    this.element.insertAdjacentHTML('beforeend', `
      <div class="cardControl">
        <div contenteditable="true">${this.title}</div>
        <div>&times;</div>
      </div>
     
      <div class="tasks">
      
      </div>
      <div class="addTask inputBlock">
        <input placeholder="Добавить задачу" type="text"/>
        <div class="close">OK</div>
      </div>
     `)
    this.addBtn = this.element.children[2].children[1]
    this.tasks = this.element.children[1]
    this.addBtn.addEventListener('click', this.addTask.bind(this))
    this.element.addEventListener('click', this.delTask.bind(this))
    this.element.children[0].children[0].addEventListener('input', this.changeTitle.bind(this))
    this.element.children[0].children[1].addEventListener('click', this.removeCard.bind(this))
    this.idx = idx
    this.tasksStorage = []

    if (tasks.length) {
      tasks.forEach(task => {
        this.idx = task.idx
        this.value = task.value
        this.addTask()
      })
    }
  }

  removeCard(e){
    this.element.remove()
    this.remove(this.title)
  }

  addTask() {
    if (this.value.trim() !== '') {
      this.tasks.insertAdjacentHTML('beforeend', `
      <div class="task" contenteditable="true" draggable="true" data-idx="${this.idx}">  
          ${this.value}
      <div class="del" data-delTask="${this.idx}" contenteditable="false">&times;</div>`)

      this.tasksStorage.push({idx: this.idx, value: this.value.trim()})
      this.value = ''
      this.idx++
    }
  }

  delTask(e) {
    if (e.target.dataset.deltask) {
      Array.from(this.tasks.children).forEach(task => {
        if (e.target.dataset.deltask === task.dataset.idx) {
          task.remove()
          this.tasksStorage = this.tasksStorage.filter(item => +item.idx !== +task.dataset.idx)
        }
      })
    }
  }

  changeTitle(e) {
    this.title = e.target.textContent
  }

  get value() {
    return this.element.children[2].children[0].value
  }

  set value(val) {
    this.element.children[2].children[0].value = val
  }
}