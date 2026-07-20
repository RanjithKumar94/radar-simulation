// ======================================
// main.js
// ATC Simulator Engine
// ======================================
console.log("moveAircraft loaded");
let simulatorPaused = false;


document.getElementById("pauseBtn").onclick = function(){

    simulatorPaused = true;

    console.log("Simulator Paused");

};


document.getElementById("resumeBtn").onclick = function(){


    console.log("Simulator Resumed");

};
let selectedAircraft = null;
let unknownBlips = [];
document.getElementById("rwy26Blip").onclick = function(){

    const start = bearingToXY(30, 60);   // R030 at 60 NM

    unknownBlips.push({

        x: start.x,
        y: start.y,

        heading: 180,      // South
        speed: 480,

        active: true

    });

};
// Simulation Time
let simHour = 3;
let simMinute = 0;
let simSecond = 0;

//--------------------------------------
// Time Functions
//--------------------------------------

function currentMinutes() {
    return simHour * 60 + simMinute;
}

function timeToMinutes(time) {
    const t = time.split(":");
    return parseInt(t[0]) * 60 + parseInt(t[1]);
}

function entryOffset(type) {

    switch(type){

        case "ATR72":
        case "DO228":
            return 18;

        default:
            return 14;
    }

}
document.getElementById("applyBtn").onclick = function(){

    if(selectedAircraft == null){
        alert("Select an aircraft first.");
        return;
    }

    const hdg = document.getElementById("heading").value;
    const lvl = document.getElementById("level").value;

    if(hdg !== "")
        selectedAircraft.targetHeading = parseInt(hdg);

    if(lvl !== "")
        selectedAircraft.targetLevel = parseInt(lvl);

};
//--------------------------------------
// Clock
//--------------------------------------

function updateClock(){

    simSecond++;

    if(simSecond>=60){

        simSecond=0;
        simMinute++;

    }

    if(simMinute>=60){

        simMinute=0;
        simHour++;

    }

    document.getElementById("clock").innerHTML =
        String(simHour).padStart(2,"0")+":"+
        String(simMinute).padStart(2,"0")+":"+
        String(simSecond).padStart(2,"0");

}

//--------------------------------------
// Spawn Aircraft
//--------------------------------------
function spawnRWY26Unknown() {

    const start = bearingToXY(50, 60);

    unknownBlips.push({
        x: start.x,
        y: start.y,
        heading: 180,
        speed: 480,
        active: true
    });

}
function spawnAircraft(){

    aircraft.forEach(ac=>{

        if(ac.spawned) return;

        const spawnTime =
            timeToMinutes(ac.ccbETA) -
            entryOffset(ac.type);

        if(currentMinutes()>=spawnTime){

            const start = bearingToXY(ac.entryRadial,60);

            ac.x = start.x;
            ac.y = start.y;

            ac.spawned = true;
            ac.active = true;

            console.log(ac.callsign+" entered");

        }

    });

}
// =====================================
// Arrival Descent Logic
// =====================================

// Start arrival phase at 8.5 NM
if(ac.distance <= 8.5){

    ac.arrivalPhase = true;

}


// Descend only when controller assigns 0
if(ac.arrivalPhase && ac.targetLevel === 0){

    const descentRate = 0.5; // FL per second

    if(ac.level > 0){

        ac.level -= descentRate;

        ac.verticalSpeed = -3000;


        if(ac.level <= 0){

            ac.level = 0;
            ac.verticalSpeed = 0;

        }

    }

}
//--------------------------------------
// Move Aircraft
//--------------------------------------
function moveUnknownBlips(){

    unknownBlips.forEach(blip => {

        if(!blip.active) return;

        const movement = blip.speed / 3600;

        const pixels = movement * PIXELS_PER_NM;

        const angle = (blip.heading - 90) * Math.PI / 180;

        blip.x += Math.cos(angle) * pixels;
        blip.y += Math.sin(angle) * pixels;

        const dx = blip.x - CCB.x;
        const dy = blip.y - CCB.y;

        const distance = Math.sqrt(dx * dx + dy * dy) / PIXELS_PER_NM;

        if(distance > 65){

            blip.active = false;

        }

    });

}

function moveAircraft(){

    aircraft.forEach(ac=>{

        if(!ac.active) return;


        // =====================================
        // Aircraft Speed (NM per second)
        // =====================================

        let movement;

        switch(ac.type){

            case "B777":
                movement = 5.5 / 60;
                break;

            case "B737":
            case "A320":
                movement = 5.0 / 60;
                break;

            case "ATR72":
                movement = 4.2 / 60;
                break;

            case "DO228":
                movement = 4.0 / 60;
                break;

            default:
                movement = 5.0 / 60;

        }



        // =====================================
        // Heading Control
        // =====================================

        if(ac.heading !== ac.targetHeading){

            const turnRate = 3;

            let diff = (ac.targetHeading - ac.heading + 360) % 360;

            if(diff > 180)
                diff -= 360;


            if(Math.abs(diff) <= turnRate){

                ac.heading = ac.targetHeading;

            }
            else{

                ac.heading += (diff > 0)
                ? turnRate
                : -turnRate;


                if(ac.heading < 0)
                    ac.heading += 360;

                if(ac.heading >= 360)
                    ac.heading -= 360;

            }

        }



        // =====================================
        // Normal Climb
        // =====================================

        const climbRate = 0.25; // FL/sec


        if(ac.level < ac.targetLevel){

            ac.level += climbRate;
            ac.verticalSpeed = 1500;


            if(ac.level >= ac.targetLevel){

                ac.level = ac.targetLevel;
                ac.verticalSpeed = 0;

            }

        }



        // =====================================
        // Arrival Descent Trigger
        // =====================================

        if(ac.distance <= 8.5){

            ac.arrivalPhase = true;

        }



        // =====================================
        // Controller commanded FL0 descent
        // =====================================

        if(ac.arrivalPhase && ac.targetLevel === 0){


            if(ac.level > 0){

                ac.level -= 0.5;   // approx 3000 ft/min

                ac.verticalSpeed = -3000;


                if(ac.level <= 0){

                    ac.level = 0;
                    ac.verticalSpeed = 0;

                }

            }

        }



        // =====================================
        // Move Aircraft
        // =====================================

        const pixelsPerNM = RADAR_RADIUS / MAX_RANGE;

        const pixels = movement * pixelsPerNM;


        const angle =
        (ac.heading - 90) * Math.PI / 180;


        ac.x += Math.cos(angle) * pixels;

        ac.y += Math.sin(angle) * pixels;


        ac.distance -= movement;



        if(ac.distance < 0)
            ac.distance = 0;



        // =====================================
        // Landing at CCB
        // =====================================

        if(ac.distance <= 0.1 && ac.level <= 0){

            ac.landed = true;

        }



        // =====================================
        // Remove after 3 seconds
        // =====================================

        if(ac.landed){

            ac.removeTimer = (ac.removeTimer || 0) + 1;


            if(ac.removeTimer >= 3){

                ac.active = false;

                console.log(
                    ac.callsign + " removed after landing"
                );

            }

        }


    });

}
//--------------------------------------
// Start Simulator
//--------------------------------------


setInterval(function(){

    if(simulatorPaused){
        return;
    }

    updateClock();

    spawnAircraft();

    moveAircraft();

    moveUnknownBlips();

},1000);
