// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;
let vid;
let snap;
let paused = 0;
let cnv;
let videoConstraints;
let images;

// let test1 = "hotdog, hot dog, red hot";
// console.log(test1.search("hotdog"));

// let test2 = "hot";
// if(test2.search("hot") !== -1 && test2.search("dog") !== -1) {
//     console.log("yey");
// } else {
//     console.log("nah");
// }

function preload() {
    classifier = ml5.imageClassifier('MobileNet');
    // images = [loadImage("images/img1.jpg"),loadImage("images/img2.jpg"),loadImage("images/img3.jpg")];
    // img = loadImage("images/img" + (Math.floor(Math.random() * Math.floor(3)) + 1).toString() + ".jpg");
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

// function getRandomImage() {
//     return images[Math.floor(Math.random() * images.length)];
// }

function touchStarted() {
    if (!paused) {
        noLoop();
        snap = vid.get();
        classifier.classify(snap, gotResult);
        // classifier.classify(getRandomImage(), gotResult);
        document.getElementById("canvas-holder").style.zIndex = "10";
        document.getElementById("video-holder").style.zIndex = "5";
        document.getElementById("evaluating").style.display = "block";
        document.getElementById("help").style.display = "none";
    } else {
        loop();
        paused = 0;
        document.getElementById("canvas-holder").style.zIndex = "5";
        document.getElementById("video-holder").style.zIndex = "10";
        document.getElementById("evaluating").style.display = "none";
        document.getElementById("hotdog").style.display = "none";
        document.getElementById("not-hotdog").style.display = "none";
        document.getElementById("help").style.display = "block";
    }
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
    // Display error in the console
    if (error) {
        console.error(error);
    }
    // The results are in an array ordered by confidence.
    // console.log(results);
    // console.log(results[0].label);

    setTimeout(() => {
        if(results[0].label.search("hot") !== -1 && results[0].label.search("dog") !== -1) {
            document.getElementById("evaluating").style.display = "none";
            document.getElementById("hotdog").style.display = "block";
        } else {
            document.getElementById("evaluating").style.display = "none";
            document.getElementById("not-hotdog").style.display = "block";
        }
        paused = 1;
    }, 1500);

    // createDiv('Label: ' + results[0].label);
    // createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
}