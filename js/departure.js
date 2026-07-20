// ======================================
// departure.js
// ATC Simulator Departure Engine
// ======================================
console.log("departure.js loaded");

let departures = [];


// ======================================
// Spawn RWY 26 Departure Button
// ======================================

document.getElementById("depRwy26").onclick = function(){

    alert(
        "Callsign = " + document.getElementById("depcallsign").value +
        "\nLevel = " + document.getElementById("deplevel").value
    );




const levelInput =
document.getElementById("level").value.trim();


console.log(
    "CALLSIGN BOX:",
    document.getElementById("depcallsign"),
    "VALUE:",
    depcallsignInput
);

console.log(
    "LEVEL BOX VALUE:",
    deplevelInput
);


console.log(
    "INPUT:",
    depcallsignInput,
    deplevelInput
);
    const start = bearingToXY(260,1); // West of CCB


    departures.push({

        callsign: callsignInput || "DEP001",

        type:"A320",

        x:start.x,
        y:start.y,


        labelAngle:0,


        heading:260,
        targetHeading:260,

        turnDirection:"SHORTEST",


        level:0,

        targetLevel:
        deplevelInput !== ""
        ? Number(deplevelInput)
        : 100,


        verticalSpeed:0,

        speed:250,


        active:true

    });


    console.log(
        "Departure created:",
        callsignInput,
        "FL",
        levelInput
    );

};

document.getElementById("depRwy08").onclick = function(){

    const callsignInput =
    document.getElementById("depcallsign").value;


    const levelInput =
    document.getElementById("deplevel").value;


    const start = bearingToXY(80,1); // East of CCB


    departures.push({

        callsign:
        callsignInput || "DEP002",

        type:"A320",

        x:start.x,
        y:start.y,


        labelAngle:0,


        heading:080,
        targetHeading:080,


        turnDirection:"SHORTEST",


        level:0,

        targetLevel:
        deplevelInput !== ""
        ? Number(deplevelInput)
        : 100,


        verticalSpeed:0,

        speed:250,


        active:true

    });

console.log("CREATED AIRCRAFT:", departures[departures.length-1]);
    console.log(
        "Departure created:",
        depcallsignInput,
        "FL",
        deplevelInput
    );

};



// ======================================
// Move Departures
// ======================================

function moveDepartures(){


    departures.forEach(ac=>{


        if(!ac.active) return;



        // Speed 5 NM/min

        const movement = 5 / 60;


        const pixels =
        movement * PIXELS_PER_NM;



        const angle =
        (ac.heading - 90) * Math.PI / 180;



        ac.x += Math.cos(angle) * pixels;

        ac.y += Math.sin(angle) * pixels;



        // Climb

        if(ac.level < ac.targetLevel){


            ac.level += 0.25;


            ac.verticalSpeed = 1500;



            if(ac.level >= ac.targetLevel){

                ac.level = ac.targetLevel;

                ac.verticalSpeed = 0;

            }

        }


    });

}
console.log(typeof moveDepartures);
