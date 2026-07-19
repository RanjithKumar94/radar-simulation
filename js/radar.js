// ======================================
// ATC RADAR SIMULATOR
// radar.js - PART 1
// ======================================

// Canvas
const canvas = document.getElementById("radar");
const ctx = canvas.getContext("2d");

// Radar Size
const RADAR_RADIUS = 380;
const MAX_RANGE = 60;
const PIXELS_PER_NM = RADAR_RADIUS / MAX_RANGE;

function nm(value){
    return value * PIXELS_PER_NM;
}

// Radar Centre
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;

// CCB VOR
const CCB = {
    x: CENTER_X,
    y: CENTER_Y + 3
};

// Colours
const BG_COLOR = "#001100";
const RING_COLOR = "#00aa44";
const ROUTE_COLOR = "#00ff66";
const TEXT_COLOR = "#00ff66";

// ATS Routes
const ROUTES = [

    {name:"B425", bearing:190},
    {name:"W14", bearing:350},
    {name:"R416", bearing:70},
    {name:"Q1", bearing:252},
    {name:"Q2", bearing:270},
    {name:"G473 NW", bearing:300},
    {name:"G473 SE", bearing:120}

];

// ======================================
// Convert Bearing & Distance to X,Y
// ======================================

function bearingToXY(bearing, distance){

    const angle = (bearing - 90) * Math.PI / 180;

    const scale = RADAR_RADIUS / MAX_RANGE;

    return {

        x: CCB.x + Math.cos(angle) * distance * scale,

        y: CCB.y + Math.sin(angle) * distance * scale

    };

}

// ======================================
// Radar Background
// ======================================

function drawBackground(){

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = RING_COLOR;
    ctx.lineWidth = 1;

    for(let i=10;i<=60;i+=10){

        ctx.beginPath();

        ctx.arc(
            CCB.x,
            CCB.y,
            i * RADAR_RADIUS / MAX_RANGE,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }
}
  // ======================================
// PART 2
// Draw Runway
// ======================================

function drawRunway(){

    const p1 = bearingToXY(260,10);
    const p2 = bearingToXY(80,10);

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";

    ctx.fillText("08",p1.x-22,p1.y+8);
    ctx.fillText("26",p2.x+8,p2.y+8);

}

// ======================================
// Draw Extended Runway Centreline
// ======================================

function drawCentreline(){

    const start = bearingToXY(260,15);
    const end   = bearingToXY(80,15);

    ctx.save();

    ctx.strokeStyle="#FFFF00";
    ctx.lineWidth=2;
    ctx.setLineDash([10,6]);

    ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    ctx.lineTo(end.x,end.y);
    ctx.stroke();

    ctx.restore();

}
// ======================================
// Draw Traffic Circuit RWY 08/26
// ======================================

function drawTrafficCircuit(){

    // Runway thresholds
    const rwy08 = bearingToXY(260,10);
    const rwy26 = bearingToXY(80,10);

    // 15 NM centreline extension
    const ext08 = bearingToXY(260,25);
    const ext26 = bearingToXY(80,25);

    // 5 NM offset (north side)
    const offset = nm(5);

    ctx.strokeStyle="#FFFF00";
    ctx.lineWidth=2;

    // --------------------------
    // Extended centreline
    // --------------------------
    ctx.setLineDash([8,8]);

    ctx.beginPath();
    ctx.moveTo(ext08.x,ext08.y);
    ctx.lineTo(ext26.x,ext26.y);
    ctx.stroke();

    ctx.setLineDash([]);

    // --------------------------
    // Calculate runway direction
    // --------------------------
    const dx = rwy26.x-rwy08.x;
    const dy = rwy26.y-rwy08.y;

    const len = Math.sqrt(dx*dx+dy*dy);

    const ux = dx/len;
    const uy = dy/len;

    // Perpendicular vector
    const px = -uy;
    const py = ux;

    // Circuit points
    const p1 = {
        x:rwy08.x + px*offset,
        y:rwy08.y + py*offset
    };

    const p2 = {
        x:rwy26.x + px*offset,
        y:rwy26.y + py*offset
    };

    const p3 = {
        x:ext26.x + px*offset,
        y:ext26.y + py*offset
    };

    const p4 = {
        x:ext08.x + px*offset,
        y:ext08.y + py*offset
    };

    // --------------------------
    // Draw circuit
    // --------------------------
    ctx.beginPath();

    ctx.moveTo(rwy08.x,rwy08.y);
    ctx.lineTo(rwy26.x,rwy26.y);

    ctx.lineTo(p3.x,p3.y);

    ctx.lineTo(p4.x,p4.y);

    ctx.lineTo(rwy08.x,rwy08.y);

    ctx.stroke();

}

// ======================================
// Draw CCB VOR
// ======================================

function drawCCB(){

    ctx.beginPath();
    ctx.arc(CCB.x,CCB.y,4,0,Math.PI*2);

    ctx.fillStyle="#00FFFF";
    ctx.fill();

    ctx.font="16px Arial";
    ctx.fillStyle="#00FFFF";

    ctx.fillText("CCB",CCB.x+8,CCB.y-8);

}

// ======================================
// Draw ATS Routes
// ======================================

function drawRoutes(){

    ctx.strokeStyle=ROUTE_COLOR;
    ctx.lineWidth=2;

    ROUTES.forEach(route=>{

        const end = bearingToXY(route.bearing,60);

        ctx.beginPath();
        ctx.moveTo(CCB.x,CCB.y);
        ctx.lineTo(end.x,end.y);
        ctx.stroke();

        const label = bearingToXY(route.bearing,56);

        ctx.fillStyle = TEXT_COLOR;
        ctx.font = "15px Consolas";

        ctx.fillText(
            route.name,
            label.x-15,
            label.y
        );

    });

}
// ======================================
// TRAFFIC CIRCUIT CONFIGURATION
// ======================================

const CIRCUIT = {

    centreline:15,
    final:8,
    upwind:8,
    downwind:12,
    width:5

};

  // ======================================
// PART 3
// Draw Aircraft (placeholder)
// ======================================

function drawAircraft(){

    if(typeof aircraft === "undefined") return;

    aircraft.forEach(ac=>{

        if(!ac.active) return;

const pos = {
    x: ac.x,
    y: ac.y
};
        // Aircraft symbol
        ctx.fillStyle="#00FF00";

        ctx.beginPath();
        ctx.arc(pos.x,pos.y,4,0,Math.PI*2);
        ctx.fill();

        // Leader line
        ctx.beginPath();
        ctx.moveTo(pos.x+4,pos.y-4);
        ctx.lineTo(pos.x+35,pos.y-20);
        ctx.strokeStyle="#00FF00";
        ctx.stroke();

        // Callsign
        ctx.font="14px Consolas";
        ctx.fillStyle="#00FF00";
        ctx.fillText(ac.callsign,pos.x+38,pos.y-20);

        // Flight Level
        ctx.fillText("FL"+ac.level,pos.x+38,pos.y-5);

        // Speed
        ctx.fillText(ac.speed+"KT",pos.x+38,pos.y+10);

    });

}
// ======================================
// Draw Complete Radar
// ======================================

function drawRadar(){

    // Clear screen
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Draw radar
    drawBackground();
    drawRoutes();
    drawRunway();
    drawTrafficCircuit();
    drawCentreline();
    drawCCB();

    // Draw aircraft
    drawAircraft();

    // Continue animation
    requestAnimationFrame(drawRadar);

}

// ======================================
// Start Radar
// ======================================

window.onload = function(){

    drawRadar();

};


