<?php
class Model extends Config{
	protected static $pdo;
	protected $result;
	protected $objIn;

	function __construct($objIn = null) {
		if(!isset(self::$pdo)){
			$opt = array(
				PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
				PDO::ATTR_EMULATE_PREPARES	 => 1
			);
			self::$pdo = new PDO(Config::DSN_PG, Config::USER_MYSQL, Config::PASSWORD_MYSQL, $opt);
		}
		$this->objIn = $objIn;
	}


}