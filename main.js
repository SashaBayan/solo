var xMin = 0;
var xMax = 500;
var yMin = 0;
var yMax = 500;

var circles = [];
var Circle = function(x, y, r, s, d){
  this.x = x;
  this.y = y;
  this.radius = r
  this.speed = s
  this.direction = d
  this.getDistance = function(circle){
    var diffX = Math.abs(this.x - circle.x);
    var diffY = Math.abs(this.y - circle.y);
    //hypotenuse
    return Math.sqrt((diffX * diffX) + (diffY * diffY))
  }
  this.isColliding = function(circle){
    return this.getDistance(circle) < this.radius + circle.radius
  }
};

var createNewCircle = function(){
  circles.push(new Circle(50,50,10,5,[0.5,1]));
}


//Create new Dot on click of dot button
$('button').on('click', function(){
  createNewCircle();
})

circles.push(new Circle(50,50,10,5,[0.5,1]));

var updateLoop = function() {
  //iterate over the array of circles
  for (var i = 0; i < circles.length; ++i) {
    var c = circles[i];

    c.x = c.x + (c.speed * c.direction[0]);
    c.y = c.y + (c.speed * c.direction[1]);

    if (c.x > xMax - c.radius|| c.x < xMin + c.radius) c.direction[0] *= -1;
    if (c.y > yMax - c.radius|| c.y < yMin + c.radius) c.direction[1] *= -1;

    for (var j = 0; j < circles.length; j++) {
      if(j !== i){
        var c2 = circles[j];
        if(c.isColliding(c2)){
          c.direction[0] *= -1;
          //c.direction[1] *= -1;
          //c2.direction[0] *= -1;
          //c2.direction[1] *= -1;
        }
      }
    };
  }
  d3.select('svg').selectAll('circle')
    .data(circles)
    .attr('r', function(d){return d.radius})
    .attr('cx', function(d){return d.x})
    .attr('cy', function(d){return d.y})
    .enter()
    .append('circle')
};

d3.selectAll('svg')
  .style('background-color', 'pink')

updateLoop();
setInterval(updateLoop, 15);