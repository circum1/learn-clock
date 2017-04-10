(function () {

    var center;
    var width, height;
    var currentTime=0;

    const MAXTIME = 12*60;

$(window).on('load', function () {

    $("#testbtn").on("click", function() {
        putNagy(currentTime+60);
    });

    $("#nagymutato").on("mousedown touchstart", bigClicked);
    $(window).on("mouseup touchend", function() {
        console.log("released");
        $(window).off("mousemove touchmove", bigMoved);
    });

    $("#random").on("click", function() {
        putNagy(Math.round(Math.random()*MAXTIME));
    });

    $("#showtime").on("click", function() {
        var mins = Math.round(currentTime % 60);
        var hours = Math.round((currentTime - mins) / 60);
        if (hours==0) hours=12;
        $("#timelabel").text("" + hours + " óra " + mins + " perc");
    });

    $(window).on("resize", function() {
        onResize();
    });

    onResize();
});

function onResize() {
    width = $("#szamlap")[0].offsetWidth;
    height = $("#szamlap")[0].offsetHeight;
    console.log("width, height: ", width, height);
    center = [width/2, height/2*(0.99)];
    putNagy(currentTime);
}

function putNagy(minutes) {
    console.log("putNagy(", minutes, ")");
    if (minutes < 0) minutes += MAXTIME;
    minutes = minutes % (MAXTIME);
    currentTime = minutes;
    var el = $("#nagymutato");
    el[0].style.width=center[0] * 0.90;
    el[0].style.height=Math.min(center[0], center[1]) * 0.90;
    var bigRelCenter = [.5, .91];
    // center offset
    var co = [el.width() * bigRelCenter[0], el.height() * bigRelCenter[1]];
    var translate = "" + (center[0]-co[0]) + "px," + (center[1]-co[1]) + "px";
    //~ console.log("translate: ", translate);
    el[0].style.transform = "translate("+translate+")" + " rotate(" + minutes * 6 + "deg)";
    el[0].style.transformOrigin = "" + bigRelCenter[0]*100 + "% " + bigRelCenter[1]*100 + "%";

    putSmall(minutes);
    $("#timelabel").text("");
}

function putSmall(minutes) {
    var hours = minutes/60;
    console.log("putSmall(", minutes, ")");
    var el = $("#kismutato");
    el[0].style.width=center[0] * 0.70;
    el[0].style.height=Math.min(center[0], center[1]) * 0.70;
    var relCenter = [.5, .85];
    // center offset
    var co = [el.width() * relCenter[0], el.height() * relCenter[1]];
    var translate = "" + (center[0]-co[0]) + "px," + (center[1]-co[1]) + "px";
    el[0].style.transform = "translate("+translate+")" + " rotate(" + hours * 30 + "deg)";
    el[0].style.transformOrigin = "" + relCenter[0]*100 + "% " + relCenter[1]*100 + "%";

    // 0.908, 91/170
}

function bigClicked() {
    console.log("clicked");
    $(window).on('mousemove touchmove', bigMoved);
}


function bigMoved(e) {
        console.log("bigMoved: ", e);
    e.originalEvent.preventDefault();

    var x, y;
    if (e.pageX===undefined) {
        x = e.originalEvent.touches[0].pageX;
        y = e.originalEvent.touches[0].pageY;
    } else {
        x = e.pageX;
        y = e.pageY;
    }
    if (typeof x !== 'number') return;

    var offs = $(".fullscreen-div").offset();
    var pos = [x - offs.left, y - offs.top];
    var shift = [pos[0] - center[0], pos[1] - center[1]];

    var arc = Math.atan2(-shift[1], shift[0]);
    // arc is counterclockwise, hence the *-1
    // zero belongs to 3h, hence the +90
    var deg = -arc*180/Math.PI + 90;

    // can be negative.,,
    var mins = Math.round(deg / 6);

    // always positive
    var diff = (mins + 60 + MAXTIME - currentTime) % 60;
    if (diff>30) diff -= 60;
    if (diff != 0) {
        console.log("x:", x, ", y:", y, "mins: ", mins, "diff: ", diff, "current: ", currentTime);
        putNagy(currentTime + diff);
    }
}

//~ window.setInterval(function() {
    //~ putNagy(testrot);
    //~ putSmall(testrot-90);
    //~ testrot = testrot+6;
//~ }, 1000);

}());
