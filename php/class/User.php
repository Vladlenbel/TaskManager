<?php

class User extends CommonRequest
{
    function __construct($objIn = null) {
        $this->table = "users";
        parent::__construct($objIn);
    }
    function login(){
    	$sql = "SELECT id FROM $this->table WHERE login='{$this->objIn->login}' AND password='{$this->objIn->password}'";
		$res = self::$pdo->query($sql)->fetchAll();
		if (!$res) {
			throw new Exception("Неверное имя пользователя или пароль");
		}
		return $res[0]->id;
    }
}
