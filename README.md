# PostCSS Color Adjustment plugin

[![Build Status](https://travis-ci.org/mpeutz/postcss-color-adjustment.svg?branch=master)](https://travis-ci.org/mpeutz/postcss-color-adjustment)

This PostCss plugin provides several utility actions used to manipulate, adjust, and analyse colors in you css files. Most actions call for a single color and an adjustment factor, but some call for two colors, while others forgo any adjustment factor property. The plugin was inspired by the color functions of Sass and the syntax from the awesome [postcss-color-functions](https://github.com/postcss/postcss-color-function) plugin.


## Installation

  `npm install postcss-color-adjustment`


#### Acceptable Color Formats

Functions that manipulate colors formats:
- Hex, 3-digit shorthand Hex, 8-digit (RGBA) Hex
- RGB, RGBA
- HSL, HSLA
- HSV, HSVA
- Named colors

#### Basic Syntax
  ```css
  /*
   * rule: color(<base color>, <keyword>(<adjustment-factor>))
   **/

   background-color: color(#f00, darken(20));
  ```
#### Average Syntax
  ```css
  /*
   * rule: color(<base color>, average(<secondary color>))
   **/

   color: color(#2ef, average(#f24));
  ```
#### Mix Syntax
  ```css
  /*
   * rule: color(<base color>, mix(<secondary color>, <adjustment-factor>))
   **/

   border: 1px solid color(#f00 mix(#00f,40));
  ```
#### Chained Syntax (operations are performed from left to right)
  ```css
  /*
   * rule: color(<base color>, <keyword>(<adjustment-factor>) <keyword>(<adjustment-factor>) <keyword>(<adjustment-factor>) <.etc..> )
   **/

   box-shadow: 0 0 10px color(#bada55 saturate(20) darken(20));
  ```
  _note: do not separated chained color actions with a comma_
#### Available actions

| Action & Alias| Parameters           | Result                  |
|--------|:----------------------:|-------------------------|
| **darken**, shade, d | color, adjustment factor(0-100) | darkens color |
| **lighten**, tint, l | color, adjustment factor(0-100) | lightens color |
| **brighten**, b | color, adjustment factor(0-100) | brightens color |
| **desaturate** d | color, adjustment factor(0-100) | desaturate color |
| **saturate**, s | color, adjustment factor(0-100) | saturates color |
| **grayscale**, greyscale, g | color | desaturate color 100% |
| **shift**, hue, rotate, h | color, adjustment factor(-360 - 360)  | shifts hue |
| **mix**, blend, m | color1, color2, adjustment factor(0-100) | mixes 2 colors by adjustment factor |
| **average** | color1, color2  | averages 2 colors |
| **complement** | color  | returns complimentary color |
| **randomColor** | color | returns a random color |
| **transparentize**, alpha, opacity, a | color, adjustment factor(0-1)  | sets alpha level of color |
| **contrast** | color, color2  | returns the color contrast, from 0-21 as defined by Web Content Accessibility Guidelines (Version 2.0). |
| **luminance** | color | Returns the perceived luminance of a color, from 0-1 as defined by Web Content Accessibility Guidelines (Version 2.0). |
| **readable** | color | Returns either "var(--colorLight)" or "var(--colorDark)" depending on which has the better contrast. These are returned as custom properties to give flexibility to the rendered color |

#### css

```css
color: color(#f00 darken(20));           /* #990000  */
color: color(#f00 lighten(20));          /* #ff6666  */
color: color(#f00 brighten(20));         /* #ff3333  */
color: color(#f00 desaturate(20));       /* #e61919  */
color: color(#f00 saturate(20));         /* #ff0000  */
color: color(#f00 grayscale());            /* #808080  */
color: color(#f00 shift(120));           /* #00ff00  */
color: color(#f00 mix(#00f,40);          /* rgb(153, 0, 102)  */
color: color(#f00 average(#0f0));        /* rgb(128, 128, 0)  */
color: color(#f00 complement());         /* #00ffff  */
color: color(randomColor());             /* #886b76  */
color: color(#f00 transparentize(.2));   /* rgba(255, 0, 0, 0.2)  */
color: color(#f00 alpha(.8));            /* rgba(255, 0, 0, 0.8)  */
color: color(#f00 contrast(#000));       /* 5.252  */
color: color(#f00 luminance());          /* 0.2126 */
color: color(#ff0 readable());           /* var(--colorDark) */
```