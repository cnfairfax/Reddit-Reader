<?
	class Api{

		const CLIENT_ID = '1hu-TFynoGKvWA';
		const TOKEN = 'IqcthxK0USNBTYtuVdk5YEW7iT4';
		const URL = 'https://www.reddit.com';

		static function post($url, $vars = null){
			$ch = curl_init(Api::URL . $url);
			curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
			curl_setopt( $ch, CURLOPT_USERPWD, self::CLIENT_ID . ':' . self::TOKEN);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			$response = json_decode(curl_exec($ch));
			curl_close($ch);
			return $response;
		}
	}
?>