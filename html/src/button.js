var classCnt = 2;

var glbtmpHTML = "";
var actContainerID = 0;

var actWCFlag = false;

var configObject = {
    'algorithm' : 'svm',
    'epochs' : 52,
    'batch' : 16,
    'learning_rate' : 0.001
}

var metaObject = {
    'class1' : {
        'id' : 1,
        'name' : "Class1",
        'sampleCnt' : 0,
        'capShowHTML': null,
        'gatBoxHTML' : null,
        'imgSrc': []
    },
    'class2' : {
        'id' : 2,
        'name' : "Class2",
        'sampleCnt' : 0,
        "capShowHTML": null,
        "gatBoxHTML": null,
        'imgSrc': []
    }
}

function webcamStart(contId) {
    // ajaxTest();

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
    
    var fntGathered = document.getElementsByClassName('fnt-gathered-img')[0];
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

    var sendObject = {
        'class': tgClass,
        'name' : metaObject[tgClass].name,
        'imgId': tgSampCnt,
        'imgSrc': imgDataUrl
    }

    putImgToS3(sendObject);

    if (isTrainAble()) {
        var trn_btn = document.getElementsByClassName("trn-btn-off")[0];
        trn_btn.removeAttribute('disabled');
        trn_btn.setAttribute('class', 'trn-btn');
    }

}

function isTrainAble() {
    var values = Object.values(metaObject);
    for (var i=0; i<values.length; i++) {
        tg_values = values[i]['imgSrc'];
        if (tg_values.length == 0) {
            return false;
        }
    }
    return true;
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

function sendSKLogic() {
    var jsonData = JSON.stringify(metaObject);
    $.ajax({
        type: 'POST',
        url: "/sklearn",
        data: jsonData,
        dataType: 'JSON',
        success: function(result) {
            console.log("result : " + result);
        },
        error: function(xtr, status, error) {
            console.log(xtr + ": " + status + ": " + error);
        }
    })
}

function putImgToS3(sendObject) {
    var jsonData = JSON.stringify(sendObject);
    $.ajax({
        type: 'POST',
        url: "/puts3",
        data: jsonData,
        dataType: 'JSON',
        success: function(result) {
            console.log("result : " + result);
        },
        error: function(xtr, status, error) {
            console.log(xtr + ": " + status + ": " + error);
        }
    })
}

function addClass() {
    classCnt++;
    metaObject['class' + classCnt] = {
        'id' : classCnt, 'name' : "Class" + classCnt, 'sampleCnt' : 0, 'imgSrc' : []
    };
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

function configOn() {
    var configBox = document.getElementById("advanced-config");
    configBox.setAttribute('class', 'advanced-config-on');

    // create machine learning content box
    var mlCfBox = document.createElement("div");
    mlCfBox.setAttribute('class', 'ml-config');

    var mlCfHeader = document.createElement("div");
    mlCfHeader.setAttribute('class', 'config-header');
    mlCfHeader.innerHTML = "<h4 class=\"fnt-config-name\">Machine Learning</h4>";

    var mlCfCBox = document.createElement('div');
    mlCfCBox.setAttribute('class', 'config-content');
    var mlCfDesc = document.createElement('div');
    mlCfDesc.setAttribute('class', 'config-desc');
    mlCfDesc.innerHTML = "<h4 class=\"fnt-select-opt\">Algorithm : </h4>";

    var mlCfSelect = document.createElement('div');
    mlCfSelect.setAttribute('class', 'config-select');

    var mlCfSelectBox = document.createElement('select');
    mlCfSelectBox.setAttribute('style', 'height: 22px;font-size: 12px; width: 150px; border: 1px solid lightgray');

    var mloption = new Array(2);
    for (var i=0; i<mloption.length; i++) {
        mloption[i] = document.createElement('option');

        if (i == 0) {
            mloption[i].setAttribute('value', 'svm');
            mloption[i].innerHTML = 'SVM';
        } else if (i == 1) {
            mloption[i].setAttribute('value', 'tree');
            mloption[i].innerHTML = "DecisionTree";
        }
    }

    // update selected ml option
    for (var i=0; i<2; i++) {
        if (mloption[i].value == configObject['algorithm']) {
            mloption[i].setAttribute('selected', 'selected');
        }
        mlCfSelectBox.appendChild(mloption[i]);
    }
    mlCfSelect.appendChild(mlCfSelectBox);
                        
    mlCfCBox.appendChild(mlCfDesc);
    mlCfCBox.appendChild(mlCfSelect);

    configBox.appendChild(mlCfHeader);
    configBox.appendChild(mlCfCBox);

    // separated line between ml and ai
    var spLine = document.createElement('hr');
    spLine.setAttribute('style', 'margin-bottom: 5px;margin-top: 10px;border: 1px dotted lightgray');
    configBox.appendChild(spLine);

    // create deep learning content box
    var aiCfBox = document.createElement("div");
    aiCfBox.setAttribute('class', 'ai-config');

    var aiCfHeader = document.createElement('div');
    aiCfHeader.setAttribute('class', 'config-header');
    aiCfHeader.innerHTML = "<h4 class=\"fnt-config-name\">Deep Learning</h4>";

    var aiCfEpochBox = document.createElement("div");
    aiCfEpochBox.setAttribute('class', 'config-content');
    var aiCfEpochDesc = document.createElement('div');
    aiCfEpochDesc.setAttribute('class', 'config-desc');
    aiCfEpochDesc.innerHTML = "<h4 class=\"fnt-select-opt\">Epochs : </h4>";
    var aiCfEpochInput = document.createElement('div');
    aiCfEpochInput.setAttribute('class', 'config-select');

    aiCfEpochInputBox = document.createElement('input');
    aiCfEpochInputBox.setAttribute('name', 'epochs');
    aiCfEpochInputBox.setAttribute('value', configObject['epochs']);
    aiCfEpochInputBox.setAttribute('type', 'number');
    aiCfEpochInputBox.setAttribute('min', '1');
    aiCfEpochInputBox.setAttribute('max', '200');
    aiCfEpochInputBox.setAttribute('style', 'height: 16px;font-size: 12px;width: 50px; border: 1px solid lightgray');
    
    aiCfEpochInput.appendChild(aiCfEpochInputBox);
    aiCfEpochBox.appendChild(aiCfEpochDesc);
    aiCfEpochBox.appendChild(aiCfEpochInput);

    var aiCfBatchBox = document.createElement("div");
    aiCfBatchBox.setAttribute('class', 'config-content');
    var aiCfBatchDesc = document.createElement('div');
    aiCfBatchDesc.setAttribute('class', 'config-desc');
    aiCfBatchDesc.innerHTML = "<h4 class=\"fnt-select-opt\">Batch Size : </h4>";
    var aiCfBatchInput = document.createElement('div');
    aiCfBatchInput.setAttribute('class', 'config-select');

    var aiCfBatchInputSelect = document.createElement('select');
    aiCfBatchInputSelect.setAttribute('style', 'height: 22px;font-size: 12px;width: 50px; border: 1px solid lightgray');
    var aibatchoption = new Array(5);
    for (var i=0; i<aibatchoption.length; i++) {
        aibatchoption[i] = document.createElement('option');
        switch(i) {
            case 0:
                aibatchoption[i].setAttribute('value', '16');
                aibatchoption[i].innerHTML = '16';
                break;
            case 1:
                aibatchoption[i].setAttribute('value', '32');
                aibatchoption[i].innerHTML = '32';
                break;
            case 2:
                aibatchoption[i].setAttribute('value', '64');
                aibatchoption[i].innerHTML = '64';
                break;
            case 3:
                aibatchoption[i].setAttribute('value', '128');
                aibatchoption[i].innerHTML = '128';
                break;
            case 4:
                aibatchoption[i].setAttribute('value', '256');
                aibatchoption[i].innerHTML = '256';
                break;
            default:
                break;
        }
        if (aibatchoption[i].value == configObject['batch']) {
            aibatchoption[i].setAttribute('selected', 'selected');
        }
        aiCfBatchInputSelect.appendChild(aibatchoption[i]);
    }

    aiCfBatchInput.appendChild(aiCfBatchInputSelect);
    aiCfBatchBox.appendChild(aiCfBatchDesc);
    aiCfBatchBox.appendChild(aiCfBatchInput);

    var aiCfLRBox = document.createElement("div");
    aiCfLRBox.setAttribute('class', 'config-content');
    var aiCfLRDesc = document.createElement('div');
    aiCfLRDesc.setAttribute('class', 'config-desc');
    aiCfLRDesc.innerHTML = "<h4 class=\"fnt-select-opt\">Epochs : </h4>";
    var aiCfLRInput = document.createElement('div');
    aiCfLRInput.setAttribute('class', 'config-select');

    aiCfLRInputBox = document.createElement('input');
    aiCfLRInputBox.setAttribute('name', 'learning_rate');
    aiCfLRInputBox.setAttribute('value', configObject['learning_rate']);
    aiCfLRInputBox.setAttribute('type', 'number');
    aiCfLRInputBox.setAttribute('min', '0.00001');
    aiCfLRInputBox.setAttribute('max', '0.1');
    aiCfLRInputBox.setAttribute('step', '0.00001');
    aiCfLRInputBox.setAttribute('style', 'height: 16px;font-size: 12px;width: 50px; border: 1px solid lightgray');
    
    aiCfLRInput.appendChild(aiCfLRInputBox);
    aiCfLRBox.appendChild(aiCfLRDesc);
    aiCfLRBox.appendChild(aiCfLRInput);
                            
    configBox.appendChild(aiCfHeader);
    configBox.appendChild(aiCfEpochBox);
    configBox.appendChild(aiCfBatchBox);
    configBox.appendChild(aiCfLRBox);

}