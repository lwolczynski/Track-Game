document.addEventListener('DOMContentLoaded', (event) => {
    const point = document.querySelector(".point");
    const startX = parseInt(window.getComputedStyle(point).left);
    const startY = parseInt(window.getComputedStyle(point).top);
    const scorebox = document.querySelector(".inner_oval");
    document.body.onkeyup = function(e) {
        if (e.keyCode == 32) spaceDown = false;
    }
    document.body.onkeydown = function(e) {
        if (e.keyCode == 32) spaceDown = true;
        if (e.keyCode == 82 && !running) game(point, startX, startY, scorebox);
        
    }
});

//Values to match with CSS
const width=560;
const height=360;
const diffSize=20;
const pointSize=20;
const shadowSize=5;
const errSize=pointSize/2-shadowSize;

//Game running
let running = false;

//Space clicked
let spaceDown = false;

//Run game
function game(point, startX, startY, scorebox) {
    running = true;
    let lap = 0;
    let lvl = 0.9;
    let oldX = startX;
    let x = startX;
    let y = startY;
    let id = setInterval(frame, 1);
    let transX = {val: 100, increase: 1};
    let transY = {val: 0, increase: -1};
    scorebox.innerHTML=`Lap 0`;
    function frame() {
        if (spaceDown) {
            transX = changeTrack(transX, lvl);
            transY = changeTrack(transY, lvl);
        }
        oldX = x;
        x+=transX.val/100*lvl;
        y+=transY.val/100*lvl;
        if (ifLost(x, y)) {
            clearInterval(id);
            running = false;
            scorebox.innerHTML=`Game over!<br>Result: ${lap} lap(s)<br><br>R to start`;
        } else {
            if (oldX<width/2 && x>=width/2) {
                lap++;
                lvl+=0.1;
                scorebox.innerHTML=`Lap ${lap}<br>Speed x${lvl.toFixed(1)}`;
            };
            point.style.left = x + 'px';
            point.style.top = y + 'px';
        }
    }
}

//Change point track
function changeTrack(transObj, lvl) {
    const sensitivity = 2.85;
    const step = sensitivity/lvl;
    let increase = transObj.increase;
    if (Math.abs(transObj.val) >= 100) {
        increase = increase*(-1);
    }
    return {val: transObj.val+increase/step, increase: increase}
}

//Verify if user has lost
function ifLost(x, y) {
    //Point on the straight part of track
    if (x>=height/2 && x<=width-height/2) {
        if ((y>=0+errSize && y<=4*diffSize-errSize) || (y>=height-4*diffSize+errSize && y<=height-errSize)) return false;
    //Point on the curve
    } else if (x>=0 && x<=width) {
        return ifLostOnCurve(x, y);
    }
    return true;
}

function ifLostOnCurve(x, y) {
    let dst; //Distance from middle of the semicircle
    const yDst = Math.abs(height/2-y);
    const min = height/2-4*diffSize+errSize;
    const max = height/2-errSize;
    if (x<width/2) dst = Math.sqrt(Math.pow((height/2-x), 2) + Math.pow(yDst, 2));
    else dst = Math.sqrt(Math.pow((x-(width-height/2)), 2) + Math.pow(yDst, 2));
    return (dst<min || dst>max)
}  