<?
	return new class {
		function run($request) {
			return Api::post('/r/' . $request->sub . '.json' . ($request->after ? '?after=' .$request->after : ''));
		}
	}
?>