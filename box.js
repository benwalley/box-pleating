

// initialize canvas,
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

var width = c.width
var height = c.height

var canvas = {width: c.width, height: c.height}
var grid = {width:32, height:32, color:"#aaccff"}
// fill gridPoints, with data, using fillGrid function
var gridPoints = []
fillGrid(grid.width, grid.height, gridPoints)

function line(startX,startY, endX, endY ,color = "green", width = 1,){
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX, endY);
	ctx.strokeStyle= color;
	ctx.lineWidth=width;
	ctx.stroke();
}

// 
function drawGrid(width, height, canvas = c){
	for(var i = (canvas.width/width); i <= canvas.width; i += canvas.width/width){
		line(i - 1,0,i - 1,canvas.width,grid.color, 3)

	}
	for(var i = (canvas.height/height); i <= canvas.height; i += canvas.height/height){
		line(0,i - 1,canvas.height,i - 1,grid.color, 3)
	}
}

drawGrid(32,32,c)

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


