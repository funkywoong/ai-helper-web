var classCnt = 2;

var glbtmpHTML = "";
var actContainerID = 0;

var actWCFlag = false;
var infFlag = false;

var configObject = {
    'user' : '',
    'algorithm' : 'svm',
    'epochs' : 50,
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

function getUserInfo() {
    var headerText = document.getElementById('header').innerText;

    configObject['user'] = headerText.split('\'')[0];
}

function userBtnTest() {
    configObject['user'] = document.getElementById('test-name').value;
    console.log(configObject);
}

function webcamStart(contId) {

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
        'user' : configObject['user'],
        'class': tgClass,
        'name' : metaObject[tgClass].name,
        'imgId': tgSampCnt,
        'imgSrc': imgDataUrl
    }

    putImgToS3(sendObject);

    if (isTrainAble()) {
        var trn_btn = document.getElementsByClassName("trn-btn-off")[0] 
            || document.getElementsByClassName("trn-btn")[0];
        if (trn_btn.hasAttribute('disabled')) {
            trn_btn.removeAttribute('disabled');
            trn_btn.setAttribute('class', 'trn-btn');
        }
    }
}

function infSnapShot() {
    var video = document.getElementById('myVideo');

    var captureVideo = document.createElement("canvas");
    captureVideo.setAttribute("class", "capture-video");
    captureVideo.setAttribute("width", "640");
    captureVideo.setAttribute("height", "480");

    var ctx = captureVideo.getContext('2d');

    ctx.drawImage(video, 0, 0, 640, 480, 0, 0, 640, 480);
    
    var imgDataUrl = captureVideo.toDataURL('image/png');

    var sendObject = {
        'user' : configObject['user'],
        'imgSrc' : imgDataUrl
    }

    callInference(sendObject);
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

function trainModel() {
    
    updateConfigObj();
    configOff();

    var _showLoad = function() {
        console.log('_showLoad');
        var loader = $("#trn-loader");
        var text = $("h4.fnt-trn");

        text.css("display", "none");
        loader.css("display", "block");

        var trnBtn = $("button.trn-btn") || $("button.trn-btn-off");
        trnBtn.attr('disabled', 'disabled')
    }();

    var _noShowInfView = function () {
        var infRes = $('div.inference-result');
        console.log(infRes);
        if (infRes != undefined) {
            infRes.attr('style', 'display:none');
        }
    }();
    
    console.log('in train model method')

    if (actWCFlag) {
        actWebcamEnd(actContainerID);
    }

    callLearning();
}

function inferenceView() {
    var infOffBox = document.getElementById('inference-off');
    infOffBox.setAttribute('style', 'display:none;');

    var infOnBox = document.getElementById('inference-on');
    infOnBox.removeAttribute('style');
    infOnBox.innerHTML = "";

    // DOM element for inferencing video
    var infVideo = document.createElement('video');
    infVideo.setAttribute('autoplay', 'true');
    infVideo.setAttribute('id', 'myVideo');
    infVideo.setAttribute('style', 'width: 280px; margin-top: 15px; margin-left:20px; margin-right:20px; margin-bottom: 10px; \
        -webkit-border-top-left-radius: 10px; -moz-border-radius-topleft: 10px; -webkit-border-top-right-radius: 10px; \
        -moz-border-radius-topright: 10px; -webkit-border-bottom-left-radius: 10px; -moz-border-radius-bottomleft: 10px;\
        -webkit-border-bottom-right-radius: 10px; -moz-border-radius-bottomright: 10px;')
    infVideo.setAttribute('width', '260px');

    var infCapBtn = document.createElement('button');
    infCapBtn.setAttribute('role', 'button');
    infCapBtn.setAttribute('class', 'inf-capture-box');
    infCapBtn.setAttribute('onclick', 'infSnapShot();');
    infCapBtn.innerHTML = '<h4 class=\"fnt-inf\">Capture and Infer it!</h4>';
    infCapBtn.innerHTML += '<div class=\"loader\" id=\"inf-loader\" style=\"display:none; margin-top: 1px\"></div>';

    infOnBox.appendChild(infVideo);
    infOnBox.appendChild(infCapBtn);

    streamVideo();
}

function updateBar(resultObject) {
    var clsNumber = Object.keys(resultObject['machine-learning']).length;
    var infOnBox = document.getElementById('inference-on');

    if (document.getElementById('inference-result') == undefined) {
        var infResBox = document.createElement('div');
        infResBox.setAttribute('class', 'inference-result');
        infResBox.setAttribute('id', 'inference-result');
    } else {
        var infResBox = document.getElementById('inference-result');
        infResBox.innerHTML = "";
    }

    var line = document.createElement('hr');
    line.setAttribute('style', 'margin-bottom: 5px; margin-top: 5px; border: 1px solid lightgray');

    var mlResBox = document.createElement('div');
    mlResBox.appendChild(line);
    mlResBox.setAttribute('class', 'inferece-ml-result-header');
    mlResBox.setAttribute('style', 'width: 100%; overflow: hidden');
    mlResBox.innerHTML += "<h4 class=\"fnt-config-name\">Machine Learning</h4>";

    ml_divs = new Array(clsNumber);
    for (var i=0; i<clsNumber; i++) {
        ml_divs[i] = document.createElement('div');
        ml_divs[i].setAttribute('class', 'class-accuracy-box');

        var tmpClsName = document.createElement('div');
        tmpClsName.setAttribute('class', 'class-name');
        tmpClsName.innerHTML = "<h4 class=\"fnt-inf-class\">" + Object.keys(resultObject['machine-learning'])[i] + " : </h4>";

        ml_divs[i].appendChild(tmpClsName);

        var tmpClsBar = document.createElement('div');
        tmpClsBar.setAttribute('class', 'class-bar');

        var classBar = document.createElement('div');
        console.log(Object.values(resultObject['machine-learning'])[i]);
        if (Object.values(resultObject['machine-learning'])[i] == 0) {
            classBar.setAttribute('class', 'ml-class-bar-blank');
            classBar.setAttribute('style', 'width: 200px; height: 20px');
            classBar.innerHTML = "<h4 class=\"fnt-percentage\">0%</h4>";
        } else {
            classBar.setAttribute('class', 'ml-class-bar-fill');
            classBar.setAttribute('style', 'width: 200px; height: 20px');
            classBar.innerHTML = "<h4 class=\"fnt-percentage\" style=\"color: green\">100%</h4>";
        }
        tmpClsBar.appendChild(classBar);
        ml_divs[i].appendChild(tmpClsBar);

        mlResBox.appendChild(ml_divs[i]);
    }

    infResBox.appendChild(mlResBox);

    var dlResBox = document.createElement('div');
    dlResBox.appendChild(line);
    dlResBox.setAttribute('class', 'inferece-dl-result-header');
    dlResBox.setAttribute('style', 'width: 100%; overflow: hidden');
    dlResBox.innerHTML += "<h4 class=\"fnt-config-name\">Deep Learning</h4>";

    dl_divs = new Array(clsNumber);
    for (var i=0; i<clsNumber; i++) {
        dl_divs[i] = document.createElement('div');
        dl_divs[i].setAttribute('class', 'class-accuracy-box');

        var tmpClsName = document.createElement('div');
        tmpClsName.setAttribute('class', 'class-name');
        tmpClsName.innerHTML = "<h4 class=\"fnt-inf-class\">" + Object.keys(resultObject['deep-learning'])[i] + " : </h4>";

        var tmpClsBar = document.createElement('div');
        tmpClsBar.setAttribute('class', 'class-bar');

        dl_divs[i].appendChild(tmpClsName);
        dl_divs[i].appendChild(tmpClsBar);

        var tmpClsBar = document.createElement('div');
        tmpClsBar.setAttribute('class', 'class-bar');

        var percent = Object.values(resultObject['deep-learning'])[i];

        fillWidth = 200 * percent / 100;
        blankWidth = 200 - fillWidth;
        
        if (fillWidth == 0) {
            var blnkClassBar = document.createElement('div');
            blnkClassBar.setAttribute('class', 'ml-class-bar-blank');
            blnkClassBar.setAttribute('style', 'width: 200px; height: 20px');
            tmpClsBar.appendChild(blnkClassBar);
        } else if (blankWidth == 0) {
            var fillClassBar = document.createElement('div');
            fillClassBar.setAttribute('class', 'ml-class-bar-fill');
            fillClassBar.setAttribute('style', 'width: 200px; height: 20px');
            tmpClsBar.appendChild(fillClassBar);
        } else {
            console.log(blankWidth);
            console.log(fillWidth);
            var blnkClassBar = document.createElement('div');
            blnkClassBar.setAttribute('class', 'ai-class-bar-blank');
            blnkClassBar.setAttribute('style', 'width: ' + blankWidth + 'px; height: 20px');
    
            var fillClassBar = document.createElement('div');
            fillClassBar.setAttribute('class', 'ai-class-bar-fill');
            fillClassBar.setAttribute('style', 'width: ' + fillWidth + 'px; height: 20px');
    
            tmpClsBar.appendChild(fillClassBar);
            tmpClsBar.appendChild(blnkClassBar);
        }

        var percentText = document.createElement('div');
        percentText.setAttribute('class', 'ai-percent-box');
        percentText.setAttribute('style', 'font-size: 14px; font-weight: 900; color: #404040; position: relative; top: 50%; transform: translate(0, -50%)')
        percentText.innerHTML = percent + '%';

        if (percent != 0 ) {
            console.log('in');
            percentText.removeAttribute('style');
            percentText.setAttribute('style', 'font-size: 14px; font-weight: 900; color: green; position: relative; top: 50%; transform: translate(0, -50%)');
        }
        tmpClsBar.appendChild(percentText);

        dl_divs[i].appendChild(tmpClsBar);

        dlResBox.appendChild(dl_divs[i]);
    }

    infResBox.appendChild(dlResBox);
    infOnBox.appendChild(infResBox);
}

function callInference(sendObject) {
    var jsonData = JSON.stringify(sendObject);
    
    var _showLoad = function() {
        console.log('_showLoad');
        var loader = $("#inf-loader");
        var text = $("h4.fnt-inf");

        text.css("display", "none");
        loader.css("display", "block");

        var infBtn = $("button.inf-capture-box");
        infBtn.attr('disabled', 'disabled');
    }();

    $.ajax({
        type: 'POST',
        url: "/inference",
        data: jsonData,
        dataType: 'JSON',
        success: function(result) {
            console.log("result : " + result.message);
            var resultObject = JSON.parse(result.message);
            var _showText = function() {
                var loader = $('#inf-loader');
                var text = $("h4.fnt-inf");

                text.css("display", "block");
                loader.css("display", "none");

                var infBtn = $("button.inf-capture-box");
                infBtn.removeAttr('disabled');
            }();
            updateBar(resultObject);
        },
        error: function(xtr, status, error) {
            console.log(xtr + ": " + status + ": " + error);
        }
    })
}

function callLearning() {
    var jsonData = JSON.stringify(configObject);
    $.ajax({
        type: 'POST',
        url: "/learning",
        data: jsonData,
        dataType: 'JSON',
        success: function(result) {
            console.log("result : ", result);
            var _showText = function() {
                var loader = $("div.loader");
                var text = $("h4.fnt-trn");

                loader.css("display", "none");
                text.css("display", "block");
            }();

            var _btnAble = function () {
                $('button.trn-btn').removeAttr('disabled');
            }();
            
            var _infViewDisable = function () {
                var inferenceOn = $('div.inference-on');
                if (inferenceOn != undefined) {
                    inferenceOn.attr('display:none');
                }
            }

            inferenceView();
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

function configBtnChange() {
    var configHeader = document.getElementsByClassName('advanced-config-header')[0];
    configHeader.innerHTML = "";
    
    var newConfigHeaderDesc = document.createElement('h4');
    newConfigHeaderDesc.setAttribute('class', 'fnt-advanced');
    newConfigHeaderDesc.setAttribute('style', 'color: green');
    newConfigHeaderDesc.innerHTML = 'Advanced';

    var newConfigHeaderBtn = document.createElement('button');
    newConfigHeaderBtn.setAttribute('class', 'advanced-btn');
    newConfigHeaderBtn.setAttribute('onclick', 'configOff();');
    newConfigHeaderBtn.innerHTML = "<svg id=\"up-arrow-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"10\" viewBox=\"0 0 16 10\" fill=\"none\">\n\t"
                                + "<path fill=\"green\" d=\"M1.41 0.590088L0 2.00009L8 10.0001L16 2.00009L14.59 0.590088L8 7.170093\" transform=\"rotate(180)\" transform-origin=\"50% 50%\"></path>"
                                + "</svg>";

    configHeader.appendChild(newConfigHeaderDesc);
    configHeader.appendChild(newConfigHeaderBtn);
}

function updateConfigObj() {
    try {
        configObject['algorithm'] = document.getElementById('ml-algorithm').value;
        configObject['epochs'] = document.getElementById('ai-epochs').value;
        configObject['batch'] = document.getElementById('ai-batch').value;
        configObject['learning_rate'] = document.getElementById('ai-learningrate').value;
    } catch(e) {
        return
    }

}

function configOff() {

    updateConfigObj();

    var configBox = document.getElementById("advanced-config");
    configBox.setAttribute('class', 'advanced-config-off');
    configBox.innerHTML = "";

    var configHeader = document.createElement('div');
    configHeader.setAttribute('class', 'advanced-config-header');
    configHeader.setAttribute('id', 'advanced-config-header');

    var configHeaderDesc = document.createElement('h4');
    configHeaderDesc.setAttribute('class', 'fnt-advanced');
    configHeaderDesc.innerHTML = "Advanced";

    var configHeaderBtn = document.createElement('button');
    configHeaderBtn.setAttribute('class', 'advanced-btn');
    configHeaderBtn.setAttribute('role', 'button');
    configHeaderBtn.setAttribute('onclick', 'configOn();');
    configHeaderBtn.innerHTML = "<svg id=\"down-arrow-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"10\" viewBox=\"0 0 16 10\" fill=\"none\">\n\t"
                            + "<path fill=\"#9AA0A6\" d=\"M1.41 0.590088L0 2.00009L8 10.0001L16 2.00009L14.59 0.590088L8 7.170093\"></path>"
                            + "</svg>";

    configHeader.appendChild(configHeaderDesc);
    configHeader.appendChild(configHeaderBtn);

    configBox.appendChild(configHeader);
}

function configOn() {
    configBtnChange();

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
    mlCfSelectBox.setAttribute('id', 'ml-algorithm');
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
    aiCfEpochInputBox.setAttribute('id', 'ai-epochs');
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
    aiCfBatchInputSelect.setAttribute('id', 'ai-batch');
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
    aiCfLRDesc.innerHTML = "<h4 class=\"fnt-select-opt\">Learning Rate : </h4>";
    var aiCfLRInput = document.createElement('div');
    aiCfLRInput.setAttribute('class', 'config-select');

    aiCfLRInputBox = document.createElement('input');
    aiCfLRInputBox.setAttribute('id', 'ai-learningrate');
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