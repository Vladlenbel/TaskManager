<?php
class CommonRequest extends Model {
 
 protected $jsonStringKey = Array();
 protected $jsonLeftJoin = Array();
 protected $keyArray;
    
    function __construct($objIn = null) {
        parent::__construct($objIn);
        $this->getKeyArrays();
    }

   function getById($id){
         $getByIdSql = "SELECT * FROM $this->table where id = $id";
        return self::$pdo->query($getByIdSql)->fetchAll();
    }

    function getByField($jsonIn){

    }

    function getAll($jsonIn = null){
        if (!isset($jsonIn)){
            $jsonIn = new stdClass;
            $jsonIn->orderBy = "id";
            $jsonIn->page = 1;  
        }
        if (!isset($jsonIn->orderBy)){
            $jsonIn->orderBy = "id";
        }
        if (!isset($jsonIn->page)){
            $jsonIn->page = 1;  
        }
        $page = ($jsonIn->page - 1)*3;

        $sql = "SELECT $this->table.*".(count($this->keyArray) != 0 ? ',':'').implode(",",$this->jsonStringKey).
        " FROM $this->table ".implode(" ",$this->jsonLeftJoin)." ORDER BY $this->table.$jsonIn->orderBy LIMIT 3 OFFSET $page" ;
        $result = self::$pdo->query($sql)->fetchAll();
        if (!$result) {
            $result = array();
        }
        return $result;

    }

    protected function getKeyArrays(){ //получение таблиц поля данной таблицы являются внешним ключем
        $sqlInfoColum = "SELECT ke.referenced_table_name parentTable, 
                                ke.REFERENCED_COLUMN_NAME column_name,
                                ke.table_name table_name_key, 
                                ke.COLUMN_NAME column_name_key 
                                FROM information_schema.KEY_COLUMN_USAGE ke
                                WHERE
                                  ke.referenced_table_name IS NOT NULL
                                  AND ke.referenced_table_name = '$this->table'
                                ORDER BY
                                  ke.referenced_table_name;";
            unset($_SESSION);
            if(isset($_SESSION["$sqlInfoColum"])){
                $this->keyArray = $_SESSION["$sqlInfoColum"];

            }else{
                $this->keyArray = self::$pdo->query($sqlInfoColum)->fetchAll();
                $_SESSION["$sqlInfoColum"] = $this->keyArray;
            }
        $i = 0; 
        foreach ($this->keyArray as $key) {
            $i++;
            $this->jsonStringKey[] = " {$key->table_name_key}_{$i}.*";
            $this->jsonLeftJoin[] = " LEFT JOIN $key->table_name_key as {$key->table_name_key}_{$i} ON $this->table.$key->column_name = {$key->table_name_key}_{$i}.$key->column_name_key ";
        }  
    }


    function add($jsonIn){
        $arrKey = Array();
        $arrVal = Array();
         

        foreach ($jsonIn as $key => $value) {
            $arrKey[] = $key;
            $sqlGetType = "SELECT DATA_TYPE as data_type FROM information_schema.COLUMNS where TABLE_NAME='$this->table' AND COLUMN_NAME='$key'";
                    if(isset($_SESSION["$sqlGetType"])){
                        $typeField = $_SESSION["$sqlGetType"];
                    }else{
                        $typeField = self::$pdo->query($sqlGetType)->fetchAll();
                        $_SESSION["$sqlGetType"] = $typeField;
                    }   
            switch ($typeField[0]->data_type) {
                    case "text";
                    case "varchar";
                        if($value === null || $value == null || $value == ""  || $value == "null"){
                            $arrVal[] = 'NULL';
                            break;
                        }               
                        $arrVal[] = '"'.((is_object($value)) ? $value->id : $value).'"'; //не требуется перевоада в sqlFormat из-за наличия кавычек
                        break;
                    case "boolean":
                            $arrVal[] = self::toSqlFormat($value);
                            break;
                    case "integer":
                            if( $value === "" ){
                                $arrVal[] = 'NULL';
                                break;
                            }
                            $arrVal[] = (is_object($value)) ? self::toSqlFormat($value->id) : self::toSqlFormat($value); 
                            break;          
                    default:
                        if($value === null || $value == null || $value == ""  || $value == "null"){
                            $arrVal[] = 'NULL';
                            break;
                        }               
                        $arrVal[] = (is_object($value)) ? self::toSqlFormat($value->id) : self::toSqlFormat($value);
                        break;
                }
            }
            $sql = "INSERT INTO $this->table (`".implode('`,`',$arrKey)."`) 
                VALUES (".implode(",",$arrVal).")";
            $res = self::$pdo->query($sql);

    }

    function change($jsonIn){
        $arrVal = Array();
        $updateString = "";
        foreach ($jsonIn as $key => $value) {
            if (!is_array($value) && $key != "id"){ //получение типа поля для правильной работы с ним
                 $sqlGetType = "SELECT DATA_TYPE as data_type FROM information_schema.COLUMNS where TABLE_NAME='$this->table' AND COLUMN_NAME='$key'";
                    if(isset($_SESSION["$sqlGetType"])){
                        $typeField = $_SESSION["$sqlGetType"];
                    }else{
                        $typeField = self::$pdo->query($sqlGetType)->fetchAll();
                        $_SESSION["$sqlGetType"] = $typeField;
                    }                               
                switch ($typeField[0]->data_type) {
                    case "text";
                    case "varchar";
                        if($value === null || $value == null || $value == ""  || $value == "null"){
                            $arrVal[] = "$key=".'NULL';
                            break;
                        }               
                        $arrVal[] = "$key="."'".((is_object($value)) ? $value->id : $value)."'"; //не требуется перевоада в sqlFormat из-за наличия кавычек
                        break;
                    case "boolean":
                    case "tinyint":

                            $arrVal[] = "$key=".$value;
                            break;
                    case "integer":
                            if( $value === "" ){
                                $arrVal[] = "$key=".'NULL';
                                break;
                            }
                            $arrVal[] = "$key=".(is_object($value)) ? self::toSqlFormat($value->id) : self::toSqlFormat($value); 
                            break;          
                    default:
                        if($value === null || $value == null || $value == ""  || $value == "null"){
                            $arrVal[] = "$key=".'NULL';
                            break;
                        }  
                        var_dump($value);        
                        $arrVal[] = "$key=".(is_object($value)) ? self::toSqlFormat($value->id) : self::toSqlFormat($value);
                        break;
                }
            }
        }
        if (!$arrVal ) {
            throw new Exception("Нет данных для обновления для таблцы $this->table с id = $jsonIn->id");
        }

        if ($arrVal) {
            $sql = "UPDATE $this->table SET ".implode(",",$arrVal)." WHERE id = $jsonIn->id";
            self::$pdo->query($sql);
        }
    }

    function getCountPages(){ //получение общего количества страниц
        $sqlCount = "SELECT COUNT(*) as count  from $this->table";
        $countPage = self::$pdo->query($sqlCount)->fetchAll();
    
        $countPages = (int)$countPage[0]->count;
        return ceil($countPages/3);
    }
}