<?php
	$name = "";
	$content = "";

	if(isset($_GET['name']))
			$name = $_GET['name'];

	if(isset($_GET['content']))
		$content = urldecode($_GET['content']);
	$content = str_replace('*', "\n", $content);
	$content = str_replace('-', ", ", $content);
	$image_file 	= 'bg.png';

	$content=wordwrap($content,65, "\n", true);
	$text = $content;

	if(empty($text))fatal_error('Error: Text not properly formatted.') ;
	$font_file 		= 'UVNMauTim2.TTF';
	$font_size  	= 17;

	$x_finalpos 	= 100;
	$y_finalpos 	= 149;
	$mime_type 			= 'image/png' ;
	if(!function_exists('ImageCreate'))
		fatal_error('Error: Server does not support PHP image generation') ;
	if(!is_readable($font_file)) {
		fatal_error('Error: The server is missing the specified font.') ;
	}
	$box = @ImageTTFBBox($font_size,0,$font_file,$text) ;
	$text_width = abs($box[2]-$box[0]);
	$text_height = abs($box[5]-$box[3]);

	$image =  imagecreatefrompng($image_file);
	if(!$image || !$box)
	{
		fatal_error('Error: The server could not create this image.') ;
	}
	$font_color = ImageColorAllocate($image,58,58,46) ;
	$image_width = imagesx($image);

	imagettftext($image, $font_size, 0, $x_finalpos,  $y_finalpos, $font_color, $font_file, $text);


	header('Content-type: ' . $mime_type) ;
	ImagePNG($image) ;
	ImageDestroy($image) ;
	exit ;
	function fatal_error($message)
	{
		if(function_exists('ImageCreate'))
		{
			$width = ImageFontWidth(5) * strlen($message) + 10 ;
			$height = ImageFontHeight(5) + 10 ;
			if($image = ImageCreate($width,$height))
			{
				$background = ImageColorAllocate($image,255,255,255) ;
				$text_color = ImageColorAllocate($image,0,0,0) ;
				ImageString($image,5,5,5,$message,$text_color) ;    
				header('Content-type: image/png') ;
				ImagePNG($image) ;
				ImageDestroy($image) ;
				exit ;
			}
		}
		header("HTTP/1.0 500 Internal Server Error") ;
		print($message) ;
		exit ;
	}   
?>