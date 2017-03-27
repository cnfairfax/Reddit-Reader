<?
  class Object{

    function __construct($map = null){
      foreach(($map ?: []) as $k => $v){
      	$this->$k = $v;
      }
    }
  }
?>