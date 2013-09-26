<?php
// Fetch the basic info of the app that they are using
$app_info = $facebook->api('/'. AppInfo::appID());
$app_name = idx($app_info, 'name', '');
function isFan(){
	global $facebook;
	try {
		$likes = $facebook->api("/me/likes/209800639189971");
		if( !empty($likes['data']) )
			return true;
		else
			return false;
	} catch (FacebookApiException $e) {
		error_log($e);
		$user = null;
	}
}
?>