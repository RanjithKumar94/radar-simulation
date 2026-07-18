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

        if(ac.active) return;

        const spawnTime =
            timeToMinutes(ac.ccbETA) -
            entryOffset(ac.type);

        if(currentMinutes()>=spawnTime){

            ac.active=true;

            console.log(ac.callsign+" entered");

        }

    });

}
//--------------------------------------
// Start Simulator
//--------------------------------------

setInterval(function(){

    updateClock();

    spawnAircraft();

},1000);
