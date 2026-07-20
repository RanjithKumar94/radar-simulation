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

    const start = bearingToXY(80,5);

    departures.push({

        callsign:"DEP001",

        type:"A320",

        x:start.x,
        y:start.y,


        heading:260,
        targetHeading:260,


        level:0,
        targetLevel:100,


        verticalSpeed:0,


        active:true

    });


    console.log("DEP001 airborne");

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
