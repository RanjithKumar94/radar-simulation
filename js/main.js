// ======================================
// main.js
// ATC Simulator Engine
// ======================================

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

    const cs = document.getElementById("callsign").value.toUpperCase();
    const hdg = parseInt(document.getElementById("heading").value);

    aircraft.forEach(ac => {

        if(ac.callsign === cs){

            ac.targetHeading = hdg;

        }

    });

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

//--------------------------------------
// Move Aircraft
//--------------------------------------


function moveAircraft(){

    aircraft.forEach(ac=>{

        if(!ac.active) return;

        let movement;

        // Speed (NM/sec)
        if(ac.type==="ATR72" || ac.type==="DO228"){

            movement = 4.0/60;

        }else{

            movement = (ac.distance>30) ? 5.5/60 : 5.0/60;

        }

        // Turn towards assigned heading
        if(ac.heading !== ac.targetHeading){

    const turnRate = 3;

    if(ac.turnDirection === "LEFT"){

        ac.heading -= turnRate;

        if(ac.heading < 0)
            ac.heading += 360;

    }

    else if(ac.turnDirection === "RIGHT"){

        ac.heading += turnRate;

        if(ac.heading >= 360)
            ac.heading -= 360;

    }

    else{

        // SHORTEST (current behaviour)

        let diff = (ac.targetHeading - ac.heading + 360) % 360;

        if(diff > 180)
            diff -= 360;

        if(Math.abs(diff) <= turnRate){

            ac.heading = ac.targetHeading;

        }else{

            ac.heading += (diff > 0) ? turnRate : -turnRate;

            if(ac.heading < 0) ac.heading += 360;
            if(ac.heading >= 360) ac.heading -= 360;

        }

    }

    // Stop turning when target reached
    let error = (ac.targetHeading - ac.heading + 360) % 360;

    if(error > 180)
        error -= 360;

    if(Math.abs(error) <= turnRate){

        ac.heading = ac.targetHeading;
        ac.turnDirection = "SHORTEST";

    }

}

        }

        console.log(
            ac.callsign,
            "Current:", ac.heading,
            "Target:", ac.targetHeading
        );

        // Convert movement to pixels
        const pixelsPerNM = RADAR_RADIUS / MAX_RANGE;
        const pixels = movement * pixelsPerNM;

        // Move according to heading
        const angle = (ac.heading - 90) * Math.PI / 180;

        ac.x += Math.cos(angle) * pixels;
        ac.y += Math.sin(angle) * pixels;

        ac.distance -= movement;

        if(ac.distance <= 0){

            ac.active = false;
            console.log(ac.callsign + " reached CCB");

        }

    });

}

//--------------------------------------
// Start Simulator
//--------------------------------------

setInterval(function(){

    updateClock();

    spawnAircraft();

    moveAircraft();

},1000);
