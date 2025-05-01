var showBackground = false

window.addEventListener("load", function()
{
	// don't show background if not enough room so layout doesn't break
	if (window.screen.availWidth >= 854 &&  window.screen.availHeight >= 410)
		showBackground = true;

	switchMode();

	// if browser is wii u
	if (window.wiiu)
	{
		// start reading controls
		handleControls();
	}
}, false);

function handleControls()
{
	// capture controller input
	var gamepad = window.wiiu.gamepad.update();

	var waitTime = 10;
	// verify that it's valid
	if (gamepad.isEnabled && gamepad.isDataValid)
	{
		// if holding down A
		if (gamepad.hold === 0x00008000)
		{
			switchMode();

			waitTime = 300;
		}
	}

	setTimeout(handleControls, waitTime);
}

var useMP4 = true;

function switchMode()
{
	if (showBackground)
        document.getElementsByTagName("body")[0].style.backgroundImage = "none";

	// footer text
	var string;

	// if in bin mode
	if (!useMP4)
		string = "Currently showing BINs. ";

	// mp4 mode, default
	else
		string = "Currently showing MP4s. ";

	// if using wii u
	if (window.wiiu)
		string = string.concat ("Press A to switch.");

	// not using wii u
	else
		string = string.concat ("Click here to switch.");

	wipeGrid();
	loadGrid();

	// invert
	useMP4 = !useMP4;
	// set the text
	document.getElementById("footer-text").innerHTML = string;
}
