const canvas = document.getElementById("canvas");
const body = document.querySelector("body");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var theColor = "";
var lineW = 5;
let prevX = null;
let prevY = null;
let draw = false;


body.style.backgroundColor = "#D4D3BF";
var theInput = document.getElementById("favcolor");

theInput.addEventListener(
  "input",
  function () {
    theColor = theInput.value;
    body.style.backgroundColor = theColor;
  },
  false
);

const ctx = canvas.getContext("2d");
ctx.lineWidth = lineW;

document.getElementById("ageInputId").oninput = function () {
  draw = null;
  lineW = document.getElementById("ageInputId").value;
  document.getElementById("ageOutputId").innerHTML = lineW;
  ctx.lineWidth = lineW;
};

let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
clrs.forEach((clr) => {
  clr.addEventListener("click", () => {
    ctx.strokeStyle = clr.dataset.clr;
  });
});


const eraserBtn = document.getElementById("eraserBtn");
eraserBtn.addEventListener("click", toggleEraser);

let eraserMode = false;

function toggleEraser() {
  eraserMode = !eraserMode;
  if (eraserMode) {
    // set stroke color to canvas background color for eraser mode
    ctx.strokeStyle = body.style.backgroundColor;
  } else {
    // set stroke color to selected color
    ctx.strokeStyle = theColor;
  }
}



let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

let saveBtn = document.querySelector(".save")
saveBtn.addEventListener("click", () => {
    let data = canvas.toDataURL("image/png");
    if (window.confirm("Are you sure you want to download this file?")) {
        let a = document.createElement("a");
        a.href = data;
        a.download = "sketch.png";
        a.click();
    }
});

window.addEventListener("mousedown", (e) => {
  draw = true;
  prevX = null;
  prevY = null;
});

window.addEventListener("mouseup", (e) => {
  draw = false;
  prevX = null;
  prevY = null;
});

canvas.addEventListener("mousemove", (e) => {
  if (draw) {
    let canvasRect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - canvasRect.left) / scale;
    let mouseY = (e.clientY - canvasRect.top) / scale;

    if (prevX == null || prevY == null) {
      prevX = mouseX;
      prevY = mouseY;
      return;
    }

    let currentX = mouseX;
    let currentY = mouseY;

    if (eraserMode) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    prevX = currentX;
    prevY = currentY;
  }
});

canvas.addEventListener("mouseleave", () => {
  draw = false;
  prevX = null;
  prevY = null;
});

window.addEventListener("mouseup", () => {
  draw = false;
  prevX = null;
  prevY = null;
});


const zoomOutButton = document.querySelector(".zoomOut-button");
let scale = 1;
zoomOutButton.addEventListener("click", () => {
  scale /= 1.1;
  canvas.style.transform = `scale(${scale})`;
  canvas.style.transformOrigin = `${event.offsetX}px ${event.offsetY}px`;
});

const zoomInButton = document.querySelector(".zoomIn-button");
scale = 1;
zoomInButton.addEventListener("click", () => {
  scale *= 1.1;
  canvas.style.transform = `scale(${scale})`;
  canvas.style.transformOrigin = `${event.offsetX}px ${event.offsetY}px`;
});

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  let delta = event.deltaY;
  if (delta < 0) {
    // scroll up
    scale *= 1.1;
  } else {
    // scroll down
    scale /= 1.1;
  }
  canvas.style.transform = `scale(${scale})`;
  canvas.style.transformOrigin = `${event.offsetX}px ${event.offsetY}px`;
});
