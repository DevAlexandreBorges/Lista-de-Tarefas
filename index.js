const form = document.querySelector("#todo-form");
const taskTitleInput = document.querySelector("#task-title-input");
const todoListUl = document.querySelector("#todo-list");
const currentTimeElement = document.querySelector("#current-time");

let tasks = []; // A tarefa será guardada primeira no array e depois inserida como elemento no HTML

// função de mostrar a hora atual
function updateCurrentTime() {
  const now = new Date();
  const formatterTime = now.toLocaleTimeString("pt-br", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  currentTimeElement.textContent = `Horário atual: ${formatterTime} `;
}

setInterval(updateCurrentTime, 1000); //atualiza a cada 1 segundo

updateCurrentTime();

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
      toggleSpan.style.color = "#888";
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
    span.style.color = "#888";
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

// função de checar o horario que foi inserida a tarefa

function checkAndRemoveTasks() {
  const now = new Date().getTime();

  tasks = tasks.filter((t) => {
    const verificaTime = now - t.timestamp > 24 * 60 * 60 * 1000;

    if (verificaTime) {
      document.querySelector(`li: contains${t.title}`)?.remove();
    }
    return !verificaTime;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// renderiza na tela

function renderaAllTasks() {
  todoListUl.innerHTML = "";

  tasks.forEach((t) => renderTask(t.title, t.done));
}

// ! foi substituida, ficará no código para manuntenção possivel

// window.onload = () => {
//   const getTaskfromLocal = localStorage.getItem("tasks");

//   if (!getTaskfromLocal) return;

//   tasks = JSON.parse(getTaskfromLocal);

//   tasks.forEach((t) => {
//     renderTask(t.title, t.done);
//   });
// };

form.addEventListener("submit", (event) => {
  event.preventDefault(); //evita que a página recarregue

  const taskTitle = taskTitleInput.value;

  if (taskTitle.length < 4) {
    alert(
      "Não é possível inserir uma tarefa menor que 4 letras ou enviar sem escrita...."
    );
    return; //caso não tiver o requisíto mínimo o return serve para parar o restante do script.
  }

  const now = new Date(); // adicionado para captar a data do adicionamento

  //Adiciona a tarefa no array
  tasks.push({
    title: taskTitle,
    done: false,
    timestamp: now.getTime(), // adiciona no array o horário que foi coletada a informação
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTask(taskTitle);
  taskTitleInput.value = ""; //apaga o conteúdo que estava no input
});

//substitui o antigo window.onload para conseguir tb registrar o timestamp
window.onload = () => {
  const getTaskfromLocal = localStorage.getItem("tasks");

  if (getTaskfromLocal) {
    tasks = JSON.parse(getTaskfromLocal);
    renderaAllTasks();
  }

  checkAndRemoveTasks();
  setInterval(checkAndRemoveTasks, 60 * 60 * 1000);
};
