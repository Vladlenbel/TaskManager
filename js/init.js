var tasks;
var pages;
var page;
var sortColumn;
var sorting;
window.onload = function() { //первоначальная загрузка страницы
	initial();
	navbarFun();
	loginNav();
	createTable();
	getTask();

};
let navbar;
function initial(){  //инициализация навбара и рабочего дива
	navbarDiv = document.createElement('div');
	navbarDiv.setAttribute("id","navbar");
	document.body.append(navbarDiv);
	workSpaceDiv = document.createElement('div');
	workSpaceDiv.setAttribute("id","workSpace");
	document.body.append(workSpaceDiv);	
}
function navbarFun(){  //заполнение навбара
	navbar = document.querySelector("#navbar");
	navbar.innerHTML = ` <form id="navbar">
	<nav class="navbar navbar-expand-lg navbar-light" style="background-color: #66CDAA;">
          <a class="navbar-brand mb-0 h3" href="#">Task Manager</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
              </ul>
              <div class="navbar-text mr-3" id = "userNameLine"></div>
              <button type="button" class="btn btn-outline-primary ml-3" /*data-toggle="modal" data-target="#login"  */id = "loginButton" >Вход</button>
          </div>
      </nav>
      </form>`;
      navbar.onclick = function(event) {
			if (event.target.matches('button') && event.target.textContent == "Вход") {
        		createLoginForm();
			}
			if (event.target.matches('button') && event.target.textContent == "Выход") {
        		logout();
			}
		}
}

function createLoginForm(){  //создание страницы логина
	
	loginForm = document.querySelector("#workSpace");
	loginForm.innerHTML = ""
	loginForm = document.createElement('div');
	loginForm.className = "col-sm-7 mt-5";
	loginForm.setAttribute("style", "margin:auto");
	loginForm.innerHTML = `<form  id = "loginForm">     
    <div class="form-group row">
        <label class="col-sm-2 col-form-label"> <h3>Логин: </h3></label>
        <div class="col-sm-6" id = "divLoginInput">
            <input class="form-control" required placeholder="Логин" id="login" name = "login">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-2 col-form-label"> <h3>Пароль:</h3></label>
        <div class="col-sm-6" id = "divPasswordInput">
            <input class="form-control " required placeholder="Пароль" id="password">
        </div>
    </div>
    <div class="form-group row">
        <div class="col-sm-6">
        </div> 
        <div class="col-sm-2">
           <button type="button" class="btn btn-primary btn-lg btn-block" style="float: right;">Вход</button>
        </div>             
</form>`;
workSpaceDiv.append(loginForm);

  loginForm.onclick = function(event) {
    if (event.target.matches('button') && event.target.textContent == "Вход") {
      var form= document.getElementById("loginForm");
      login({
        req: {
          login: form.elements.login.value,
          password: md5(form.elements.password.value)
        }
      });
    }
  }
}


function createTable(){ //создание заголовка таблицы и модального окна для изменения заданий

	table = document.createElement('div');
	table.className ="col-sm-8 mt-5";
  table.setAttribute("id", "tabliDiv");
	table.setAttribute("style", "margin:auto");
	table.innerHTML = `<table class="table" id = "tableTask">  </table>

  <div class="modal fade" id="changeInfoTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Изменить задание</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id = "changeTaskForm">
          <div class="form-group" id = "textTaslDiv">
            <label for="message-text" class="col-form-label">Задание:</label>
            <textarea class="form-control" id="textTaskChange"></textarea>
          </div>
          <div class="form-group" id = "isCompletedlDiv">
            <div class="custom-control custom-checkbox">
               <input type="checkbox" class="custom-control-input" id="isCompletedCheck">
               <label class="custom-control-label" for="isCompletedCheck">Выполнено </label>
            </div>
          </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
          <button type="button" class="btn btn-primary" >Изменить</button>
        </div>
          </div>
      </form>
    </div>
  </div>
</div>`;
  
workSpaceDiv.append(table);

tableHead = document.createElement('thead');
    tableHead.className = "thead-dark";

    trHead = document.createElement("TR");
			th = document.createElement("th");
			th.setAttribute("scope","col");
			th.innerHTML = "#";
		trHead.appendChild(th);

    th = document.createElement("th");
    th.setAttribute("scope","col");
    th.innerHTML = "Текст задачи";
    trHead.appendChild(th);

    th = document.createElement("th");
    th.setAttribute("style"," padding: .4rem;");
      button = document.createElement('button');
      button.setAttribute("type","button");
      button.setAttribute("style"," width: 100%;  border-radius: unset; ");
      button.className = "btn btn-dark";
      button.setAttribute("id","username");
    button.textContent = "Имя пользователя";
    th.appendChild(button);
    trHead.appendChild(th);

    th = document.createElement("th");
    th.setAttribute("style"," padding: .4rem;");
      button = document.createElement('button');
      button.setAttribute("type","button");
      button.setAttribute("style"," width: 100%;  border-radius: unset;");
      button.className = "btn btn-dark ";
      button.setAttribute("id","email");
    button.textContent = "Email";
    th.appendChild(button);  
    trHead.appendChild(th);

    th = document.createElement("th");
    th.setAttribute("style"," padding: .4rem;");
      button = document.createElement('button');
      button.setAttribute("type","button");
      button.setAttribute("style"," width: 100%;  border-radius: unset;");
      button.className = "btn btn-dark ";
      button.setAttribute("id","isCompleted");
      button.textContent = "Выполнено";
    th.appendChild(button);  
    trHead.appendChild(th);

		if(getCookie("login")){
		th = document.createElement("th");
		th.setAttribute("scope","col");
		th.innerHTML = "Отредактировано";
		trHead.appendChild(th);
	}
	tableHead.append(trHead)
	tableTask.append(tableHead);

  var tableDiv = document.getElementById("tabliDiv");
  tabliDiv.onclick = function(event){         //обработка события для сортировки
    if (event.target.matches('button')){
      if (sorting == undefined){
        sorting = "ASC";
      }else if (sortColumn == event.target.id){
        if(sorting == "ASC"){
          sorting = "DESC";
        }else{
          sorting = "ASC";
        }
      }else{
        sorting = "ASC";
      } 

      sortColumn = event.target.id;
      getTask({
          req: {
            orderBy: (sortColumn || "username") + " " +sorting,
            page: (page || 1)
          }
        });
    }
  }
    

  paginationAndAddTaskButton();
}




function paginationAndAddTaskButton(){      //добавления дива с пагинацией и кнопкой добавления задания
	pagination = document.createElement('div');
	pagination.className ="col-sm-8 mt-5";
	pagination.setAttribute("style", "margin:auto");
	pagination.innerHTML = ` 
	<div class="form-group row">
	<div class="col-sm-6" id = "pagination">
		<form id = "paginationForm">
    </form>
    </div>
	<div class="col-sm-6">

		<button type="button" class="btn btn-outline-success col-sm-4" data-toggle="modal" data-target="#createTask" style="float: right">Создать задачу</button>

	</div>
	</div>

	<div class="modal fade" id="createTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Новое задание</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id = "createTaskForm">
          <div class="form-group"  id = "usernameDiv">
            <label for="recipient-name" class="col-form-label">Имя пользователя:</label>
            <input type="text" class="form-control" id="usernameInput">
          </div>
          <div class="form-group" id = "emailDiv">
            <label for="recipient-name" class="col-form-label">Email:</label>
            <input type="text" class="form-control" id="emilInput">
          </div>
          <div class="form-group" id = "textTaslDiv">
            <label for="message-text" class="col-form-label">Задание:</label>
            <textarea class="form-control" id="textTask"></textarea>
          </div>


        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
          <button type="button" class="btn btn-primary" id = "addTask">Добавить</button>
        </div>
          </div>
      </form>
    </div>
  </div>
</div>`;

$('#createTask').on('shown.bs.modal', function () {
            	$('#createTask').trigger('focus');
			})
	workSpaceDiv.append(pagination);
  var formCreate = document.getElementById("createTaskForm");

  formCreate.onclick = function(event) {
        if (event.target.matches('button') && event.target.textContent == "Добавить") { //отслеживание собывтия модального окна для добавления задачи
          var wrong = false;
            if(formCreate.elements.usernameInput.value.length == 0){
              emptyUsernameInput();
              wrong = true;
            }
            if(!validate(formCreate.elements.emilInput.value)){
              wrongEmail();
              wrong = true;
            }
            if(formCreate.elements.textTask.value.length == 0){
              emptyTaskTextInput("textTask");
              wrong = true;
            }
            if(!wrong){
              addTask({
                req: {
                  text: formCreate.elements.textTask.value,
                  username: formCreate.elements.usernameInput.value,
                  email: formCreate.elements.emilInput.value
                }
              });
            }        
        }
      }
}

function emptyUsernameInput(idUsernameInput){  //изменение стиля поля ввода при неккорктных данных
  if(!document.getElementById("usernameMessageError")){
    var usernameInput = document.getElementById(idUsernameInput);
    usernameInput.textContent = "";
    var classNameEmail = "form-control ";
      classNameEmail +="is-invalid";

      var usernameMessageError = document.createElement('div');
      usernameMessageError.className = "invalid-feedback";
      usernameMessageError.setAttribute("id", "usernameMessageError");
      usernameMessageError.textContent = "Имя пользователя не может быть пустым";
    
    usernameInput.className = classNameEmail;

    createTaskForm.querySelector("#"+idUsernameInput).append(usernameMessageError);
    var username = document.querySelector("#usernameInput");
      username.oninput = function (ev) {
          $('#usernameMessageError').hide();
          username.classList.remove('is-invalid');
      }
  }
}

function wrongEmail(idEmail){ //изменение стиля поля ввода при неккорктных данных
  if(!document.getElementById("emailMessageError")){
    var emilInput = document.getElementById(idEmail);
    emilInput.textContent = "";
    var classNameEmail = "form-control ";
      classNameEmail +="is-invalid";

      var emailMessageError = document.createElement('div');
      emailMessageError.setAttribute ("id", "emailMessageError");
      emailMessageError.className = "invalid-feedback";
      emailMessageError.setAttribute("id", "emailMessageError");
      emailMessageError.textContent = "Введите корректный e-mail";
       emilInput.className = classNameEmail;

    createTaskForm.querySelector("#"+idEmail).append(emailMessageError);

    var email = document.querySelector("#emilInput");
      email.oninput = function (ev) {
          $('#emailMessageError').hide();
          email.classList.remove('is-invalid');
      }
  }
}

function emptyTaskTextInput(idInputText){ //изменение стиля поля ввода при неккорктных данных 
  if(!document.getElementById("taskTextMessageError")){
    var taskTextInput = document.getElementById(idInputText);
    taskTextInput.textContent = "";
    var classNameEmail = "form-control ";
      classNameEmail +="is-invalid";

      var taskTextMessageError = document.createElement('div');
      taskTextMessageError.className = "invalid-feedback";
      taskTextMessageError.setAttribute("id", "taskTextMessageError");
      taskTextMessageError.textContent = "Текст задания не может быть пустым";
    
    taskTextInput.className = classNameEmail;

    createTaskForm.querySelector("#textTaslDiv").append(taskTextMessageError);
    var username = document.querySelector("#"+idInputText);
      username.oninput = function (ev) {
          $('#taskTextMessageError').hide();
          username.classList.remove('is-invalid');
      }
  }
}



this.addTask  = function (options) { //добавление задания
   $('#createTask').modal('hide');
      $.ajax({
        type: "POST",
        url: "http://localhost/taskManager/php/api/task/add",
        data: JSON.stringify(options.req),
        dataType: 'json',
        async: true,
        success: function (response) {
          if (checkResponse(response, true)) {
            $('#createTask').modal("hide");
            getTask();
            clearAddTaskModal();
          } else {
            alert(response.error.message);
          }
        },     
        error: function (response) {
          alert(response.error.message);
          }
      });
  }

function clearAddTaskModal(){  //очистка модального окна после успешной отправки на сервер
  document.getElementById('usernameInput').value = '';
  document.getElementById('emilInput').value = '';
  document.getElementById('textTask').value = '';
}

  this.changeTask  = function (options) {  //изменение задания 
   $('#changeInfoTask').modal('hide');
      $.ajax({
        type: "POST",
        url: "http://localhost/taskManager/php/api/task/change",
        data: JSON.stringify(options.req),
        dataType: 'json',
        async: true,
        success: function (response) {
          if (checkResponse(response, true)) {
            getTask();
          } else {
            alert(response.error.message);
          }
        },     
        error: function (response) {
          alert(response.error.message);
          }
      });
  }


this.login = function (options) { //вход (отправление данных на сервер)
    options = options || {
      mode: "cookie",
      req: {
        login: (document.getCookie("login") || ""),
        password: (document.getCookie("password") || "")
      }
    };
      $.ajax({
        type: "POST",
        url: "http://localhost/taskManager/php/api/user/login",
        data: JSON.stringify(options.req),
        dataType: 'json',
        async: true,
        success: function (response) {
          if (checkResponse(response, true)) {
          	loginNav(options.req.login);
          	document.cookie = encodeURIComponent("login") + '=' + encodeURIComponent(options.req.login);
          	document.cookie = encodeURIComponent("password") + '=' + encodeURIComponent(options.req.password);
          	window.location.href = "http://localhost/taskManager/";
          } else {
            alert(response.error.message);
          }
        },     
        error: function (response) {
        	alert(response.error.message);
        	}
      });
  }

 function loginNav(){ //изменение навбара после успешного логина
  if(getCookie("login")){
    var username = document.querySelector("#userNameLine");
    username.textContent = getCookie("login");

    var loginButton = document.querySelector("#loginButton");
    loginButton.textContent = "Выход";
  }
} 

this.logout = function (options) {  //выход из администратора
	deleteCookie();
      $.ajax({
        type: "POST",
        url: "http://localhost/taskManager/php/api/user/logout",
        dataType: 'json',
        async: true,
        success: function (response) {
          	window.location.href = "http://localhost/taskManager/";
            alert(response.error.message);
        },     
        error: function (response) {
        	alert(response.error.message);
        	}
      });
  }


function createBodyTable(tasksInfo){  //создание тела таблицы

  if (!document.getElementById("taskTableBody")){
    bodyTable = document.createElement('tbody');
    bodyTable.setAttribute("id","taskTableBody");
  }else{
    bodyTable = document.getElementById("taskTableBody");
    bodyTable.innerHTML = "";
  }

	tasksInfo.forEach(function(task) {
		tr = document.createElement("TR");
    tr.setAttribute("id", task.id);
			th1 = document.createElement("th");
      th1.setAttribute("id", task.id);
			th1.setAttribute("scope","row");
			th1.innerHTML = task.id;
		tr.appendChild(th1);
		th2 = document.createElement("th");
    th2.setAttribute("id", task.id);
			th2.innerHTML = task.text;
		tr.appendChild(th2);
		th3 = document.createElement("th");
    th3.setAttribute("id", task.id);
			th3.innerHTML = task.username;
		tr.appendChild(th3);
		th4 = document.createElement("th");
			th4.innerHTML = task.email;
      th4.setAttribute("id", task.id);
		tr.appendChild(th4);
		th5 = document.createElement("th");
    th5.setAttribute("id", task.id);
    var lineIsCompleted = "<div class=\"custom-control custom-checkbox\">"+ 
      "<input type=\"checkbox\" class=\"custom-control-input\" id=\"isCompleted"+task.id+"\"";
			 if(task.isCompleted == 1){
        lineIsCompleted += "checked";
       }
          lineIsCompleted += " disabled";
       
       lineIsCompleted +="><label class=\"custom-control-label\" for=\"isCompleted"+task.id+"\"></label><\div>";
       th5.innerHTML =  lineIsCompleted;
		tr.appendChild(th5);
		if(getCookie("login")){
		th6 = document.createElement("th");
    th6.setAttribute("id", task.id);
    var lineIsChanged ="<div class=\"custom-control custom-checkbox\">"+ 
      "<input type=\"checkbox\" class=\"custom-control-input\" id=\"isChanged"+task.id+"\"";
      if(task.isChanged == 1){
        lineIsChanged += " checked";
       }
        lineIsChanged += " disabled"; 
        lineIsChanged += ">"+
			 "<label class=\"custom-control-label\" for=\"isChanged"+task.id+"\"></label><\div>";
        th6.innerHTML = lineIsChanged;
		tr.appendChild(th6);
	}
		bodyTable.append(tr);

	});
	tableTask.append(bodyTable);

  var formChange = document.getElementById("changeTaskForm");

  var taskTable = document.getElementById("taskTableBody");
    taskTable.ondblclick = function(event){     //отслеживание двойго клика по таблице для изменения задачи
      $('#changeInfoTask').modal('show');
      var formChange = document.getElementById("changeTaskForm");
      for (var indexTask = 0; indexTask < task.length; indexTask++) {
        if (task[indexTask].id == event.target.id){
          selectedTask = task[indexTask]
          break;
        }
      };
      formChange.textTaskChange.value = selectedTask.text;
      if (selectedTask.isCompleted == 1){
        formChange.isCompletedCheck.checked = true;
      }else{
        formChange.isCompletedCheck.checked = false;
      }
  }

  formChange.onclick = function(event) { //сбор данных формы
        if (event.target.matches('button') && event.target.textContent == "Изменить") {
          var wrong = false;
            if(formChange.elements.textTaskChange.value.length == 0){
              emptyTaskTextInput("textTaskChange");
              wrong = true;
            }
            if(!wrong){
              if(!(selectedTask.text == formChange.elements.textTaskChange.value)){
                selectedTask.isChanged = 1;
              }
              if (formChange.isCompletedCheck.checked){
                selectedTask.isCompleted = 1;
              }else{
                 selectedTask.isCompleted = 0;
              }
              changeTask({
                req:selectedTask
              });
            }        
        }
      }
}

function getTask(options) { //получение задач с сервера по заданным параметрам
  console.log(options);
    options = options || {
      req: {
        page : (page|| 1)
      }
    };
    console.log(options.req);
      $.ajax({
        type: "POST",
        url: "http://localhost/taskManager/php/api/task/getAll",
        data: JSON.stringify(options.req),
        dataType: 'json',
        async: true,
        success: function (response) {
          if (checkResponse(response, true)) {
          	createBodyTable(response.getAll);
            task = response.getAll;
            pages = response.pages;
            page = response.page;
          	if (response.pages > 1){
               createPagination();
          	}
          } else {

            alert(response.error.message);
          }
        },     
        error: function (response) {
        	alert(response.error.message);
        	}
      });
  }

function getCookie(name) { 
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(){
	 var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
function validate(email) { //валидация email
   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   if(reg.test(email) == false) {
      return false;
   }
   return true;
}

function createPagination(pagesCount){  //создание блока пагинации
  if (pages > 1 ){
    if (!document.getElementById("paginationDiv")){
      formPag = document.getElementById("paginationForm");
      paginationMenu = document.createElement("div");  
      paginationMenu.setAttribute("id", "paginationDiv")
      paginationMenu.innerHTML = `<nav aria-label="Page navigation example" style="float: left;">
            <ul class="pagination" id = "paginationUl">
            </ul>
          </nav>`;
      formPag.append(paginationMenu);
    }else{
      paginationUl = document.getElementById("paginationUl");
      paginationUl.innerHTML = "";
    }
        li = document.createElement("li");
        li.className = "page-item";
        li.innerHTML = "<button type=\"button\" class=\"btn btn-light\" id = \"Previous\">Предыдущая</button>";
        paginationUl.append(li);
          if (page == 1){
            for (countPagePag = 1; countPagePag <= 3; countPagePag++){
              if (countPagePag <= pages){
               li = document.createElement("li");
               li.className = "page-item";
               liText =   "<button type=\"button\" class=\"btn btn-light";
               if (countPagePag == page ){
                liText += " active"
                }
                 liText += "\" id = \""+countPagePag+"\">"+countPagePag+"</button>";
                  li.innerHTML = liText; 
                  paginationUl.append(li);
              }
            }
          }else if(page == pages){
            for (countPagePag = page-2; countPagePag <= pages; countPagePag++){
              if (countPagePag!= 0){
               li = document.createElement("li");
               li.className = "page-item";
               liText =   "<button type=\"button\" class=\"btn btn-light";
               if (countPagePag == page ){
                liText += " active";
                }
                 liText += "\" id = \""+countPagePag+"\">"+countPagePag+"</button>";
                  li.innerHTML = liText;
                  paginationUl.append(li); 
              }
            }
          }else{

            for (countPagePag = parseInt(page)-1; countPagePag <= (parseInt(page)+1); countPagePag++){

             li = document.createElement("li");
             li.className = "page-item";
             liText =   "<button type=\"button\" class=\"btn btn-light";
              if (countPagePag == page ){
                liText += " active";
               
              }
               liText += "\" id = \""+countPagePag+"\">"+countPagePag+"</button>";
                li.innerHTML = liText; 
                paginationUl.append(li);
            }
          }        
         paginationUl.append(li);
        li = document.createElement("li");
        li.className = "page-item";
        li.innerHTML = "<button type=\"button\" class=\"btn btn-light\" id = \"Next\">Следущая</button>";
        paginationUl.append(li);

        
        formPag.onclick = function(event) {
            if (event.target.matches('button')) {
              if (event.target.id == "Previous"){
               if (parseInt(page) != 1){
                page = parseInt(page) - 1;
               }
              }else if((event.target.id == "Next")) {
                if (page != parseInt(pages)){
                page = parseInt(page) + 1;
               }
              }else{
                page = event.target.id;
               }
              for (var i = 0; i < formPag.elements.length; i++) {
                formPag.elements[i].className = "btn btn-light";
              }
              event.target.className = "btn btn-light active";
              getTask({
                    req: {
                      page: page
                    }
                  });
            }
          }
  }
}

this.checkResponse = function(response, hidden) { //проверка успешного ответа от сервера
    if (response.code && response.code != "200") {
      //cash.wait("hide");
      if (!hidden) {
        cash.wait("hide");
        divModal.querySelector('.modal-title').textContent = "Ошибка";
        divModal.querySelector('.modal-body').textContent = response.error.message;
        $(divModal).modal("show");
      }
      return false;
    }
    return true;
  }