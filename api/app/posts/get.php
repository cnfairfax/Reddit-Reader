<?
	return new class {
		function run($request) {
			return Api::post($request->link . '.json');
		}
	};
?>