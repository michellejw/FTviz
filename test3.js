var graphDiv = document.getElementById('graph');
var graphDiv2 = document.getElementById('graph2');

//Signal buttons
var s1button = document.getElementById('sig1');
var s2button = document.getElementById('sig2');
var s3button = document.getElementById('sig3');

var color1 = '#7b3294';
var colorX = '#ffa7b5';
var colorY = '#fdae61';

// Define initial signal variables
var f1 = 1;
var a1 = 1;
var f2 = 5;
var a2 = 0;
var f3 = 5;
var a3 = 0;

var N = 500;
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
var y3 = sig_gen(f3,a3,x1);
var sumsig = numeric.add(y1,y2,y3);

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
var halfwidth = 0.1;
var yf1 = sig_gen2(f1,a1,fvec,halfwidth);
var yf2 = sig_gen2(f2,a2,fvec,halfwidth);
var yf3 = sig_gen2(f3,a3,fvec,halfwidth);
var sumsig2 = numeric.add(yf1,yf2,yf3);

// Make Time Series Plot
function makeplot(x,y) {
  var trace = {
    type: 'scatter',
    mode: 'line',
    x: x,
    y: y,
    xaxis: 'x',
    yaxis: 'y',
    name: 'Time series',
    marker: {color: color1, size: 10}
  };
  var layout = {
    title: 'Time Series Signal',
    xaxis: {
      zeroline: false,
      title: 'Time (s)'
    },
    yaxis: {
      domain: [0.2, 1],
      title: 'Amplitude'
    },
    autosize: true,
    height: 250,
    margin: {
      l: 50,
      r: 50,
      b: 10,
      t: 50,
      pad: 4
    }
  };
  var fig = {data: [trace], layout: layout};
  Plotly.plot(graphDiv, fig);
  s2button["innerHTML"] = "Signal #2<br>Freq = " + f2 + "<br>Amp = " + a2;
  s1button["innerHTML"] = "Signal #1<br>Freq = " + f1 + "<br>Amp = " + a1;
  s3button["innerHTML"] = "Signal #3<br>Freq = " + f3 + "<br>Amp = " + a3;
}
makeplot(x1,sumsig);


// Make DFT Plot
function makeplot2(x,y) {
  var trace = {
    type: 'scatter',
    mode: 'line',
    x: x,
    y: y,
    xaxis: 'x',
    yaxis: 'y',
    name: 'DFT',
    marker: {color: color1, size: 10}
  };
  var layout = {
    title: 'Discrete Fourier Transform',
    xaxis: {
      zeroline: false,
      title: 'Frequency (Hz)'
    },
    yaxis: {
      domain: [0.2, 1],
      title: 'Amplitude'
    },
    autosize: true,
    height: 250,
    margin: {
      l: 50,
      r: 50,
      b: 10,
      t: 50,
      pad: 4
    }
  };
  var fig = {data: [trace], layout: layout};
  Plotly.plot(graphDiv2, fig);
  s2button["innerHTML"] = "Signal #2<br>Freq = " + f2 + "<br>Amp = " + a2;
  s1button["innerHTML"] = "Signal #1<br>Freq = " + f1 + "<br>Amp = " + a1;
  s3button["innerHTML"] = "Signal #3<br>Freq = " + f3 + "<br>Amp = " + a3;
}
makeplot2(fvec,sumsig2);

// SLIDERS
// F1 SLIDER
var f1slider = document.getElementById('sliderf1');
noUiSlider.create(f1slider, {
	start: [ f1 ],
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
  y1 = sig_gen(f1,a1,x1);
  sumsig = numeric.add(y1,y2,y3);
  yf1 = sig_gen2(f1,a1,fvec,halfwidth);
  sumsig2 = numeric.add(yf1,yf2,yf3);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2, 0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

// A1 SLIDER
var a1slider = document.getElementById('slidera1');
noUiSlider.create(a1slider, {
	start: [ a1 ],
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
  y1 = sig_gen(f1,a1,x1);
  sumsig = numeric.add(y1,y2,y3);
  yf1 = sig_gen2(f1,a1,fvec,halfwidth);
  sumsig2 = numeric.add(yf1,yf2,yf3);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2,0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

// F2 SLIDER
var f2slider = document.getElementById('sliderf2');
noUiSlider.create(f2slider, {
	start: [ f2 ],
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
  y2 = sig_gen(f2,a2,x1);
  sumsig = numeric.add(y1,y2,y3);
  yf2 = sig_gen2(f2,a2,fvec,halfwidth);
  sumsig2 = numeric.add(yf1,yf2,yf3);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2, 0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

// A2 SLIDER
var a2slider = document.getElementById('slidera2');
noUiSlider.create(a2slider, {
	start: [ a2 ],
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
  y2 = sig_gen(f2,a2,x1);
  sumsig = numeric.add(y1,y2,y3);
  yf2 = sig_gen2(f2,a2,fvec,halfwidth);
  sumsig2 = numeric.add(yf1,yf2,yf3);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2, 0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});


// F3 SLIDER
var f3slider = document.getElementById('sliderf3');
noUiSlider.create(f3slider, {
	start: [ f3 ],
	range: {
		'min': [  0 ],
		'max': [ 10 ]
	},
  pips: {
  mode: 'range',
  density: 10
  }
});
// read f3 slider
var f3val = document.getElementById('f3-value');
f3slider.noUiSlider.on('update', function( values, handle ) {
	f3 = values[handle];
  f3val["innerHTML"] = "<h3>Frequency: "+f3+" Hz</h3>"
  y3 = sig_gen(f3,a3,x1);
  sumsig = numeric.add(y1,y2,y3);
  yf3 = sig_gen2(f3,a3,fvec,halfwidth);
  sumsig2 = numeric.add(yf1,yf2,yf3);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2, 0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});

// A3 SLIDER
var a3slider = document.getElementById('slidera3');
noUiSlider.create(a3slider, {
	start: [ a3 ],
	range: {
		'min': [  0 ],
		'max': [ 10 ]
	},
  pips: {
  mode: 'range',
  density: 10
  }
});
// read a3 slider
var a3val = document.getElementById('a3-value');
a3slider.noUiSlider.on('update', function( values, handle ) {
  a3 = values[handle];
  a3val["innerHTML"] = "<h3>Amplitude: "+a3+" units</h3>"
  y3 = sig_gen(f3,a3,x1);
  sumsig = numeric.add(y1,y2,y3);
  yf3 = sig_gen2(f3,a3,fvec,halfwidth);
  sumsig2 = numeric.add(yf1,yf2,yf3);
  Plotly.deleteTraces(graphDiv, 0);
  Plotly.deleteTraces(graphDiv2,0);
  makeplot(x1,sumsig)
  makeplot2(fvec,sumsig2)
});
