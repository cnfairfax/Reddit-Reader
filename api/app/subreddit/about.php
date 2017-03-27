<?
	return new class {
		function run($request) {
			return Api::post('/r/' . $request->sub . '/about.json');
		}
	}
?>