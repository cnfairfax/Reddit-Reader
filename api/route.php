<?
	ini_set('display_errors', false);
	ini_set('memory_limit', '256M');

	//require_once('start.php');

	//Basic Settings
	set_include_path('.');
	setlocale(LC_MONETARY, 'en_US');
	
	ini_set('error_reporting', E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);
	ini_set('date.timezone', 'America/New_York');

	//Error Handler
	set_error_handler(function($code, $message, $file, $line){
		if ($code & error_reporting()){
			throw new ErrorException($message, 0, $code, $file, $line);
		}
	});

	//Autoloader
	spl_autoload_register(function($class){
		require($class . '.php');
	});
?>