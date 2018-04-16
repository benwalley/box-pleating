

// initialize canvas,
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width
var height = canvas.height

var canvas = {width: canvas.width, height: canvas.height}
var grid = {width:32, height:32, color:"#aaccff"}


function line(startX,startY, endX, endY ,color = "green", width = 1,){
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX, endY);
	ctx.strokeStyle= color;
	ctx.lineWidth=width;
	ctx.stroke();
}

// 
function drawGrid(width, height, canvas = canvas){
	for(var i = (canvas.width/width); i <= canvas.width; i += canvas.width/width){
		line(i,0,i,canvas.width,grid.color, 4)
		console.log(i)
	}
	for(var i = (canvas.height/height); i <= canvas.height; i += canvas.height/height){
		line(0,i,canvas.height,i,grid.color, 4)
		console.log(i)
	}
}

drawGrid(32,32,canvas)