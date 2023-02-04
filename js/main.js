"use strict";

const tasks = []; //almacenamos las tareas
let time = 0; //cuenta regresiva
let timer = null;
let timerBreak = null; //descanso
let current = null; //tarea actual que se esta ejecutando

const taskName = document.querySelector("#time #taskName");
const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");

renderTime();
renderTasks();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask.value != "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    //el 36 es la base a la que va a pasar el numero, si pongo 2 me lo convierte a binario, y el slice para borrar los ultimos 3 caracteres raros
    id: (Math.random() * 100).toString(36).slice(3),
    title: value,
    completed: false,
  };
  tasks.unshift(newTask);
}

function renderTasks() {
  const html = tasks.map((task) => {
    return `
            <div class="task">
                <div class="completed">${
                  task.completed
                    ? `<span class="done">Done</span>`
                    : `<button class="start-button" data-id="${task.id}">Start</button>`
                }</div>
                <div class="title">${task.title}</div>
            </div>    
        `;
  });
  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join(" ");

  const startButtons = document.querySelectorAll(".task .start-button");
  startButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!timer) {
        const id = button.getAttribute("data-id");
        startButtonsHandler(id);
        button.className = 'inProgress';
        button.textContent = "In progress...";
      }
    });
  });
}

function startButtonsHandler(id) {
  time = 25 * 60;
  current = id;
  const taskIndex = tasks.findIndex((task) => task.id == id);
  taskName.textContent = tasks[taskIndex].title;

  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

function timerHandler(id) {
  time--;
  renderTime();

  if (time == 0) {
    clearInterval(timer);
    markCompleted(id);
    timer = null;

    renderTasks();
    startBreak();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id == id);
  tasks[taskIndex].completed = true;
  renderTasks();
}

function startBreak() {
  time = 5 * 60;
  taskName.textContent = "Break";
  timerBreak = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();

  if (time == 0) {
    clearInterval(timerBreak);
    current = null;
    timerBreak = null;
    taskName.textContent = '';
    renderTasks();
  }
}
