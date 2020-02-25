<?php

class Controller extends Config
{

    private $error;
    private $cmd;
    private $subCmd;
    private $param;
    private $jsonIn;
    private $jsonOut;

    function __construct() {
        $this->error = false;
        $this->timeStartAll = microtime(true);
        $this->timeStartCore = 0;
        $this->jsonOut = new stdClass();
        self::$controller = $this;

    }

    function processingRequest()
    {
        if ($this->cmd == "user") {
            $user = new User($this->jsonIn);
            if ($this->subCmd == "login" && !isset($this->param)) {
                //УДАЛЕНИЕ ПРЕДЫДУЩЕЙ СЕССИИ
                session_unset();
                session_destroy();
                session_start();

                    $userId = $user->login($this->jsonIn);
                    $users = $user->getById($userId);
                    $this->jsonOut->users = $users;
                //ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ СЕССИИ
                $_SESSION["userId"] = $this->jsonOut->users[0]->id;
            } elseif ($this->subCmd == "logout" && !isset($this->param)) {
                session_unset();
                session_destroy();
                unset($_SESSION);
            } elseif ($this->subCmd == "getById" && !isset($this->param)) {
                $this->jsonOut->fileList = $user->getFileListDiscountCards($this->jsonIn);
            } elseif ($this->subCmd == "registaration" && !isset($this->param)) {
                $this->jsonOut->fileList = $user->getFileListDiscountCards($this->jsonIn);
            } else {
                throw new Exception("Отсутствует обработчик запроса " . $_SERVER['REQUEST_URI']);
            }

        } elseif($this->cmd == "task"){
            $task = new Task($this->jsonIn);
            if ($this->subCmd == "add" && !isset($this->param)) {
                $task->add($this->jsonIn);
            } elseif ($this->subCmd == "change" && !isset($this->param)) {
                $task->change($this->jsonIn);
            } elseif ($this->subCmd == "getAll" && !isset($this->param)) {
                $this->jsonOut->{$this->subCmd} = $task->getAll($this->jsonIn);
                $this->jsonOut->pages = (new Task())->getCountPages();
                    if(!isset($this->jsonIn->page)){
                        $this->jsonOut->page = 1;
                    }else{
                        $this->jsonOut->page = ($this->jsonIn->page);
                    }
            } else {
                throw new Exception("Отсутствует обработчик запроса " . $_SERVER['REQUEST_URI']);
            }

        } else {
            throw new Exception("Отсутствует обработчик запроса ".$_SERVER['REQUEST_URI']);
        }

    }

    function process() {
    
        //РАЗБИРАЕМ СТРОКУ ЗАПРОСА
        if (isset($_GET['cmd'])) 		$this->cmd = str_replace('/', '', $_GET['cmd']);
        if (isset($_GET['subcmd']))		$this->subCmd = str_replace('/', '', $_GET['subcmd']);
        if (isset($_GET['param']))  	$this->param = str_replace('/', '', $_GET['param']);

        //ЧИТАЕМ ВХОДНОЙ JSON
        $inputString = file_get_contents('php://input');
        if($inputString !== "") {
            $this->jsonIn = json_decode($inputString, false, 512, JSON_BIGINT_AS_STRING);
        }
        if (json_last_error()) {
            $errorCode = json_last_error();
            $errorMessage = "Ошибка в структуре входного JSON: ".json_last_error_msg();
            throw new Exception($errorMessage, $errorCode);
        }

        //ПРОВЕРЯЕМ ЕСТЬ ЛИ АВТОРИЗАЦИЯ И МОЖНО ЛИ ВЫПОЛНИТЬ КОМАНДУ БЕЗ АВТОРИЗАЦИИ
        if (isset($_SESSION["userId"])) {
            self::$userId = $_SESSION["userId"];

        } elseif (!in_array("$this->cmd/$this->subCmd/$this->param/", Config::CMD_WITHOUT_AUTH)) {
            throw new Exception("Сеанс работы истек. Войдите в систему заново");
        }

        //ОБРАБОТКА ЗАПРОСА
        $this->processingRequest();

        //ОТВЕТ КЛИЕНТУ
        if ($this->error) {
            View::displayError($this->errorMessage);
        } else {
            if ($this->jsonOut) {
                View::displayResponse($this->jsonOut);
            } else {
                View::displayDefault();
            }
        }
    }

}