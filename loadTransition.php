<?php
if (isset($_REQUEST["payload"]))
	$payload = $_REQUEST["payload"];

else 
	die("Error: payload URL parameter not passed. Please include the path to the payload in the URL like this: loadTransition.php?payload=path/to/payload/relative/to/this/script.mp4");

$image = "";

if (isset($_REQUEST["image"]))
	$image = "style=\"background: #0090c8 url('" . $_REQUEST["image"] . "') no-repeat top center;\"";

$payloadSegments = explode('.', basename($payload));
$payloadFileType = strtoupper($payloadSegments[1]);

if (file_exists($payload) && $payloadFileType == "MP4")
{
	copy($payload, "tmp.mp4");
	$redirect = "<meta http-equiv=\"refresh\" content=5;URL='loadMP4.php'/>";
}

else if (file_exists($payload) && $payloadFileType == "BIN")
{
	copy($payload, "tmp.bin");
	$redirect = "<meta http-equiv=\"refresh\" content=5;URL='loadBIN.php'/>";
}

else
	die("Error: payload $payload is not an MP4 or BIN file, or does not exist.");
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=854, initial-scale=1.0, maximum-scale=1.0" />
		<?php echo $redirect; ?>
		<link rel="stylesheet" href="styles/homemenu.css">
		<title>
			Loading
		</title>
	</head>
	<body>
		<div id="loading-screen" <?php echo $image; ?>>
			<div class="text-area">
				<h1>
					<?php echo "Loading $payloadSegments[0]<br>File Type: $payloadFileType"; ?>
				</h1>
			</div>
		</div>
	</body>
</html>