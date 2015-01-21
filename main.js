var blueNote, redNote, purpleNote, greenNote, pinkNote;

var notes = {
  "C4": "01C",
  "C#4": "02Csharp",
  "D4": "03D",
  "Eb4": "04Eflat",
  "E4": "05E",
  "F4": "06F",
  "F#4": "07Fsharp",
  "G4": "08G",
  "G#4": "09Gsharp",
  "A4":"10A",
  "Bb4":"11Bflat",
  "B4":"12B",
  "C5":"13C",
  "C#5":"14Csharp",
  "D5":"15D",
  "Eb5":"16Eflat",
  "E5":"17E",
  "F5":"18F",
  "F#5":"19Fsharp",
  "G5":"20G",
  "G#5":"21Gsharp",
  "A5":"22A",
  "Bb5":"23Bflat",
  "B5":"24B",
  "C6":"25C"
}

var pitchCollections = {
  //all pitch collections are based on C
  "major9": ['C4','E4','G4','B4','D5'],
  "minor9": ['C4','Eb4','G4','Bb4','D5'],
  "ii": ['D4','F4','A4','C5','E5'],
  "V": ['G4','B4','D5','F5','A5'],
  "vi": ['G#4','C5','Eb5','F#5','G#5'],
  "VII": ['Bb4','D5','F5','G#5','C5']
}
var chordCollections = ['major9', 'minor9', 'major9', 'ii', 'V', 'vi', 'VII', 'major9']

var setPitches = function(pitchCollection){
  soundManager.setup({
    url: '/path/to/swf-files/',
    onready: function() {
      blueNote = soundManager.createSound({
        id: 'root',
        url: 'piano/' + notes[pitchCollection[0]] + '.mp3'
      });
      redNote = soundManager.createSound({
        id: 'third',
        url: 'piano/' + notes[pitchCollection[1]] + '.mp3'
      });
      purpleNote = soundManager.createSound({
        id: 'fifth',
        url: 'piano/' + notes[pitchCollection[2]] + '.mp3'
      });
      greenNote = soundManager.createSound({
        id: 'seventh',
        url: 'piano/' + notes[pitchCollection[3]] + '.mp3'
      });
      pinkNote = soundManager.createSound({
        id: 'extension',
        url: 'piano/' + notes[pitchCollection[4]] + '.mp3'
      });
    },
    ontimeout: function() {
      console.log('TIMEOUT!')
    }
  });
}


//Pitches default to a the major set
setPitches(pitchCollections.major9)

var chordNotes = ['root', 'third', 'fifth', 'seventh', 'extension']
var destroySounds = function(chordNotes){
  console.log(chordNotes.length)
  for (var i = 0; i < chordNotes.length; i++) {
    soundManager.destroySound(chordNotes[i]) //http://www.schillmania.com/projects/soundmanager2/doc/
  };
}

var currentChordCollection = 0;
$('.nextCollection').on('click', function(){
  destroySounds(chordNotes);
  console.log(currentChordCollection) 
  if(currentChordCollection > chordCollections.length - 1){
    currentChordCollection = 0
  } else {
    currentChordCollection += 1;
  }
  var currentPitchCollection = chordCollections[currentChordCollection]
  setPitches(pitchCollections[currentPitchCollection])
})

//Throttle playing of notes in order to reduce lagging from overloading the client with sounds
//setTimeout used to deal with asynchronous loading of sounds, which happen after the rest of code runs

var playBlue, playRed, playPurple, playGreen, playPink;

setInterval(function(){
  var throttleTime = 100
  playBlue = _.throttle(blueNote.play, throttleTime);
  playRed = _.throttle(redNote.play, throttleTime)
  playPurple = _.throttle(purpleNote.play, throttleTime)
  playGreen = _.throttle(greenNote.play, throttleTime)
  playPink = _.throttle(pinkNote.play, throttleTime)
}, 100)

var playNote = function(color){
  if(color === 'blue'){
    playBlue();
  }
  else if(color === 'red'){
    playRed();
  }
  else if(color === 'purple'){
    playPurple();
  }
  else if(color === 'green'){
    playGreen();
  }
  else if(color === 'pink'){
    playPink();
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
$('.user').on('click', function(){
  createUserCircle();
})

var xMin = 0;
var xMax = 900;
var yMin = 0;
var yMax = 700;

var board = 
  d3.selectAll('svg')
  .attr('height', yMax)
  .attr('width', xMax)
  .style('background-color', 'pink')
  .style('stroke', 'red')
  .style('stroke-width', 5)

var circles = [];
var Circle = function(x, y, r, s, d, color, index, isUser){
  this.x = x;
  this.y = y;
  this.radius = r;
  this.speed = s;
  this.direction = d; //takes an array of x and y coordinates for vector
  this.color = color;
  this.index = index;
  this.collisionCount = 0;
  this.collisionTimer = 0;
  this.isUser = isUser;
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
  circles.push(new Circle(50,50,10,5,[0.5,1], color, circles.length, false));  
}

var colors = ['blue', 'red', 'purple', 'green', 'pink']

var randomColor = function(){
  Math.floor(colors[Math.radom * colors.length])
}

var randomPosition = function(){

}

var createUserCircle = function(){
  circles.push(new Circle(100,100,20,1,[0,0], randomColor(), circles.length, true))
} 

//TODO -- refactor to be more DRY
//multiplies speed and direction in order to avoid dots from sticking to each other
var bounceAway = function(c, onlyX, onlyY){
  if(onlyX){
    c.direction[0] *= -1;
    c.x = c.x + (c.speed * c.direction[0] * 2.5);
  } else if(onlyY){
    c.direction[1] *= -1;
    c.y = c.y + (c.speed * c.direction[1] * 2.5);
  } else {
    c.direction[0] *= -1;
    c.x = c.x + (c.speed * c.direction[0] * 2.5);
    c.direction[1] *= -1;
    c.y = c.y + (c.speed * c.direction[1] * 2.5);
  }
}

var checkDotCollisions = function(c){
  //if a dot has collided more than 10 times in 1.5 seconds (1000x the updateLoopRate), remove it
  if(c.collisionCount > 10 && updateLoopCounter > updateLoopRate * 10){
    console.log(updateLoopCounter)
    removeDot(c)
    updateLoopCounter = 0
  } else{
    c.collisionCount = 0;
  }
}

var checkIfTooFarOutOfBounds = function(c, x, y){
  if(x){
    //if beyond the boundaries, where dots typically get stuck and perpetually bounce
    //currently set to remove when half dot's radius is beyond the borders
    if(c.x > xMax || c.x < xMin){
      removeDot(c);
    }
  } else if (y){
    if(c.y > yMax || c.y < yMin){
      removeDot(c);
    }
  }
}

var removeDot = function(c){
  circles.splice(c.index, 1);
  d3.selectAll('circle').remove();
}

var increaseCollisionCount = function(c){
  c.collisionCount++;
}

var drag = d3.behavior.drag()
    .on('drag', function(d,i) {
      c = d3.select(this);
      c.data()[0]['x'] = d3.event.x
      c.data()[0]['y'] = d3.event.y
    })

var updateLoop = function() {
  //iterate over the array of circles
  for (var i = 0; i < circles.length; ++i) {
    var c = circles[i];

    c.x = c.x + (c.speed * c.direction[0]);
    c.y = c.y + (c.speed * c.direction[1]);

    checkIfTooFarOutOfBounds(c, true, true);

    if (c.x > xMax - c.radius|| c.x < xMin + c.radius) {
      bounceAway(c, true)
      increaseCollisionCount(c)
      //checkDotCollisions(c);
      playNote(c.color)
    }
    if (c.y > yMax - c.radius|| c.y < yMin + c.radius) {
      bounceAway(c, null, true)
      increaseCollisionCount(c)
      //checkDotCollisions(c);
      playNote(c.color)
    }

    for (var j = 0; j < circles.length; j++) {
      if(j !== i){
        var c2 = circles[j];
        if(c.isColliding(c2)){
          bounceAway(c)
          bounceAway(c2)
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
    .call(drag)
    /*.on('mousemove', function(c){
      //passes in individual circle to fling function
      fling(d3.select(this))
    });*/

    updateLoopCounter++;
};

var fling = function(c){
  var timer = 0;
  //set up a timer between dragstart and dragend
  //find the distance between dragstart and dragend
  //do some math with the time and distance to determine
  //how to change the speed of the circle
/*  setInterval(function(){
    timer++;
  }, 100)
  d3.behavior.drag()
    .on('drag', function(d, i){*/

      c.data()[0]['x'] = d3.event.pageX
      c.data()[0]['y'] = d3.event.pageY
      //c.data('y', d3.event.pageY)
    // })
}


// setTimeout(circles[0].call(dragmove);

//player.call(dragmove);

updateLoop();
var updateLoopRate = 15; //miliseconds
var updateLoopCounter = 0; //how many times the update loop has run
setInterval(updateLoop, updateLoopRate);