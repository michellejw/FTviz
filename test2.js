var graphDiv = document.getElementById('graph');
//var N = 1000;
var color1 = '#7b3294';
var colorX = '#ffa7b5';
var colorY = '#fdae61';

// Define initial signal variables
var f1 = 1;
var a1 = 1;
var f2 = 5;
var a2 = 2;

N = 300
var x1 = numeric.linspace(0,10,N);
var y1 = numeric.sin([x1])

function sig_gen(freq,amp,x,y) {
  var out = new Array(N);
  for(var i = 0; i < N; i++) {
    out[i] = amp*numeric.sin([freq*x[i]]);
  }
  return out;
}
var y1 = sig_gen(f1,a1,x1,y1);
var y2 = sig_gen(f2,a2,x1,y1);
var sumsig = numeric.add(y1,y2);


function makeplot(x,y) {
  Plotly.plot(graphDiv, [{
    type: 'scatter',
    mode: 'line',
    x: x,
    y: y,
    xaxis: 'x',
    yaxis: 'y',
    name: 'Time series',
    marker: {color: color1, size: 10}
  }], {
    title: 'Time Series Signal',
    xaxis: {
      zeroline: false,
      title: 'Time (s)'
    },
    yaxis: {
      domain: [0.5, 1],
      title: 'Amplitude'
    }
  });
}

makeplot(x1,sumsig)


// Slider stuff
// f1 slider
var f1slider = document.getElementById('sliderf1');

noUiSlider.create(f1slider, {
	start: [ 1 ],
	range: {
		'min': [  0 ],
		'max': [ 10 ]
	},
  pips: {
  mode: 'range',
  density: 10
  }
});

// read f1 slider
var f1val = document.getElementById('f1-value');
//
f1slider.noUiSlider.on('update', function( values, handle ) {
	f1 = values[handle];
  f1val["innerHTML"] = "<h3>Frequency: "+f1+" Hz</h3>"
  var y1 = sig_gen(f1,a1,x1,y1);
  var sumsig = numeric.add(y1,y2);
  Plotly.restyle(graphDiv, {
    x: x1,
    y: sumsig,
  });
});

// create a1 slider
var a1slider = document.getElementById('slidera1');

noUiSlider.create(a1slider, {
	start: [ 1 ],
	range: {
		'min': [  0 ],
		'max': [ 10 ]
	},
  pips: {
  mode: 'range',
  density: 10
  }
});

// read a1 slider
var a1val = document.getElementById('a1-value');
//
a1slider.noUiSlider.on('update', function( values, handle ) {
	a1val.value = values[handle];
  a1val["innerHTML"] = "<h3>Amplitude: "+a1val.value+" units</h3>"
});
