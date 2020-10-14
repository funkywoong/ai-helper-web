var classCnt = 3;
var tmpHTML = "";
var actContainerID = 0;
var actWCFlag = false;


function webcamStart(contId) {
    var targetCBox = document.getElementsByClassName("class-content-box")[contId-1];
    var cBoxChildList = targetCBox.childNodes;
    var targetId = "web-cam-box" + contId;

    for (var i=0; i<cBoxChildList.length; i++) {
        if (cBoxChildList[i].id == targetId) {
            var orgWCBox = cBoxChildList[i];
        }
    }
    console.log(orgWCBox);

    if (actWCFlag) {
        console.log(actContainerID)
        orgWebcamEnd(actContainerID);
    }

    actContainerID = contId;
    tmpHTML = orgWCBox; 
    targetCBox.removeChild(orgWCBox);
    
    var newWCBox = document.createElement("div");
    newWCBox.setAttribute("class", "webcam-booth");
    newWCBox.innerHTML = "<h4 class=\"fnt-webcam-start\">Webcam</h4>\n"
                        + "<video autoplay=\"true\" id=\"myVideo\" width=\"100%\"></video>\n\t"
                        + "<button role=\"button\" class=\"capture-box\"\n\t>" 
                        + "<h4 class=\"fnt-capture\">Capture it!</h4></div>";
    targetCBox.appendChild(newWCBox);
    actWCFlag = true;

    // stream webcam videa data
    streamVideo();
}

function streamVideo() {
    var video = document.getElementById('myVideo');

    navigator.getMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetuserMedia ||
    navigator.msGetUserMedia;

    if (hasGetUserMedia()) {
        navigator.getMedia({video:true, audio:false},
            function(stream) {
                video.srcObject = stream;
                video.play(); 
            }, function(error) {
                alert('ERROR: ' | error.toString())
        } );
    } else {
        alert("webkitGetUserMedia is not supported");
    }
}

function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetuserMedia || navigator.msGetUserMedia);
}

function orgWebcamEnd(contId) {
    var orgTargetCBox = document.getElementsByClassName("class-content-box")[contId-1];
    var orgWCBox = document.getElementsByClassName("webcam-booth")[0];
    orgTargetCBox.removeChild(orgWCBox);
    orgTargetCBox.appendChild(tmpHTML);
}

function addClass() {
    var trnSec = document.getElementById("train-section");

    var newClassCon = document.createElement("div");
    newClassCon.setAttribute("class", "class-container");
    var newClassConHeader = document.createElement("div");
    newClassConHeader.setAttribute("class", "class-header-box");
    newClassConHeader.innerHTML = "<p class=\"fnt-class-name\">Class" + classCnt + "</p>";

    var newClassConCbox = document.createElement("div");
    newClassConCbox.setAttribute("class", "class-content-box");
    newClassConCbox.innerHTML = "<p class=\"fnt-desc-name\">Add sample images:</p>";
    
    var newWebCamBtn = document.createElement("button");
    newWebCamBtn.setAttribute("class", "web-cam-box");
    newWebCamBtn.setAttribute("role", "button");
    newWebCamBtn.setAttribute("id", "web-cam-box" + classCnt);
    newWebCamBtn.setAttribute("onclick", "webcamStart(" + classCnt + ");");
    newWebCamBtn.innerHTML = "<svg class=\"sample-source-icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\t"
                            + "<path fill=\'green\' fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18 6V10.48L22 6.5V17.5L18 13.52V14.52V18C18 19.1 17.1 20 16 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H16C17.1 4 18 4.9 18 6ZM16 14.52V9.69V6H4V18H16V14.52Z\"></path></svg>\n\t"
                            + "<p class=\"web-cam-font\">Webcam</p>";

    newClassConCbox.appendChild(newWebCamBtn);
    newClassCon.appendChild(newClassConHeader);
    newClassCon.appendChild(newClassConCbox);

    var addClassBox = document.getElementById("add-class-box");
    trnSec.insertBefore(newClassCon, addClassBox);
    classCnt++;
}