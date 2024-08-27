const form = document.querySelector("#todo-form");
const taskTitleInput = document.querySelector("#task-title-input");
const todoListUl = document.querySelector("#todo-list");

let tasks = []; // A tarefa será guardada primeira no array e depois inserida como elemento no HTML
function renderTask(taskTitle, done = false) {
  const li = document.createElement("li");
  // adiciona o array para ser um elemento HMTL, no caso um li

  const input = document.createElement("input"); //criou u <input vazio
  input.setAttribute("type", "checkbox");
  input.addEventListener("change", (event) => {
    const toggleLi = event.target.parentElement;
    const done = event.target.checked;
    const toggleSpan = toggleLi.querySelector("span");

    if (done) {
      toggleSpan.style.textDecoration = "line-through";
      toggleSpan.style.color = "#999";
      // alert("Parabéns por ter concluido sua Tarefa Diária!!!!!!");
    } else {
      toggleSpan.style.textDecoration = "none";
      toggleSpan.style.color = "#111";
    }

    tasks = tasks.map((t) => {
      if (t.title === toggleSpan.textContent) {
        return {
          title: t.title,
          done: !t.done,
        };
      }
      return t;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  input.checked = done;

  const span = document.createElement("span");
  span.textContent = taskTitle;

  if (done) {
    span.style.textDecoration = "line-through";
    span.style.color = "#999";
    // alert("Parabens por ter concluido sua Tarefa Diária!!!!!!");
  }

  const button = document.createElement("button");
  button.textContent = "Remover";
  button.style.backgroundColor = "red";
  //função que remmove  e apaga do array de objetos a tarefa
  button.addEventListener("click", (event) => {
    const removeLi = event.target.parentElement;
    const removeTask = removeLi.querySelector("span").textContent;

    tasks = tasks.filter((t) => t.title !== removeTask);

    todoListUl.removeChild(removeLi);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  li.appendChild(span);
  li.appendChild(input);
  li.appendChild(button);

  todoListUl.appendChild(li);
}

window.onload = () => {
  const getTaskfromLocal = localStorage.getItem("tasks");

  if (!getTaskfromLocal) return;

  tasks = JSON.parse(getTaskfromLocal);

  tasks.forEach((t) => {
    renderTask(t.title, t.done);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault(); //evita que a página recarregue

  const taskTitle = taskTitleInput.value;

  if (taskTitle.length < 4) {
    alert("Sua tarefa precisa ter, pelo menos 4 letras..");
    return; //caso não tiver o requisíto mínimo o return serve para parar o restante do script.
  }

  //Adiciona a tarefa no array
  tasks.push({
    title: taskTitle,
    done: false,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTask(taskTitle);
  taskTitleInput.value = ""; //apaga o conteúdo que estava no input
});
