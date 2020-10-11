function test_button() {
    alert('button');
}

function dynamic_test_button() {
    // $('webcam-button').css({
    //     width: "200px",
    //     height: "500px"
    // });
    var el = document.getElementById("webcam-button");
    var tmp_html = el.innerHTML;
    el.style.width = "300px";
    el.style.height = "500px";

    alert(tmp_html)
    // $("webcam-button").content().
}