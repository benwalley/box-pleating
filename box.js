

// initialize canvas,
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

var width = c.width
var height = c.height

var canvas = {width: c.width, height: c.height}
var grid = {width:32, height:32, color:"#aaccff", offsetX:undefined , offsetY:undefined, selected:undefined}

var circles = [];
var rivers = [];
var origin = {x:undefined, y:undefined};
var mouse = {x:undefined, y:undefined, down:false};
// fill gridPoints, with data, using fillGrid function
var gridPoints = []
fillGrid(grid.width, grid.height, gridPoints)

var unit = width/grid.width;


function findOffset(element){
	var offset = element.offset();
	grid.offsetX = offset.left;
	grid.offsetY = offset.top;

}
// find offest of canvas
findOffset($("#canvas"))

// snap x and y, to nearest grid intersection
function snap(x){
	var newX = (Math.round(x/unit))*unit
	return(newX)
}


function line(startX,startY, endX, endY ,color = "green", width = 1,){
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX, endY);
	ctx.strokeStyle= color;
	ctx.lineWidth=width;
	ctx.stroke();
}

function drawSquare(startx, starty, endx, endy, color = "black", thickness = 1){
	ctx.rect(startx, starty, endx-startx, endy-starty);
	ctx.lineWidth=thickness;
	ctx.strokeStyle=color;
	ctx.stroke();
}
// EVENT LISTENERS
// ====================================

// on mouse down
c.addEventListener("mousedown",function(){	
	mouse.down = true
	window.requestAnimationFrame(draw)

})
// on mouse up
c.addEventListener("mouseup",function(){	
	mouse.down = false
	mouse.x = event.clientX;
	mouse.y = event.clientY;

})
c.addEventListener("mousemove", function(){
	mouse.x = event.clientX;
	mouse.y = event.clientY;
	
})
// disable context menu, on canvas
c.addEventListener("contextmenu", function(e){
	e.preventDefault();
	return false;
}, false);


// draw the grid lines
function drawGrid(width, height, canvas = c){
	for(var i = (canvas.width/width); i <= canvas.width; i += canvas.width/width){
		line(i - 1,0,i - 1,canvas.width,grid.color, 3)

	}
	for(var i = (canvas.height/height); i <= canvas.height; i += canvas.height/height){
		line(0,i - 1,canvas.height,i - 1,grid.color, 3)
	}
}



// fills array with all grid intersections, including edges
function fillGrid(width, height, varToFill){


	for(var i = 0; i <= canvas.height; i+= canvas.height/height){
		var newArray = [];
		for(var q = 0; q <= canvas.width; q+= canvas.width/width){
			newArray.push([q,i])
		}
		varToFill.push(newArray)
	}

}


function draw(){
	console.log("working")
	// if the mouse is down, redraw grid
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(grid.width, grid.height, c)

	// draw all circles (squares). 
	for(var i = 0; i < circles.length; i++){

	}
	// only call agin, if mouse is down
	if(mouse.down == true){
		window.requestAnimationFrame(draw)
	}
	
}

window.requestAnimationFrame(draw)
