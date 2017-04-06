<?
	class Request extends Object {

		function __construct($params){
			parent::__construct($this->scrub($params));
		}

		private function map($map, $handler) {
			$new = [];
			foreach($map as $k => $v) {
				$new[$k] = $handler($v);
			}
			return $new;
		}

		private function scrub($value, $replace = '?'){
			if (is_array($value)){
				return $this->map($value, function($v) use($replace){
					return $this->scrub($v, $replace);
				});
			}
			else{
				return trim(preg_replace("/[^\t\x20-\x7E\x0A\x0D]+/", $replace, strtr($value, [
					"\r" 		   => '',
					"\xE2\x80\xA6" => '...',
					"\xE2\x80\x93" => '-',  
					"\xE2\x80\x94" => '-',  
					"\xE2\x80\x98" => "'",  
					"\xE2\x80\x99" => "'",  
					"\xE2\x80\x9C" => '"',  
					"\xE2\x80\x9D" => '"',  
					"\xE2\x80\xA2" => '*',  
					"\xC2\xD"      => '1/2',
					"\xC2\xBC"     => '1/4',
					"\xC2\xBE"     => '3/4',
					"\xC3\xA9"     => 'e',  
					"\xE2\x89\xA4" => '<=', 
					"\xE2\x89\xA5" => '>='  
				])));
			}
		}
	}
?>