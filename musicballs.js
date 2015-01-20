var jsonCircles = [
   { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green","stroke": "black", "stroke_width": 4 },
/*   { "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
   { "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}*/];

circleData = {
  //direction vectors
  //normalized/ unit vectors
    //aka, which direction it's going
    //must have a magnitude of 1
        //the hypotenuse
  //speed
  //game loop -- running once per frame

}


var gameBoard = {
  height: 750,
  width:750,
}

var board = d3.select('body')
            .data([1])
            .enter()
            .append('svg')
            .attr('width', gameBoard.width)
            .attr('height', gameBoard.height)
            .style('background-color','pink')
            .style('opacity', '.8')
            .style("border", "black")
            .style("stroke-width", 4)

var circles = board.selectAll('circle')
  .data(jsonCircles)
  .enter()
  .append('circle')


var circleAttributes = circles
    .attr("cx", function (d) { return d.x_axis; })
    .attr("cy", function (d) { return d.y_axis; })
    .attr("r", function (d) { return d.radius; })
    .style("fill", function(d) { return d.color; })
    .style("stroke", function(d) { return d.stroke; })
    .style("stroke-width", function(d) { return d.stroke_width; });


var move = function(){
  board.selectAll('circle')
  .transition()
  .duration(2500)
  .attr({'cx': randomX(), 'cy': randomY()});
};

var bounceOffWall = function(){
  if(d3.event.x > 750 || d3.event.x < 0){
    d3.event.x *= -1;
    console.log('lol')
  }
}


setInterval(move, 1/60)

var randomX = function(){
  return Math.floor(Math.random() * gameBoard.width);
}

var randomY = function(){
  return Math.floor(Math.random() * gameBoard.height);
}


var gameLoop = function(){
  //has access to all the circles
  //moves each of them based on an interval
    //this can be done by wrapping this function in a set interval
  //move circles by their normalized vector * speed * vector
}

