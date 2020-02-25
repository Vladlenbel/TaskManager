<?php

class Config
{
    const FILELOG = true;
    const HOST = 'localhost'; // адрес сервера
    const USER_MYSQL = ''; // имя пользователя
    const PASSWORD_MYSQL = ''; // пароль
    const CURL_TIMEOUT = 40;
    const DSN_PG = "mysql:host=localhost;port=3306;dbname=task_manager";
    const CMD_WITHOUT_AUTH = Array(
        "user/login//",
         "task/getAll//",
         "task/add//"
    );


    static $userId;

    static $controller;

    static function toSqlFormat($value) {
        if (is_string($value)) {
            return "'$value'";
        } elseif (is_bool($value)) {
            return (int)$value."::boolean";
        } elseif (is_null($value)) {
            return 'NULL';
        } else {
            return $value;
        }
    }

    static  function fromCamelCase($arrObj) {
        if (is_string($arrObj)) {
            return preg_replace_callback('/([A-Z])/', function($matches){return "_".strtolower($matches[1]);}, $arrObj);
        }
        if (!is_array($arrObj)) {
            $arrObj = Array($arrObj);
        }
        foreach($arrObj as $obj) {
            foreach ($obj as $key => $value) {
                if (is_array($value) || is_object($value)) {
                    $value = self::fromCamelCase($value);
                } elseif (preg_match('/[A-Z]/',$key)) {
                    unset($obj->$key);
                    $key = preg_replace_callback('/([A-Z])/', function($matches){return "_".strtolower($matches[1]);}, $key);
                    $obj->$key = $value;
                }
            }
        }
        return $arrObj;
    }
}