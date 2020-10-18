var classCnt = 2;

var glbtmpHTML = "";
var actContainerID = 0;

var actWCFlag = false;

var metaObject = {
    'class1' : {
        'id' : 1,
        'name' : "",
        'sampleCnt' : 0,
        'capShowHTML': null,
        'gatBoxHTML' : null,
        'imgSrc': []
    },
    'class2' : {
        'id' : 2,
        'name' : "",
        'sampleCnt' : 0,
        "capShowHTML": null,
        "gatBoxHTML": null,
        'imgSrc': []
    }
}

function ajaxTest() {
    $.ajax({
        type: 'POST',
        url: "/learning",
        data: {
            value: "test complete"
        },
        dataType: 'JSON',
        success: function(result) {
            console.log("result : " + result);
        },
        error: function(xtr, status, error) {
            console.log(xtr + ": " + status + ": " + error);
        }
    })
}

function webcamStart(contId) {
    ajaxTest();

    var targetCBox = document.getElementsByClassName("class-content-box")[contId-1];
    var cBoxChildList = targetCBox.childNodes;
    var targetId = "capture-content-box" + contId;
    var tmpHTML = metaObject['class' + contId].gatBoxHTML;

    for (var i=0; i<cBoxChildList.length; i++) {
        if (cBoxChildList[i].id == targetId) {
            var orgCCBox = cBoxChildList[i];
        }
    }

    if (actWCFlag) {
        orgWebcamEnd(actContainerID);
    }

    actContainerID = contId;
    metaObject['class' + contId].capShowHTML = orgCCBox; 
    targetCBox.removeChild(orgCCBox);

    if (isFirstTry(tmpHTML)) {
        var newGathBox = document.createElement("div");
        newGathBox.setAttribute("class", "gather-img-box");
        
        var newWCBox = document.createElement("div");
        newWCBox.setAttribute("class", "webcam-booth");
        newWCBox.innerHTML = "<div class=\"webcam-header\">\n\t" 
                            + "<h4 class=\"fnt-webcam-start\">Webcam</h4>"
                            + "<button type=\"button\" class=\"exit-button\" onclick=\"actWebcamEnd(" + contId + ");\">\n\t"
                            + "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\t"
                            + "<path d=\"M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z\" fill=\"green\"></path>"
                            + "</svg></button></div>\n"
                            + "<video autoplay=\"true\" id=\"myVideo\" width=\"100%\"></video>"
                            + "<button role=\"button\" class=\"capture-box\" onclick=\"snapShot(" + contId + ");\"\n\t>" 
                            + "<h4 class=\"fnt-capture\">Capture it!</h4>"
                            + "</div>";
        
        var newCapBooth = document.createElement("div");
        newCapBooth.setAttribute("class", "capture-booth");
        newCapBooth.scrollTop = newCapBooth.scroll;
        newCapBooth.innerHTML = "<h4 class=\"fnt-gathered-img\">" + metaObject['class'+contId].sampleCnt +" images gathered!</h4>"

        newGathBox.appendChild(newWCBox);
        newGathBox.appendChild(newCapBooth);
    } else{
        var newGathBox = tmpHTML;
    }

    targetCBox.appendChild(newGathBox);

    // Webcam stream is active
    turnOnVideoAct();

    // stream webcam videa data
    streamVideo();
}

function turnOnVideoAct() {
    actWCFlag = true;
}

function isFirstTry(tmpHTML) {
    return tmpHTML == null;
}

function streamVideo() {
    var video = document.getElementById('myVideo');

    navigator.getMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetuserMedia ||
    navigator.msGetUserMedia;

    var constraints = {
        audio: false,
        video: {
            width: {min: 320, ideal: 640, max: 1280},
            height: {min: 240, ideal: 480, max: 960}
        }
    }

    if (hasGetUserMedia()) {
        navigator.getMedia(constraints,
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

function streamStop() {
    var video = document.getElementById('myVideo');
    var stream = video.srcObject;
    var tracks = stream.getTracks();

    for (var i=0; i<tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }
    video.srcObject = null;
}

function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetuserMedia || navigator.msGetUserMedia);
}

function orgWebcamEnd(contId) {
    var orgTargetCBox = document.getElementsByClassName("class-content-box")[contId-1];
    var orgWCBox = document.getElementsByClassName("gather-img-box")[0];
    
    // Swap components
    var tmpHTML = metaObject['class' + contId].capShowHTML;
    metaObject['class' + contId].gatBoxHTML = orgWCBox;
    orgTargetCBox.removeChild(orgWCBox);
    orgTargetCBox.appendChild(tmpHTML);
}

function actWebcamEnd(contId) {
    streamStop();
    
    var actTargetCBox = document.getElementsByClassName("class-content-box")[contId-1];
    var actWCBox = document.getElementsByClassName("gather-img-box")[0];

    var tmpHTML = metaObject['class' + contId].capShowHTML;
    console.log(tmpHTML);
    metaObject['class' + contId].gatBoxHTML = actWCBox;
    actTargetCBox.removeChild(actWCBox);
    actTargetCBox.appendChild(tmpHTML);
    
    videoActClassReset();
}

function videoActClassReset() {
    actContainerID = 0;
    actWCFlag = false;
}

function snapShot(contId) {
    var tgClass = 'class' + contId;
    // Get class meta
    var tgSampCnt = (++metaObject[tgClass].sampleCnt);
    
    var fntGathered = document.getElementsByClassName('fnt-gathered-img')[0]
    fntGathered.innerHTML = "<h4 class=\"fnt-gathered-img\">" + tgSampCnt +" images gathered!</h4>"
    var capBooth = document.getElementsByClassName("capture-booth")[0];
    var video = document.getElementById('myVideo');

    var captureVideo = document.createElement("canvas");
    captureVideo.setAttribute("class", "capture-video");
    captureVideo.setAttribute("width", "640");
    captureVideo.setAttribute("height", "480");
    var ctx = captureVideo.getContext('2d');

    ctx.drawImage(video, 0, 0, 640, 480, 0, 0, 640, 480);
    
    // Store image encoding in metaObject
    var imgDataUrl = captureVideo.toDataURL('image/png');
    metaObject[tgClass].imgSrc.push(imgDataUrl);

    var tmpImg = document.createElement("img");
    tmpImg.setAttribute("class", "sample-img");
    tmpImg.setAttribute("id", tgClass + "-img" + tgSampCnt);
    tmpImg.src = imgDataUrl;

    addImgToCapShowBox(contId, imgDataUrl, tgClass, tgSampCnt);

    capBooth.appendChild(tmpImg);
    console.log(capBooth);
}

function addImgToCapShowBox(contId, imgDataUrl, tgClass, tgSampCnt) {
    var tmpImg = document.createElement("img");
    tmpImg.setAttribute("class", "sample-img");
    tmpImg.setAttribute("id", tgClass + "-img" + tgSampCnt);
    tmpImg.src = imgDataUrl;

    if (contId == 1 || contId == 2) {
        metaObject['class' + contId].capShowHTML.childNodes[3].appendChild(tmpImg);
    } else {
        metaObject['class' + contId].capShowHTML.childNodes[1].appendChild(tmpImg);
    }
}

function addClass() {
    classCnt++;
    metaObject['class3'] = {'id' : classCnt, 'name' : "", 'sampleCnt' : 0, 'imgSrc' : []};
    var trnSec = document.getElementById("train-section");

    var newClassCon = document.createElement("div");
    newClassCon.setAttribute("class", "class-container");
    var newClassConHeader = document.createElement("div");
    newClassConHeader.setAttribute("class", "class-header-box");
    newClassConHeader.innerHTML = "<p class=\"fnt-class-name\">Class" + classCnt + "</p>";

    var newClassConCbox = document.createElement("div");
    newClassConCbox.setAttribute("class", "class-content-box");
    newClassConCbox.innerHTML = "<p class=\"fnt-desc-name\">Add sample images:</p>";

    var newCapConCbox = document.createElement("div");
    newCapConCbox.setAttribute("class", "capture-content-box");
    newCapConCbox.setAttribute("id", "capture-content-box" + classCnt);
    
    var newWebCamBtn = document.createElement("button");
    newWebCamBtn.setAttribute("class", "web-cam-box");
    newWebCamBtn.setAttribute("role", "button");
    newWebCamBtn.setAttribute("id", "web-cam-box" + classCnt);
    newWebCamBtn.setAttribute("onclick", "webcamStart(" + classCnt + ");");
    newWebCamBtn.innerHTML = "<svg class=\"sample-source-icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\t"
                            + "<path fill=\'green\' fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18 6V10.48L22 6.5V17.5L18 13.52V14.52V18C18 19.1 17.1 20 16 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H16C17.1 4 18 4.9 18 6ZM16 14.52V9.69V6H4V18H16V14.52Z\"></path></svg>\n\t"
                            + "<p class=\"web-cam-font\">Webcam</p>";

    var newCapShowBox = document.createElement("div");
    newCapShowBox.setAttribute("class", "capture-show-box");
    newCapShowBox.setAttribute("id", "capture-show-box" + classCnt);

    // Construct dependency tree
    newCapConCbox.appendChild(newWebCamBtn);
    newCapConCbox.appendChild(newCapShowBox);
    newClassConCbox.appendChild(newCapConCbox);
    newClassCon.appendChild(newClassConHeader);
    newClassCon.appendChild(newClassConCbox);

    var addClassBox = document.getElementById("add-class-box");
    trnSec.insertBefore(newClassCon, addClassBox);
}