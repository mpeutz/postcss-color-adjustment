// Color adjustment Postcss Plugin

const postcss = require('postcss');
const tinycolor = require("tinycolor2");

module.exports = postcss.plugin('color-adjustment', function () {

    function extract(main, type) {
        let regExp = /\(([^)]+)\)/;
        let regExp2 = /([^\(]+)/;
        let colorAmount = regExp.exec(type);
        let colorType = regExp2.exec(type);
        let converted;

        switch (colorType[1]) {
        case 'darken':
        case 'shade':
        case 'd':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).darken(parseFloat(colorAmount[1])).toString();
            } else {
                converted = "invalid";
            }
            break; 
        case 'lighten':
        case 'tint':
        case 'l':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).lighten(parseFloat(colorAmount[1])).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'brighten':
        case 'b':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).brighten(parseFloat(colorAmount[1])).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'desaturate':
        case 'd':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).desaturate(parseFloat(colorAmount[1])).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'saturate':
        case 's':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).saturate(parseFloat(colorAmount[1])).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'grayscale':
        case 'greyscale':
        case 'g':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).greyscale().toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'rotate':
        case 'shift':
        case 'h':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).spin(parseFloat(colorAmount[1])).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'blend':
        case 'mix':
        case 'm':
            let newColors = colorAmount[1].split(",");
            if (tinycolor(main).isValid() && tinycolor(newColors[0]).isValid()) {
                converted = tinycolor.mix(main, newColors[0], amount = (parseFloat(parseFloat(newColors[1]), 10) || 50)).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'average':
            if (tinycolor(main).isValid()) {
                converted = tinycolor.mix(main, colorAmount[1], amount = 50).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'complement':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).complement().toHexString()
            } else {
                converted = "invalid";
            }
            break;
        case 'randomColor':
            if (tinycolor(main).isValid()) {
                converted = tinycolor.random().toHexString()
            } else {
                converted = "invalid";
            }
            break;
        case 'transparentize':
        case 'alpha':
        case 'opacity':
        case 'a':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).setAlpha(parseFloat(colorAmount[1])).toString();
            } else {
                converted = "invalid";
            }
            break;
        case 'contrast':
            if (tinycolor(main).isValid()) {
                converted = tinycolor.readability(main, colorAmount[1]);
            } else {
                converted = "invalid";
            }
            break;
        case 'readable':
            if (tinycolor(main).isValid()) {
                converted = tinycolor.mostReadable(main, ["#ffffff","#000000"]).toHexString();
                if (converted === "#ffffff") {
                    converted = "var(--colorLight)";
                } else {
                    converted = "var(--colorDark)";
                }
            } else {
                converted = "invalid";
            }
            break;
        case 'luminance':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).getLuminance()
            } else {
                converted = "invalid";
            }
            break;
        case 'normalize':
            if (tinycolor(main).isValid()) {
                converted = tinycolor(main).toHex();
            } else {
                converted = "invalid";
            }
        default: 
            if (tinycolor(main).isValid()) {
                converted = main;
            } else {
                converted = "invalid";
            }
        }
        return converted;
    }


    return function(css) {

        css.replaceValues(/color\((.+?)\)\)/g,{ fast: 'color(' }, string => {

            let colorClean = string.replace(/color\(/g,'').replace(/\)$/g,'');

            const rgbReg = /rg(.+?)\)/g;
            if (colorClean.match(rgbReg)) {
                colorClean = colorClean.replace(rgbReg, colorClean.match(rgbReg).toString().replace(/\s/g, ''));
            }

            const hslReg = /hs(.+?)\)/g;
            if (colorClean.match(hslReg)) {
                colorClean = colorClean.replace(hslReg, colorClean.match(hslReg).toString().replace(/\s/g, ''));
            }
            
            const colorFn = colorClean.split(" ");
            let colorBlock = colorFn[0];

            colorFn.shift();
            for (let i in colorFn) {
                colorParse = extract(colorBlock, colorFn[i]);
                if (colorParse == 'invalid') {
                    const err =  new Error(`This is NOT a valid color` );
                    console.error(err.message);
                    return colorBlock;
                }
                if (colorParse == 'outOfRange') {
                    const err =  new Error(`Adjustment is Out of Range` );
                    console.error(err.message);
                    return colorBlock;
                }
                colorBlock = colorParse;
            }
            return colorBlock;
        });
    }
});