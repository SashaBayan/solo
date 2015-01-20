var xMin = 0;
var xMax = 500;
var yMin = 0;
var yMax = 500;

var blueNote, redNote, purpleNote, greenNote, pinkNote;


//Create All Your Available Notes
soundManager.setup({
  url: '/path/to/swf-files/',
  onready: function() {
    blueNote = soundManager.createSound({
      id: 'aSound',
      url: 'piano/01C.mp3'
    });
    redNote = soundManager.createSound({
      id: 'bSound',
      url: 'piano/04E.mp3'
    });
    purpleNote = soundManager.createSound({
      id: 'cSound',
      url: 'piano/08G.mp3'
    });
    greenNote = soundManager.createSound({
      id: 'dSound',
      url: 'piano/12B.mp3'
    });
    pinkNote = soundManager.createSound({
      id: 'eSound',
      url: 'piano/22A.mp3'
    });
  },
  ontimeout: function() {
    console.log('TIMEOUT!')
  }
})

var circles = [];
var Circle = function(x, y, r, s, d, color){
  this.x = x;
  this.y = y;
  this.radius = r;
  this.speed = s;
  this.direction = d;
  this.color = color;
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

var createNewCircle = function(color){
  circles.push(new Circle(50,50,10,5,[0.5,1], color));
  //mySound.play();
}

var playNote = function(color){
  if(color === 'blue'){
    blueNote.play();
  }
  else if(color === 'red'){
    redNote.play();
  }
  else if(color === 'purple'){
    purpleNote.play();
  }
  else if(color === 'green'){
    greenNote.play();
  }
  else if(color === 'pink'){
    pinkNote.play();
  }
}

//Create new Dot on click of dot button
//NOT VERY DRY... how can you refactor this?
$('.blue').on('click', function(){
  createNewCircle('blue');
  blueNote.play();
})
$('.red').on('click', function(){
  createNewCircle('red');
  redNote.play();
})
$('.purple').on('click', function(){
  createNewCircle('purple');
  purpleNote.play();
})
$('.green').on('click', function(){
  createNewCircle('green');
  greenNote.play();
})
$('.pink').on('click', function(){
  createNewCircle('pink');
  pinkNote.play();
})

var updateLoop = function() {
  //iterate over the array of circles
  for (var i = 0; i < circles.length; ++i) {
    var c = circles[i];

    c.x = c.x + (c.speed * c.direction[0]);
    c.y = c.y + (c.speed * c.direction[1]);

    if (c.x > xMax - c.radius|| c.x < xMin + c.radius) {
      c.direction[0] *= -1;
      playNote(c.color)
    }
    if (c.y > yMax - c.radius|| c.y < yMin + c.radius) {
      c.direction[1] *= -1;
      playNote(c.color)
    }

    for (var j = 0; j < circles.length; j++) {
      if(j !== i){
        var c2 = circles[j];
        if(c.isColliding(c2)){
          c.direction[0] *= -1;
          //c.direction[1] *= -1;
          //c2.direction[0] *= -1;
          //c2.direction[1] *= -1;
         playNote(c.color)
         playNote(c2.color)
        }
      }
    };
  }
  d3.select('svg').selectAll('circle')
    .data(circles)
    .attr('r', function(d){return d.radius})
    .attr('cx', function(d){return d.x})
    .attr('cy', function(d){return d.y})
    .style('fill', function(d){return d.color})
    .style('stroke', 'black')
    .style('stroke-width', 3)
    .enter()
    .append('circle')
};

d3.selectAll('svg')
  .style('background-color', 'pink')

updateLoop();
setInterval(updateLoop, 15);