

// initialize canvas,
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');




var color = {selected: 'rgba(242, 46, 46, .3)' }
var selected = false
var current = undefined;
var pressed = {ctrl: false, shift: false, z: false, y: false, alt: false}
var circleData = {fillColor: "rgba(136, 247, 158,.6)", thickness: 1, lineColor: "rgb(136, 247, 158)", originColor: "black"}
var grid = {width:32, height:32, color:"#aaccff", offsetX:undefined , offsetY:undefined, selected:undefined, thickness: 2}
var unit = 20;
// circles.each == {originX, originY,circleRadius, points:[], fillColor, lineColor, lineWidth}
var circles = [];
var rivers = [];
var origin = {x:undefined, y:undefined};
var mouseDown = {x: undefined, y: undefined};
// positions on the grid, not on the page
var mouse = {x:undefined, y:undefined, down:false};
c.width = unit*grid.width;
c.height = unit*grid.height;
var canvas = {width: c.width, height: c.height}



// all initialize code for page load
function init(){
	findOffset($("#canvas"))
	window.requestAnimationFrame(draw)
}


function findOffset(element){
	var offset = element.offset();
	grid.offsetX = offset.left;
	grid.offsetY = offset.top;
}
// find offest of canvas


// snap x to nearest grid intersection
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
// draw any polygon, pass in object
// {points:[{x: , y:}, {x: , y:}], fillColor: "red", lineColor: "black", lineWidth: 1 }
function drawPoly(data){
	ctx.beginPath();
	// start point
	ctx.moveTo(data.points[0].x, data.points[0].y)
	// all other points
	for(var i = 1; i < data.points.length; i++){
		ctx.lineTo(data.points[i].x, data.points[i].y);
	}
	// back to first point
	ctx.lineTo(data.points[0].x, data.points[0].y)

	// Fill color
	if(data.fillColor){
		ctx.filStyle = data.fillColor;
	}else{
		ctx.fillStyle = "rgba(100,100,100,.4)"
	}
	// line color
	if(data.lineColor){
		ctx.strokeStyle = data.lineColor;
	}else{
		ctx.strokeStyle = "#000000"
	}
	// line thickness
	if(data.lineWidth){
		ctx.lineWidth = data.lineWidth
	}else{
		ctx.lineWidth = 1
	}


	ctx.fill()
	ctx.stroke()

}
// EVENT LISTENERS
// ====================================

// on mouse down
c.addEventListener("mousedown",function(){	
	mouse.down = true
	
	// {originX, originY,circleRadius, points:[], fillColor, lineColor, lineWidth}
	// if pressing ctrl or shift, start drawing square
	if(pressed.ctrl || pressed.shift){
		var x = snap(mouse.x);
		var y = snap(mouse.y);
		circles.push({originX: x, originY: y})
		current = circles.length-1
	}
	// otherwise
	else{
		for(var i = 0; i < circles.length; i++){
			if(snap(mouse.x) == circles[i].originX && snap(mouse.y) == circles[i].originY){
				circles[i].fillColor = color.selected
			}
		}
	}

	// on mousedown, start draw loop
	window.requestAnimationFrame(draw)
	

})
// on mouse up
c.addEventListener("mouseup",function(){	
	mouse.down = false
	currrent = undefined

})
c.addEventListener("mousemove", function(){
	// set mouse position
	mouse.x = (event.clientX/c.width)*c.width - grid.offsetX;
	mouse.y = (event.clientY/c.height)*c.height - grid.offsetY;
	// if square is being created, fill in squre size
	
	var snapX = snap(mouse.x);
	var snapY = snap(mouse.y);

	
	// if controll is pressed, draw square from center
	if(pressed.ctrl && mouse.down){
		// x and y Dis, = number of grid squres, the mouse moved
		var xDist = Math.abs(snapX - circles[current].originX)/unit
		var yDist = Math.abs(snapY - circles[current].originY)/unit
		// make radius, the min of mouse x and y
		circles[current].circleRadius = Math.min(xDist, yDist)
		// make square points
		var pointArray = []
		pointArray.push({
			x: circles[current].originX - (circles[current].circleRadius*unit),
			y: circles[current].originY - (circles[current].circleRadius*unit)
		},
		{
			x: circles[current].originX + (circles[current].circleRadius*unit),
			y: circles[current].originY - (circles[current].circleRadius*unit)
		},
		{
			x: circles[current].originX + (circles[current].circleRadius*unit),
			y: circles[current].originY + (circles[current].circleRadius*unit)
		},
		{
			x: circles[current].originX - (circles[current].circleRadius*unit),
			y: circles[current].originY + (circles[current].circleRadius*unit)
		})
		circles[current].points = pointArray

		
	}
	// if shift is pressed, draw square from corner
	if(pressed.shift && mouse.down){
		
	}

})

// key listeners
$(document).keydown(function(event){
	// if controll was pressed
	if(event.which == "17"){
		pressed.ctrl = true
	}
	if(event.which == "16"){
		pressed.shift = true
	}
	if(event.which == "18"){
		pressed.alt = true
	}
	if(event.which == "90"){
		pressed.z = true
		if(pressed.ctrl){
			undo()
		}
	}
	if(event.which == "89"){
		pressed.y = true
		if(pressed.ctrl){
			redo()
		}
	}
})

$(document).keyup(function(event){
	if(event.which == "17"){
		pressed.ctrl = false
	}
	if(event.which == "16"){
		pressed.shift = false
	}
	if(event.which == "18"){
		pressed.alt = false
	}
	if(event.which == "90"){
		pressed.z = false
	}
	if(event.which == "89"){
		pressed.y = false
	}
})


// disable context menu, on canvas
c.addEventListener("contextmenu", function(e){
	e.preventDefault();
	return false;
}, false);

function drawFlap(data){
	var x = data.originX
	var y = data.originY
	
	// draw the circle
	drawCircle(x, y, data.circleRadius*unit)
	// draw the origin
	drawCircle(x, y, 3, circleData.originColor, circleData.originColor)
	// draw the shape
	if(data.points){
		drawPoly(data)
	}
	

}

function drawCircle(x, y, r, color = circleData.lineColor, fill = circleData.fillColor, thickness = circleData.thickness ){
	ctx.beginPath();
	ctx.arc(x, y, r, 0,2*Math.PI)
	ctx.fillStyle = fill;
	ctx.lineWidth = thickness;
	ctx.strokeStyle = color;
	
	ctx.fill()
	ctx.stroke()
}

function undo(){

}

function redo(){

}




// draw the grid lines
function drawGrid(width, height, canvas = c){
	for(var i = 1; i < grid.width; i++){
		line((i*unit) - 1,0,(i*unit) - 1,canvas.width,grid.color, grid.thickness)

	}
	for(var i = 1; i < grid.height; i++){
		line(0,(i*unit) - 1,canvas.height,(i*unit) - 1,grid.color, grid.thickness)
	}

	line(canvas.width/2, 0, canvas.width/2, canvas.height, "grey", 3)
}






function draw(){
	// redraw grid
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(grid.width, grid.height, c)

	// draw all circles (squares). 
	for(var i = 0; i < circles.length; i++){
		drawFlap(circles[i])
	}
	// only call agin, if mouse is down
	if(mouse.down == true){
		window.requestAnimationFrame(draw)
	}
	
}






window.onload = init()