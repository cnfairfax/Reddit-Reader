<?
	ini_set('display_errors', false);
	ini_set('memory_limit', '256M');

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

		$key = function($class){
			return __DIR__.'-'.$class;
		};
		if (!apcu_exists($key($class)) || !@include(apcu_fetch($key($class)))){

			foreach([
				'base/'
			] as $path){
				foreach(new RecursiveIteratorIterator(
					new RecursiveDirectoryIterator(
						__DIR__ . DIRECTORY_SEPARATOR . $path, 
						FilesystemIterator::CURRENT_AS_FILEINFO | FilesystemIterator::SKIP_DOTS
					),
					RecursiveIteratorIterator::SELF_FIRST
				) as $file){
					if (!$file->isDir()){
						apcu_store($key($file->getBasename('.php')), $file->getRealPath());
					}
				}
			}
			
			if (file_exists($file = apcu_fetch($key($class)))){
				require($file);
			}
			else{
				throw new Exception(sprintf('Class was not found: %s', $class));
			}
		}
	});

	$request = explode('?', $_SERVER['REQUEST_URI']);

	/*$temp_params = explode('&', $request[1]) ?: [];

	$params = [];

	if($temp_params) {
		foreach($temp_params as $tp) {
			$key_value = explode('=', $tp);
			$params[$key_value[0]] = $key_value[1];
		}
	}*/

	// echo json_encode($_REQUEST);die;

	//Build custom route path
	$file = str_replace('/api/', __DIR__ . '/app/', $request[0]) . '.php';

	//Test that file exists if not throw new exception
	if(file_exists($file)) {
		if(strpos(file_get_contents($file), 'new class') !== false){

			$route = require_once($file);
			$route->request = new Request($_REQUEST);

			// if($response = $route->run($route->request)) {
			// 	echo json_encode($response);
			// } else {
			// 	throw new Exception('It appears this route doesn\'t do anything');
			// }
		}
	} else {
		throw new Exception('This route doesn\'t exist');
	}
?>