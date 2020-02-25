<?php
class Task extends CommonRequest
{
    function __construct($objIn = null) {
        $this->table = "task";
        parent::__construct($objIn);
    }

   /* function getAll(){

       // $sql = "SELECT $this->table.* FROM $this->table" ;

        //$result = self::$pdo->query($sql)->fetchAll();
        //var_dump($result);
    }*/

}
