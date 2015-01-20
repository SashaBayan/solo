
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
  "half_dim": ['C4','Eb4','F#4','Bb4','D5'],
  "fully_dim": ['C4','Eb4','F#4','A4','Eb5'],
  "minor_major7": ['C4','Eb4','F#4','B4','Eb5'],
  "whole_tone": ['C4','D4','E4','F#4','G#5']
}
var chordCollections = ['major9', 'minor9', 'half_dim', 'fully_dim', 'minor_major7', 'whole_tone']

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
var Circle = function(x, y, r, s, d, color, index){
  this.x = x;
  this.y = y;
  this.radius = r;
  this.speed = s;
  this.direction = d;
  this.color = color;
  this.index = index;
  this.collisionCount = 0;
  this.collisionTimer = 0;
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
  circles.push(new Circle(50,50,10,5,[0.5,1], color, circles.length));  
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
  console.log(updateLoopCounter)
  //if a dot has collided more than 10 times in 1.5 seconds (10x the updateLoopRate), remove it
  if(c.collisionCount > 10 && updateLoopCounter > updateLoopRate * 10){
    console.log(updateLoopCounter)
    removeDot(c)
    updateLoopCounter = 0
  }
}

var removeDot = function(c){
  circles.splice(c.index, 1);
  d3.selectAll('circle').remove();
}

var increaseCollisionCount = function(c){
  c.collisionCount++
}

var updateLoop = function() {
  //iterate over the array of circles
  for (var i = 0; i < circles.length; ++i) {
    var c = circles[i];

    c.x = c.x + (c.speed * c.direction[0]);
    c.y = c.y + (c.speed * c.direction[1]);

    if (c.x > xMax - c.radius|| c.x < xMin + c.radius) {
      bounceAway(c, true)
      checkDotCollisions(c);
      playNote(c.color)
    }
    if (c.y > yMax - c.radius|| c.y < yMin + c.radius) {
      bounceAway(c, null, true)
      checkDotCollisions(c);
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
};


updateLoop();
var updateLoopRate = 15; //miliseconds
var updateLoopCounter = 0; //how many times the update loop has run
setInterval(updateLoop, updateLoopRate);