var graphDiv = document.getElementById('graph');
var graphDiv2 = document.getElementById('graph2')
//var N = 1000;
var color1 = '#7b3294';
var colorX = '#ffa7b5';
var colorY = '#fdae61';

// Define initial signal variables
var f1 = 1;
var a1 = 1;
var f2 = 1;
var a2 = 1;

N = 300
var x1 = numeric.linspace(0,10,N);
var y1 = numeric.sin([x1])

// Generate time series signal
function sig_gen(freq,amp,x) {
  var out = new Array(N);
  for(var i = 0; i < N; i++) {
    out[i] = amp*numeric.sin([2*Math.PI*freq*x[i]]);
  }
  return out;
}
var y1 = sig_gen(f1,a1,x1);
var y2 = sig_gen(f2,a2,x1);
var sumsig = numeric.add(y1,y2);

// Generate DFT signal
function sig_gen2(freq,amp,fvec,halfwidth) {
  var linscale = amp/halfwidth;
  var out2 = new Array(N);
  var f_low = parseFloat(freq)-halfwidth;
  var f_high = parseFloat(freq)+halfwidth;
  for(var i = 0; i<N; i++) {
    if ((fvec[i] < f_low) | (fvec[i]>f_high)) {
      out2[i] = 0;
    } else if ((fvec[i] >= f_low) & (fvec[i]<freq) ) {
      var df = Math.abs(fvec[i]-f_low);
      out2[i] = df*linscale;
    } else if (fvec[i] == freq) {
      out2[i] = amp;
    } else {
      var df = Math.abs(f_high - fvec[i])
      out2[i] = df*linscale;
    }
  }
  return out2;
}
var fvec = numeric.linspace(0,10,N);
var halfwidth = 0.5;
var yf1 = sig_gen2(f1,a1,fvec,halfwidth);
var yf2 = sig_gen2(f2,a2,fvec,halfwidth);
var sumsig2 = numeric.add(yf1,yf2);

// Make Time Series Plot
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
    width: 500,
    height: 300,
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 4
    }
  });
}
makeplot(x1,sumsig);


// Make DFT Plot
function makeplot2(x,y) {
  Plotly.plot(graphDiv2, [{
    type: 'scatter',
    mode: 'line',
    x: x,
    y: y,
    xaxis: 'x',
    yaxis: 'y',
    name: 'DFT',
    marker: {color: color1, size: 10}
  }], {
    title: 'Discrete Fourier Transform',
    xaxis: {
      zeroline: false,
      title: 'Frequency (Hz)'
    },
    yaxis: {
      domain: [0, 1],
      title: 'Amplitude'
    }
  });
}
makeplot2(fvec,sumsig2);


//Signal buttons
var s1button = document.getElementById('sig1');
var s2button = document.getElementById('sig2');

// SLIDERS
// F1 SLIDER
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
f1slider.noUiSlider.on('update', function( values, handle ) {
	f1 = values[handle];
  f1val["innerHTML"] = "<h3>Frequency: "+f1+" Hz</h3>"
  var y1 = sig_gen(f1,a1,x1);
  var sumsig = numeric.add(y1,y2);
  var yf1 = sig_gen2(f1,a1,fvec,halfwidth);
  var sumsig2 = numeric.add(yf1,yf2);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2, 0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

// A1 SLIDER
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
a1slider.noUiSlider.on('update', function( values, handle ) {
  a1 = values[handle];
  a1val["innerHTML"] = "<h3>Amplitude: "+a1+" units</h3>"
  var y1 = sig_gen(f1,a1,x1);
  var sumsig = numeric.add(y1,y2);
  var yf1 = sig_gen2(f1,a1,fvec,halfwidth);
  var sumsig2 = numeric.add(yf1,yf2);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2,0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

// F2 SLIDER
var f2slider = document.getElementById('sliderf2');
noUiSlider.create(f2slider, {
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
// read f2 slider
var f2val = document.getElementById('f2-value');
f2slider.noUiSlider.on('update', function( values, handle ) {
	f2 = values[handle];
  f2val["innerHTML"] = "<h3>Frequency: "+f2+" Hz</h3>"
  var y2 = sig_gen(f2,a2,x1);
  var sumsig = numeric.add(y1,y2);
  var yf2 = sig_gen2(f2,a2,fvec,halfwidth);
  var sumsig2 = numeric.add(yf1,yf2);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2, 0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

// A2 SLIDER
var a2slider = document.getElementById('slidera2');
noUiSlider.create(a2slider, {
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
// read a2 slider
var a2val = document.getElementById('a2-value');
a2slider.noUiSlider.on('update', function( values, handle ) {
  a2 = values[handle];
  a2val["innerHTML"] = "<h3>Amplitude: "+a2+" units</h3>"
  var y2 = sig_gen(f2,a2,x1);
  var sumsig = numeric.add(y1,y2);
  var yf2 = sig_gen2(f2,a2,fvec,halfwidth);
  var sumsig2 = numeric.add(yf1,yf2);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2, 0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

var freq_low_test = f1-halfwidth;
var freq_high_test = f1+halfwidth;
