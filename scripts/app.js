let classifier;
let img;
let vid;
let snap;
let paused = 0;
let cnv;
let videoConstraints;
let images;
let advanced = 0;

function preload() {
    classifier = ml5.imageClassifier('MobileNet');
}

function setup() {
    if (windowWidth > windowHeight) {
        videoConstraints = {
            audio: false,
            video: {
                aspectRatio: windowWidth/windowHeight,
                facingMode: {
                    exact: "environment"
                }
            }
        };
    } else {
        videoConstraints = {
            audio: false,
            video: {
                aspectRatio: windowHeight/windowWidth,
                facingMode: {
                    exact: "environment"
                }
            }
        };
    }

    vid = createCapture(videoConstraints);

    vid.size(windowWidth, windowHeight);

    cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');

    vid.parent('video-holder');
    cnv.parent('canvas-holder');
}

function draw() {
    image(vid, 0, 0);
}

function touchStarted() {
    if (!paused) {
        noLoop();
        snap = vid.get();
        classifier.classify(snap, gotResult);
        document.getElementById("canvas-holder").style.zIndex = "10";
        document.getElementById("video-holder").style.zIndex = "5";
        document.getElementById("evaluating").style.display = "block";
        document.getElementById("help").style.display = "none";
        document.getElementById("overlay").style.background = "hsla(0, 0%, 100%, 0.4)";
    } else {
        // 0.1 equals 10% as specified as the height of the header
        if (mouseY <= windowHeight * 0.1) {
            if (!advanced) {
                advanced = 1;
                document.getElementById("state").textContent = "ON";
                document.getElementById("toggle").style.background = "#008A23";
                document.getElementById("description").style.display = "block";
            } else {
                advanced = 0;
                document.getElementById("state").textContent = "OFF";
                document.getElementById("toggle").style.background = "grey";
                document.getElementById("description").style.display = "none";
            }
        } else {
            loop();
            paused = 0;
            document.getElementById("canvas-holder").style.zIndex = "5";
            document.getElementById("video-holder").style.zIndex = "10";
            document.getElementById("evaluating").style.display = "none";
            document.getElementById("hotdog").style.display = "none";
            document.getElementById("not-hotdog").style.display = "none";
            document.getElementById("advanced").style.display = "none";
            document.getElementById("help").style.display = "block";
        }
    }
}

function gotResult(error, results) {
    // Display any errors
    if (error) {
        console.error(error);
    }

    // 1.5 s time out so evaluating screen shows up for longer
    setTimeout(() => {
        // Results are returned in an array, check if both "hot" and "dog" occur
        if(results[0].label.search("hot") !== -1 && results[0].label.search("dog") !== -1) {
            document.getElementById("evaluating").style.display = "none";
            document.getElementById("hotdog").style.display = "block";
        } else {
            document.getElementById("evaluating").style.display = "none";
            document.getElementById("not-hotdog").style.display = "block";
            document.getElementById("advanced").style.display = "block";
            document.getElementById("description").innerHTML = results[0].label.split(",")[0].charAt(0).toUpperCase() + results[0].label.split(",")[0].slice(1) + "<br />" + parseFloat(Math.round(results[0].confidence * 100)) + "% confidence";
        }
        paused = 1;
        document.getElementById("overlay").style.background = "";
    }, 1500);
}