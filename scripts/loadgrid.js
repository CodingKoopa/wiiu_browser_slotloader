var hasImage = [false, false, false, false, false,
                false, false, false, false, false,
                false, false, false, false, false];
var hasPayload = [false, false, false, false, false,
                  false, false, false, false, false,
                  false, false, false, false, false];

function loadGrid()
{
    // for every row
    for (var row = 1; row < 4; row++)
    {
        // and every column in each of those rows
    	for (var column = 1; column < 6; column++)
    	{
            // each icon block has its own ID
            // 1  2  3  4  5  - Easy, just use the column
            // 6  7  8  9  10 - +5
            // 11 12 13 14 15 - +10
            // that logic is used to compute the slotid here based off of
            // the column and row, which we already know
    		if (row === 2)
    			loadSlot(column + 5);
    		else if (row === 3)
    			loadSlot(column + 10);
    		else
    			loadSlot(column);
    	}
    }
}

function wipeGrid()
{
    // make bottom bar border blue to blend in
    document.getElementById("bottom-bar").style.borderTopColor = "#0090c8";

    // reset count
    payloadLoadCount = 0;
    imgLoadCount = 0;

    // reset loading
    payloadLoadingFinished = false;
    imageLoadingFinished = false;

    //reset the arrays
    for (var row = 1; row < 4; row++)
    {
        for (var column = 1; column < 6; column++)
        {
            // same deal as before
            var slotID;
            if (row === 2)
                slotID = column + 5;
            else if (row ===3)
                slotID = column + 10;
            else
                slotID = column;
            // hide the image border
            document.getElementById("icon-" + slotID).style.visibility = "hidden";
            // hide the image
            document.getElementById("image-" + slotID).style.visibility = "hidden";
        }
    }
}

// this will keep track of how many payloads have loaded, reguardless of if they were found
// or not
// i'm doing this because due to the unpredictable httprequest, the slots always load
// out of order
var imgLoadCount = 0;
var imageLoadingFinished = false;

var payloadLoadCount = 0;
var payloadLoadingFinished = false;

// find and link to a .bin
function loadSlot(slotID)
{
    // init http
    var payloadRequest = new XMLHttpRequest();

    // this will be triggered when a state change occurs in the request
    payloadRequest.onreadystatechange = function()
    {
        // if the request is ready
        if (payloadRequest.readyState == 4 && payloadRequest.status == 200)
        {
            // fill the path with the response
            var payloadPath = payloadRequest.responseText;

            // if not 404
            if (payloadPath.substring(0, 5) !== "Error")
            {
                // set the bin link
                document.getElementById("icon-" + slotID).href = "loadTransition.php?payload=" + payloadPath;

                // mark bin as in
                hasPayload[slotID] = true;
            }

            // nope, couldn't find the bin for this slot
            else
                // mark bin as out
                hasPayload[slotID] = false;

            // this slot is finished
            payloadLoadCount++;
            //wait until all 15 images have loaded
            if (payloadLoadCount >= 15)
            {
                // mark the bins as done
                payloadLoadingFinished = true;

                // fix missing images/bins
                checkForMissing();
            }
        }
    }
    if (useMP4)
        payloadRequest.open("GET", "getfilebyextension.php?folder=slots/"+slotID+"&ext=mp4");
    else
        payloadRequest.open("GET", "getfilebyextension.php?folder=slots/"+slotID+"&ext=bin");
    payloadRequest.send();

    // init http
    var imageRequest = new XMLHttpRequest();
    // this is the path we'll fill
    var imgPath;

    imageRequest.onreadystatechange = function()
    {
        // if the request is ready
        if (imageRequest.readyState == 4 && imageRequest.status == 200)
        {
            // fill the path with the response
            imgPath = imageRequest.responseText;
            // log the response recieved

            // if recieved invalid respones
            if (imgPath.substring(0, 5) === "Error")
                // mark image as out
                hasImage[slotID] = false;

            // if found
            else
            {

                // set the image
                document.getElementById("image-" + slotID).src = imgPath;

                //mark image as in
                hasImage[slotID] = true;
            }

            // this image is done
            imgLoadCount++;

            // wait until all 15 images have loaded
            if (imgLoadCount === 15)
            {
                // mark the images as done
                imageLoadingFinished = true;

                // check for missing images/bins
                checkForMissing();
            }
        }
    }
    imageRequest.open("GET", "getfilebyextension.php?folder=slots/"+slotID+"&ext=png");
    imageRequest.send();
}

// the loadBIN and loadImage functions can't really communicate with each other,
// so the checking is done here
function checkForMissing()
{
    // don't check yet if everything hasn't finished loading
    if (!imageLoadingFinished || !payloadLoadingFinished)
        return;

    // this will be executed by whatever calls this function last
    else
    {
        var numberEmpty = 0;
        // for every slot
        for (var slotID = 1; slotID < 16; slotID++)
        {
            // if has image and payload
            if (hasImage[slotID] && hasPayload[slotID])
            {
                // add the image to the existing transition link
                document.getElementById("icon-" + slotID).href =
                document.getElementById("icon-" + slotID).href +
                "&image=" + document.getElementById("image-" + slotID).src;
                // set border image
                document.getElementById ("icon-" + slotID).style.backgroundImage
                 = 'url(images/icon-background.png)';

                // show the image
                document.getElementById("image-" + slotID).style.visibility =
                "visible";
                // show the borders
                document.getElementById ("icon-" + slotID).style.visibility = "visible";
            }

            // if has bin with no image
            else if (!hasImage[slotID] && hasPayload[slotID])
            {
                // set missing image
                document.getElementById("image-" + slotID).src =
                "images/no-icon.png";
                // add the missing image to the existing transition link
                document.getElementById("icon-" + slotID).href =
                document.getElementById("icon-" + slotID).href +
                "&image=images/no-icon.png";
                // set border image
                document.getElementById("icon-" + slotID).style.backgroundImage
                = "url('images/icon-background.png')";

                // show the image
                document.getElementById("image-" + slotID).style.visibility = "visible";
                // show the borders
                document.getElementById ("icon-" + slotID).style.visibility = "visible";
            }

            // if has image with no payload or has nothing at all
            else
            {
                // show the image
                document.getElementById("image-" + slotID).style.visibility = "hidden";
                // hide the image
                document.getElementById("icon-" + slotID).style.visibility = "hidden";

                numberEmpty++;
            }
        }

        if (numberEmpty >= 15)
        {
            alert ("Welcome to Koopa's Wii U Browser Slot Launcher!\n" +
                "To begin, create a 'slots' folder inside the same directory as index.html." +
                "Inside that create a 1, 2, 3, and so on folder for each of the slots," +
                "containing a png icon and a binary, with any name.");
        }
    }
    if (showBackground)
        // show the background image
        document.getElementsByTagName("body")[0].style.backgroundImage = "url('images/background.png')";

    // restore bottom bar border to grey
    document.getElementById("bottom-bar").style.borderTopColor = "#afaeae";
}
