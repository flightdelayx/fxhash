import p5 from "p5";

// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of fxrand()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo rand numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]

//Features!
const babelMode = fxrand() < 0.15
let getBabel
  if (babelMode) {
    getBabel = "babelMode" //15% babelMode
  } else {
    getBabel = "normal"
  }

const darkMode = fxrand() < 0.15
let getColorMode
if (darkMode) {
  getColorMode = "darkMode" //15% darkMode
} else {
  getColorMode = "normal"
}

let printStyle = fxrand() < 0.5
let getPrintStyle
if (babelMode) {
  getPrintStyle = "babelMode"
} else if (printStyle) {
  getPrintStyle = "sublimated" //60% sublimated
} else {
  getPrintStyle = "engraved" //40% engraved
}

const dotMixes = [0,0,0,1,1,2,2,2,2,2,2,2,2] //dot vs line settings: 0 = all dot, 1 = mix dot-line, 2 = all line
let dotMix = dotMixes[Math.floor(fxrand() * dotMixes.length)]
let getDotMix
if (babelMode) {
  getDotMix = "babelMode"
} else if (dotMix == 0) {
  getDotMix = "dot" //23% dot
} else if (dotMix == 1) {
  getDotMix = "dot-line mix" //15% dot-line mix
} else {
  getDotMix = "line" //62% line
}


const offsets = [0,1,1]
let offset = offsets[Math.floor(fxrand() * offsets.length)] //0 = fully square grid, 1 = offset/diagonal + square grids. more likely chance of offset //< 0.33 //
let getOffset 
if (babelMode) {
  getOffset = "babelMode"
} else if (offset) {
  getOffset = "offset" //66% offset
} else {
  getOffset = "square" //33% square
} 

//not setting this as a feature after all
const letterGridSizes = ["small", "medium", "large"] //33% each //grid for the letter to be drawn on variable that can be changed. small medium large
let letterGridSize = letterGridSizes[Math.floor(fxrand() * letterGridSizes.length)]    
let ltrGridSize 
if (letterGridSize == "small") {
  ltrGridSize = 6
} else if (letterGridSize == "medium") {
  ltrGridSize = 10
} else {
  ltrGridSize = 12
}

let totBox = ltrGridSize*ltrGridSize; //total number of squares in grid for a single letter; don't change

const sgmtSizeAry = [5000,10000,15000,18000]
let sgmtSizeChoice = sgmtSizeAry[Math.floor(fxrand() * sgmtSizeAry.length)]
let sgmt = Math.floor(Math.sqrt(sgmtSizeChoice/totBox)) //number of segments
if (sgmt%2 == 0) {sgmt++} //ensure odd number of columns for better column offset display

let getSgmt
if (babelMode) {
  getSgmt = "babelMode"
} else {
  getSgmt = sgmt
}

let squigOpt = fxrand() //use to choose squiggliness of 0, 2, 7, 15. 
let samDirWt
let getSquig
if (squigOpt < 0.04) { //4% chance of supersquiggle
  samDirWt = 0
  getSquig = "superSquiggly"
} else if (squigOpt < 0.36) {
  samDirWt = 2
  getSquig = "squiggly"
} else if (squigOpt < 0.68) {
  samDirWt = 7
  getSquig = "straighter"
} else {
  samDirWt = 15
  getSquig = "straightest"
}
//set the feature setting to Babel if so
if (babelMode) {
  getSquig = "babelMode"
}

let ltrPtAry = [0.3,0.5,0.7] //how many possible squares can be filled. *0.2 should be minimum; 0.3 - 0.6 seems like good range. max 0.8?. stroke length
let ltrPts = Math.floor(totBox * (ltrPtAry[Math.floor(fxrand() * ltrPtAry.length)])) //how many possible squares can be filled. *0.2 should be minimum; 0.3 - 0.6 seems like good range. max 0.8?. stroke length
let getLtrPts
if (babelMode) {
  getLtrPts = "babelMode"
} else {
  getLtrPts = ltrPts
}

window.$fxhashFeatures = {
"color mode": getColorMode,
"print style": getPrintStyle,
"character form": getDotMix,
"character style": getSquig,
"character length": getLtrPts,
"grid style": getOffset,
"segments": getSgmt

}

let sketch = function(p5) {

  //All colors:
  let colAryall1 = ["#12508f", "#863E2C", "#D7392E", "#29626D", "#396C21", "#204830", "#2A393C", "#6F7575", "#7B7E83", "#428857"]
  let colAryall2 = ["#3C806E", "#DADBE0", "#EDE5CE", "#F09033", "#F19E6F", "#256B9F", "#628ED7", "#C54D3D", "#C74341", "#AD2E35"]
  let colAryall3 = ["#A83B40", "#F2EA99", "#EFD658", "#9F7648", "#BF8C30", "#F5BF32", "#3C4447", "#7A463B", "#51565A", "#222222"]

  let colAry = p5.concat(p5.concat(colAryall1,colAryall2),colAryall3)

  let locRow, locCol, loc, points, newPtx, newPty, totalPts, p, q, w, boxSize, lastDir, newDir, newLocLastDir
  let sqColor, dotMixRan, bgColPos, bgCol, bgWidth, pos

  //+1 = FEATURE - needs setup
  //let babelMode = fxrand() //Babelmode = overlaying multiple logographies. 15%?
  //+1 = FEATURE - needs setup
  //let darkMode = fxrand() //darkMode = background color = "#222222" (darkest color) 15%?

  p5.setup = function() {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    bgWidth = p5.min(p5.width,p5.height)
    p5.createCanvas(bgWidth,bgWidth)
    
    if (darkMode) { //15% chance of darkmode
      bgColPos = (colAry.length-1); //#222222 is last color in the array
    } else {
      bgColPos = Math.floor(fxrand() * colAry.length);
    }
    bgCol = colAry[bgColPos];
    colAry.splice(bgColPos,1); //remove background color from color array used for letters
    
    p5.noiseSeed(fxrand() * 99) //semi-rando noise seed each time

    //background(bgCol);
    bgNoise(bgCol);
    if (babelMode) { //15% chance of multiple logographies overlaid on top of each other
      p5.draw()
      p5.draw()
    }
  }

  p5.draw = function() {

    if (babelMode) { //in babelMode reset the probability of features
      printStyle = fxrand() < 0.5
      if (printStyle) {
        getPrintStyle = "sublimated" //60% sublimated
      } else {
        getPrintStyle = "engraved" //40% engraved
      }

      ltrPts = Math.floor(totBox * (ltrPtAry[Math.floor(fxrand() * ltrPtAry.length)]))

      offset = offsets[Math.floor(fxrand() * offsets.length)]
      dotMix = dotMixes[Math.floor(fxrand() * dotMixes.length)]

      letterGridSize = letterGridSizes[Math.floor(fxrand() * letterGridSizes.length)]  
      if (letterGridSize == "small") {
        ltrGridSize = 6
      } else if (letterGridSize == "medium") {
        ltrGridSize = 10
      } else {
        ltrGridSize = 12
      }

      totBox = ltrGridSize*ltrGridSize;

      sgmtSizeChoice = sgmtSizeAry[Math.floor(fxrand() * sgmtSizeAry.length)]
      sgmt = Math.floor(Math.sqrt(sgmtSizeChoice/totBox)) //number of segments
      if (sgmt%2 == 0) {sgmt++} //ensure odd number of columns for better column offset display

      squigOpt = fxrand() //use to choose squiggliness of 0, 2, 7, 15. 
      if (squigOpt < 0.04) { //4% chance of supersquiggle
        samDirWt = 0
      } else if (squigOpt < 0.36) {
        samDirWt = 2
      } else if (squigOpt < 0.68) {
        samDirWt = 7
      } else {
        samDirWt = 15
      }
    }

    let pos, posx1, posy1, posx2, posy2
    
    p5.translate(p5.width / 2, p5.height /2);
    p5.scale(0.9);
    p5.translate(-p5.width / 2, -p5.height / 2);

    let crossEdges = Math.floor(fxrand() * 2) //1 or 0: if = 1, letter drawing can cross from right/left edge and vice versa, creating disconnected shapes
    
    let lastDirAry = [0,1,2,3]
    let lastDir = lastDirAry[Math.floor(fxrand() * lastDirAry.length)]; //initial setting of the last direction; 0=left, 1=right, 2=up, 3=down; works with samDirWt, likelihood of direction of writing
    
    let w = bgWidth / sgmt //width of a given box
    
    let boxSize = (bgWidth / ltrGridSize / sgmt); //size of each block that builds a logogram
    
    //+1 = FEATURE - setup complete
    let sublimate
    if (getPrintStyle == "sublimated") {
      sublimate = 1
    } else {
      sublimate = 0
    }
    
    for(let i=0; i<sgmt; i++){ 
      
      for(let j=0; j<sgmt; j++){
        
        let x = (i * w)
        let y =  (j * w)
        
        p5.push();
        if(offset == 1 && (i+j)%2 == 1){ //if offset, only reveal every other letter in the gride to create diagonals
        } else {
          
          p5.translate(x+boxSize, y+boxSize); 
          if(offset) { //0.8 is better if offset columns, 0.7 is better if just a square grid
            p5.scale(0.8);
          } else {
            p5.scale(0.7)
          } 
          p5.translate(-x, -y);

          let locsUsed = []
          let loc = Math.floor(fxrand() * totBox); //start with rando location between 0 and total number of squares in grid minus 1

          let letterLocs = ltrPtNames(ltrPts, locsUsed, loc, ltrGridSize, totBox, lastDir, samDirWt, crossEdges)

          let colRand = fxrand()

          if (colRand < 0.6) {
            if (bgCol == "#222222") { //if darkest bg color, darkmode reverses the light & dark letters
              sqColor = 255
            } else {
              sqColor = 0
            }
          } else if (colRand > 0.6 && colRand < 0.7) {
            if (bgCol == "#222222") {
              sqColor = 0
            } else {
              sqColor = 255
            }
          } else {
            sqColor = colAry[Math.floor(fxrand() * colAry.length)]
          }				

          for (let ll = 0; ll < letterLocs.length; ll++) {

            loc = letterLocs[ll]
            pos = gridLoc(loc,ltrGridSize); //get x and y of top left corner of square
            //get corners of the square grid to set drawing points in
            posx1 = x + pos[0]*(boxSize); //+1 top left corner
            posy1 = y + pos[1]*(boxSize);//-boxSize;
            posx2 = x + pos[0]*(boxSize)+boxSize; //+1 bottom right corner
            posy2 = y + pos[1]*(boxSize)+boxSize; 

            dotMixRan = fxrand() //rand setting for dot/line variation if dotMix == 1

            p5.push();
            if (dotMix == 0) {
              p5.translate(posx1, posy1); //makes dots/dashes instead of continuous lines
              p5.scale(0.5); 
              p5.translate(-posx1, -posy1);
            } else if (dotMix == 1 && dotMixRan < 0.4) {
              p5.translate(posx1, posy1); //makes dots/dashes instead of continuous lines
              p5.scale(0.5); 
              p5.translate(-posx1, -posy1);
            } //anything else will have continuous line

            p5.fill(sqColor)
            p5.stroke(sqColor)
            p5.strokeWeight(1)
            
            //draw filled squares if embossing
            if (sublimate == 1) {
              p5.square(posx1, posy1, boxSize)
            }				
            
            let hatching = 1 //ABH - always be hatching! hatching adds some fuzz around the filled square = softer edges
            //hatching - lines drawn between rand points in each square
            if (hatching) {
              let lns = 9 * (sublimate+1)
              for (let ln = 0; ln < lns; ln++) {
                let ln1 = fxrand()
                if (ln1 < 0.33) { //line from top to bottom
                  p5.line(posx1+(boxSize*fxrand()), posy1, posx1+(boxSize*fxrand()), posy2)
                } else if (ln1 < 0.66) { //line from top to right
                  p5.line(posx1+(boxSize*fxrand()), posy1, posx2, posy1+(boxSize*fxrand()))
                } else { //line from top to left
                  p5.line(posx1+(boxSize*fxrand()), posy1, posx1, posy1+(boxSize*fxrand()))
                }
                let ln2 = fxrand()
                if (ln2 < 0.33) { //left to right
                  p5.line(posx1, posy1+(boxSize*fxrand()), posx2, posy1+(boxSize*fxrand()))
                } else if (ln2 < 0.66) { //line from bottom to right
                  p5.line(posx1+(boxSize*fxrand()), posy2, posx2, posy1+(boxSize*fxrand()))
                } else { //line from bottom to left
                  p5.line(posx1+(boxSize*fxrand()), posy2, posx1, posy1+(boxSize*fxrand()))
                }
              }
            }

            p5.pop();
          }
        
        }
        p5.pop();
      }
    }
    
  }


  function ltrPtNames(ltrPts, locsUsed, loc, ltrGridSize, totBox, lastDir, samDirWt, crossEdges) {
    
    for (var p = 0; p < ltrPts; p++) {
      
      if (locsUsed.includes(loc) == false) { //only add a location once since loc's can be used multiple times; duplicates would abbreviate letter design
        locsUsed = p5.append(locsUsed, loc)
      }
      
      newLocLastDir = newLocFun(loc, ltrGridSize, totBox, lastDir, p, samDirWt, locsUsed, crossEdges)
      loc = newLocLastDir[0]
      lastDir = newLocLastDir[1]
    }
      return locsUsed
  }

  function gridLoc(loc, ltrGridSize) {
    
    let locRow =  p5.floor(loc/ltrGridSize);
    let locCol = loc % ltrGridSize;
    
    pos = [locCol, locRow]; //x,y of square in grid determined by ltrGridSize
    
    return pos;
          }

  function newLocFun(oldLoc, ltrGridSize, totBox, lastDir, p, samDirWt, locsUsed, crossEdges) { 

    let possLocFin = []
    let possLocs = [[oldLoc - 1,0], [oldLoc + 1,1], [oldLoc - ltrGridSize,2], [oldLoc + ltrGridSize,3]] //boxes left, right, up, down

    if (p > 0) {
      for (let sd = 0; sd < samDirWt; sd++) {
        let plAdd = possLocs[lastDir]
        p5.append(possLocs,plAdd) //add greater probability that writing will continue in same direction
      }
    }
    
    for (let l = 0; l < possLocs.length; l++) {
      possLocs[l][2] = 0
      let possLocPos = gridLoc(possLocs[l][0], ltrGridSize)
      
      //This section stops left-right crossover - is that desirable or no? Maybe different setting for diff alfabets?
      if (crossEdges == 0) {
        if (possLocPos[0] == 0 || possLocPos[0] == ltrGridSize) { //in first or last column
          possLocs[l][2] = possLocs[l][2]+1;
        }
        if (possLocPos[1] == 0 || possLocPos[1] == ltrGridSize) { //in first or last row
          possLocs[l][2] = possLocs[l][2]+1;
        }
      }
      
      for (let lu = 0; lu < locsUsed.length; lu++) { //see if adjacent cells already used, if so add to count
        if (possLocs[l][0] - 1 == locsUsed[lu] || //left of possible location
            possLocs[l][0] + 1 == locsUsed[lu] || //right of possible location
            possLocs[l][0] - ltrGridSize == locsUsed[lu] || //up of possible location
            possLocs[l][0] + ltrGridSize == locsUsed[lu] || //down of possible location
            possLocs[l][0] - (ltrGridSize-1) == locsUsed[lu] || //upper-right of poss loc
            possLocs[l][0] - (ltrGridSize+1) == locsUsed[lu] || //upper-left of poss loc
            possLocs[l][0] + (ltrGridSize-1) == locsUsed[lu] || //lower-right of poss loc
            possLocs[l][0] + (ltrGridSize+1) == locsUsed[lu]	//lower-left of poss loc
          ){
          possLocs[l][2] = possLocs[l][2]+1
        }
      }
    }
      
    for (let l = 0; l < possLocs.length; l++) {
      if (possLocs[l][0] >= 0 && //+1 don't let squares fill off grid
          possLocs[l][0] < totBox && 
          possLocs[l][2] < 3) { //don't let squares fill in corners
        possLocFin.push(possLocs[l])
      }
    } 

    let newLocLastDir
    
    if (possLocFin.length !== 0) {
        newDir = Math.floor(fxrand() * possLocFin.length)
        newLocLastDir = possLocFin[newDir]
      } else {
      newLocLastDir = [oldLoc,lastDir]
      } 
    
    return newLocLastDir;
  }
    
  function bgNoise(bgCol) { //reference: https://editor.p5js.org/codingtrain/sketches/2_hBcOBrF

    let bgColRgb = hexToRgb(bgCol)
    let inc = 0.0025;
    let yoff = 0;
    p5.loadPixels();
    for (let y = 0; y < p5.height; y++) {
      let xoff = 0;
      for (let x = 0; x < p5.width; x++) {
        let index = (x + y * p5.width) * 4;
        let alpha = (p5.noise(xoff, yoff) * 60) + 195; //ensures alpha between 195 and 255. gets subtler gradient and higher alpha/lower transparency
        p5.pixels[index + 0] = bgColRgb[0];
        p5.pixels[index + 1] = bgColRgb[1];
        p5.pixels[index + 2] = bgColRgb[2];
        p5.pixels[index + 3] = alpha;

        xoff += inc;
      }
      yoff += inc;
    }
    p5.updatePixels();
    p5.noLoop();
  }

  function hexToRgb(hex) { //cf https://www.codegrepper.com/code-examples/javascript/hex+to+rgb+typescript
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return [r,g,b];
    } 
    return null;
  }





}


let myp5 = new p5(sketch, window.document.body);