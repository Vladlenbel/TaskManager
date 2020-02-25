<?php
ini_set('max_execution_time', 300);
session_start();
header("Content-Type: application/json; charset=utf-8");
date_default_timezone_set('Europe/Minsk');
ini_set("default_charset", "UTF-8");
mb_http_output("UTF-8");
mb_http_input("UTF-8");
mb_regex_encoding("UTF-8");
mb_internal_encoding("UTF-8");
bcscale(2);

set_exception_handler('exception_handler');

error_reporting(E_ALL);
//set_error_handler('error_handler');
//error_reporting(0);

function __autoload($class) {
     include_once 'class/'.$class.'.php';
}

///////////////////////////////////////
function exception_handler(\Throwable $exception) {
    View::displayException($exception);   
}

function error_handler($errNo, $errStr, $errFile, $errLine) {
    switch ($errNo) {
        case E_WARNING:
            $errMsg = "Warning: ".$errStr." Файл: ".$errFile." Строка: ".$errLine;
            throw new Exception($errMsg, $errNo);
            break;
        case E_NOTICE:
            $errMsg = "Notice: ".$errStr." Файл: ".$errFile." Строка: ".$errLine;
            throw new Exception($errMsg, $errNo);
            break;
        default:
            $errMsg = $errStr." Файл: ".$errFile." Строка: ".$errLine;
            throw new Exception($errMsg, $errNo);
            break;
    }
}

$controller = new Controller();//var_dump($controller);
$controller->process();

    
?>