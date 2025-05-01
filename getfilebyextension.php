<?php
// Grab folder variable from url
if (isset($_REQUEST["folder"]))
	$folder = $_REQUEST["folder"];

else
	die("Error: Please set the folder variable in the url, relative to getfilebyextension.php. It doesn't matter if it begins or ends in a / or not.");

// If the folder doesn't end in a /
if (substr ($folder, -1) != '/')
	$folder .= '/';

if (substr ($folder, 0, 1) == '/')
	$folder = substr($folder, 1);

// Grab extension variable from url
if (isset($_REQUEST["ext"]))
	$extension = $_REQUEST["ext"];

else
	die ("Error: please set the extension variable in the url. It doesn't matter if it begins with a . or not.");

// If the extension doesn't begin with a .
if (substr ($extension, 0) != '.')
{
	// Add it
	$extension = '.' . $extension;
}

// Combine the folder and the file to get the new path
$file = $folder . "*" . $extension;

// Find all occurences of the wildcard
$result = glob ($file);
// If none were found
if (count ($result) == 0)
{
	// Exit
	die ("Error: 404 File not found. Looked for a {$extension} file in {$folder}. Full string is {$file}");
}
// If more than one were found
else if (count ($result) > 1)
{
	$count = count($result);
	echo "Error: More than one result found. List: ";
	for ($i=0; $i < $count; $i++) 
	{ 
		echo $result[$i] . "<br>";
	}
	die ();
}
else
{
	//success!
	die ($result[0]);
}
?>