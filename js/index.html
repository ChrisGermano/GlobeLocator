var canvas = d3.select("canvas"),
    width = canvas.property("width"),
    height = canvas.property("height"),
    context = canvas.node().getContext("2d");

var projection = d3.geoOrthographic()
    .scale((height - 10) / 2)
    .translate([width / 2, height / 2])
    .precision(0.1);

var path = d3.geoPath()
    .projection(projection)
    .context(context);

//Used for culling
var lastPositions = [];

canvas.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged));

var render = function() {},
    v0, // Mouse position in Cartesian coordinates at start of drag gesture.
    r0, // Projection rotation as Euler angles at start.
    q0; // Projection rotation as versor at start.

function dragstarted() {
  v0 = versor.cartesian(projection.invert(d3.mouse(this)));
  r0 = projection.rotate();
  q0 = versor(r0);
}

function dragged() {
  var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this))),
      q1 = versor.multiply(q0, versor.delta(v0, v1)),
      r1 = versor.rotation(q1);
  projection.rotate(r1);
  render();
}

$.get('./data/topology.json', function(topology) {

  var sphere = {type: "Sphere"},
      land = topojson.feature(topology, topology.objects.land);

  var cleanLocs = [];

  $.get('./data/city-data.csv', function(locations) {

    var locations = locations.split("\n");

    for (var j = 0; j < locations.length; j++) {
      locations[j] = locations[j].split(',');

      for (var k = 0; k < locations[j].length; k++) {
        locations[j][k] = locations[j][k].replace(/"/g,"");
      }
    }

    for (var i = 0; i < locations.length; i++) {

      if (isNaN(locations[i][1])) continue;

      var tempLoc = {
        'long' : parseFloat(locations[i][0]),
        'lat' : parseFloat(locations[i][1]),
        'name' : locations[i][2]
      };

      cleanLocs.push(tempLoc);
    }

    lastPositions = new Array(cleanLocs.length);

  });

  render = function() {
    context.clearRect(0, 0, width, height);
    context.beginPath(), path(sphere), context.fillStyle = "#008", context.fill();
    context.beginPath(), path(land), context.fillStyle = "#080", context.fill();
    context.beginPath(), path(sphere), context.lineWidth = "3", context.stroke();

    if (cleanLocs.length) {
      for (var c = 0; c < cleanLocs.length; c++) {
        var xy = projection([cleanLocs[c].lat,cleanLocs[c].long]);

        if (lastPositions[c] && !lastPositions[c].isNaN && lastPositions[c] < xy[0]) {
          context.fillStyle = "#F00", context.fillRect(xy[0],xy[1], 2, 2);
        }

        lastPositions[c] = xy[0];
      }
    }
  };

  //render();

  var time = Date.now();
  var rotate = [0, 0];
  var velocity = [.015, -0];

  d3.timer(function() {
      // get current time
      var dt = Date.now() - time;
      // get the new position from modified projection function
      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
      // update cities position = redraw
      render();
   });

  $('canvas').on('hover',function() {

  })

});
