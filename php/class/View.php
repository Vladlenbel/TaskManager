<?php
class View extends Config
{
    static function displayDefault() {
        echo "Страница по умолчанию";
    }

    static function displayError($error) {

    }

    static function displayException($exception) {
        $errorMsg = $exception->getMessage();
        $errorMsg = str_replace(array("\r\n", "\r", "\n"), '', strip_tags($errorMsg));
        $errorMsg = str_replace(array("\t"), ' ', strip_tags($errorMsg));

        $patterns = array('/SQLSTATE.+ERROR/','/CONTEXT.+RAISE/');
        $replaces = array('SQL','');
        $errorMsg = preg_replace ($patterns, $replaces, $errorMsg);

        $obj = new stdClass();
        $obj->code = 400;
        $obj->error = new stdClass();
        $obj->error->message = $errorMsg;
        $obj->error->code = $exception->getCode();
        $obj->error->file = $exception->getFile();
        $obj->error->line = $exception->getLine();
        $obj->TAll = microtime(true) - self::$controller->timeStartAll;

      //  Log::writeResponse($obj);
        echo json_encode($obj);

    }

    static function displayResponse($jsonOut) {
        $jsonOut->code = 200;
        $jsonOut->TAll = microtime(true) - self::$controller->timeStartAll;
       // Log::writeResponse(self::toCamelCase($jsonOut));
        echo json_encode($jsonOut);
    }


}