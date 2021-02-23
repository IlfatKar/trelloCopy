

export function task(value) {
  return `
      <div class="task" contenteditable="true" draggable="true">  
          ${value}
      <div class="del" contenteditable="false">&times;</div>`
}