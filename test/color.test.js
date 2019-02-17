import postcss from 'postcss';
import test    from 'ava';

var varis = require('postcss-simple-vars');
var custom = require('postcss-css-variables')({'preserve': 'computed'});
var colors = require('../index.js');

function run(t, input, output, opts = { }) {
  return postcss([ custom, varis, colors(opts) ]).process(input, {from: undefined})
    .then( result => {
      let parsedOut = result.css.replace(/\n|\r/g, " ");
      t.deepEqual(parsedOut, output);
      t.deepEqual(result.warnings().length, 0);
  });
}

test('handles darken color', t => {
    return run(t,
      '.test { color: color(rgb(255, 0, 0) darken(20)); background-color: color(#f00 shade(20)); border-color: color(#f00 d(20)); }',
      '.test { color: rgb(153, 0, 0); background-color: #990000; border-color: #990000; }'
    );
});

test('handles lighten color', t => {
    return run(t,
      '.test { color: color(#f00 lighten(20)); background-color: color(#f00 tint(20)); border-color: color(#f00 l(20)); }',
      '.test { color: #ff6666; background-color: #ff6666; border-color: #ff6666; }'
    );
});

test('handles brighten color', t => {
    return run(t,
      '.test { color: color(#f00 brighten(20)); background-color: color(#f00 b(20));}',
      '.test { color: #ff3333; background-color: #ff3333;}'
    );
});

test('handles desaturate color', t => {
    return run(t,
      '.test { color: color(#f00 desaturate(20)); }',
      '.test { color: #e61919; }'
    );
});

test('handles saturate color', t => {
    return run(t,
      '.test { color: color(#f00 saturate(20)); background-color: color(#f00 s(20));}',
      '.test { color: #ff0000; background-color: #ff0000;}'
    );
});

test('handles greyscale color', t => {
    return run(t,
      '.test { color: color(#f00 greyscale()); }',
      '.test { color: #808080; }'
    );
});

test('handles shift color', t => {
    return run(t,
      '.test { color: color(#f00 shift(120)); background-color: color(#f00 rotate(120)); }',
      '.test { color: #00ff00; background-color: #00ff00; }'
    );
});

test('handles mix color', t => {
    return run(t,
      '.test { color: color(#f00 mix(#00f,40)); background-color: color(#f00 m(#00f,40));}',
      '.test { color: rgb(153, 0, 102); background-color: rgb(153, 0, 102);}'
    );
});

test('handles average color', t => {
    return run(t,
      '.test { color: color(#f00 average(#0f0)); }',
      '.test { color: rgb(128, 128, 0); }'
    );
});

test('handles complement color', t => {
    return run(t,
      '.test { color: color(#f00 complement()); }',
      '.test { color: #00ffff; }'
    );
});

test('handles alpha transforms', t => {
    return run(t,
      '.test { color: color(#f00 transparentize(.2)); background-color: color(#f00 alpha(.8)); border-color: color(#f00 a(.8)); background: color(#f00 opacity(0.4));}',
      '.test { color: rgba(255, 0, 0, 0.2); background-color: rgba(255, 0, 0, 0.8); border-color: rgba(255, 0, 0, 0.8); background: rgba(255, 0, 0, 0.4);}'
    );
});


test('handles contrast color', t => {
    return run(t,
      '.test { line-height: color(#f00 contrast(#fff)); }',
      '.test { line-height: 3.9984767707539985; }'
    );
});

test('handles luminance color', t => {
    return run(t,
      '.test { line-height: color(#f00 luminance()); }',
      '.test { line-height: 0.2126; }'
    );
});

test('handles multiple color', t => {
  return run(t,
    '.test { border-color: color(#f00 darken(20)) color(#f00 darken(20)) }',
    '.test { border-color: #990000 #990000 }'
  );
});

test('handles complex box shadow', t => {
  return run(t,
    '.test { text-shadow: 0 1px 0 color(#f00 lighten(4)), 0 2px 0 color(#f00 darken(4)), 0 3px 0 color(#f00 darken(8)), 0 4px 0 color(#f00 darken(12)), 0 5px 0 color(#f00 darken(16)), 0 5px 5px #001135 }',
    '.test { text-shadow: 0 1px 0 #ff1414, 0 2px 0 #eb0000, 0 3px 0 #d60000, 0 4px 0 #c20000, 0 5px 0 #ad0000, 0 5px 5px #001135 }'
  );
});

test('handles chained color manipulations', t => {
    return run(t,
      '.test { color: color(#bada55 saturate(20) darken(20)); }',
      '.test { color: #91b910; }'
    );
});

test('handles complex color', t => {
  return run(t,
    '.test { border: 1px solid color(#f00 darken(20)); }',
    '.test { border: 1px solid #990000; }'
  );
});

test('handles box shadow', t => {
  return run(t,
    '.test { box-shadow: 1px 2px 8px 1px color(#f00 darken(20)); }',
    '.test { box-shadow: 1px 2px 8px 1px #990000; }'
  );
});

test('handles simple variables', t => {
  return run(t,
    '$red: #f00; .test { color: color($red darken(20)); }',
    '.test { color: #990000; }'
  );
});

test('handles custom properties', t => {
  return run(t,
    ':root { --purple: #bada55; --red: #ff0000; } .test { color: color(var(--purple) darken(20)); background-color: color(var(--purple) lighten(20));}',
    ':root { --purple: #bada55; --red: #ff0000; } .test { color: #86a524; background-color: #dceca9;}'
  );
});

test('handles gradient', t => {
  return run(t,
    '.test { background-image: linear-gradient(to bottom, color(#f00 darken(20)), color(#f00 darken(20))); }',
    '.test { background-image: linear-gradient(to bottom, #990000, #990000); }'
  );
});

test('handles long chains of manipulations', t => {
  return run(t,
    '.test { color: color(#f0f darken(30) lighten(10) desaturate(10) lighten(3) shift(60)); }',
    '.test { color: #9f0909; }'
  );
});


test('handles valued color properties', t => {
  return run(t,
    '.test { color: color(rgb(255, 0, 0) complement()); background: color(hsv(0, 100%, 100%) complement()); border-color: color(hsla(0, 100%, 50%, 1) complement()); }',
    '.test { color: #00ffff; background: #00ffff; border-color: #00ffff; }'
  );
});


test('handles readability ', t => {
  return run(t,
    '.test { color: color(#ff0 readable()); }',
    '.test { color: var(--colorDark); }'
  );
});