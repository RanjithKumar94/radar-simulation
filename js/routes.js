console.log("routes.js loaded");


// ========================
// Route data
// ========================

const routes = [

{
 name:"CCB-PJ",
 points:[
   {
    radial:190,
    distance:30
   }
 ]
},

{
 name:"PJ160",
 start:"PJ",
 heading:160
},

{
 name:"PJ109",
 start:"PJ",
 heading:109
},

{
 name:"CCB-NAG",
 start:"CCB",
 heading:88
}

];


// ========================
// Draw routes on radar
// ========================

function drawRoutes(){

    console.log("drawing routes");


    ctx.strokeStyle="#555555";
    ctx.lineWidth=1;


    // CCB to PJ

    const PJ = bearingToXY(190,30);


    ctx.beginPath();

    ctx.moveTo(
        CCB.x,
        CCB.y
    );


    ctx.lineTo(
        PJ.x,
        PJ.y
    );


    ctx.stroke();


    // PJ label

    ctx.fillStyle="#FFFFFF";
    ctx.font="12px Consolas";

    ctx.fillText(
        "PJ",
        PJ.x+5,
        PJ.y
    );

}
