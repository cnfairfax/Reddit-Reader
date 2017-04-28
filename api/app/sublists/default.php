<?
    return new class {
		function run($request) {
			return Api::post('/subreddits/' . $request->where . '.json');
		}
	}
?>