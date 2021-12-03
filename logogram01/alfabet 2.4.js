//All colors:
let colAryall1 = ["#12508f", "#863E2C", "#D7392E", "#29626D", "#396C21", "#204830", "#2A393C", "#6F7575", "#7B7E83", "#428857"]
let colAryall2 = ["#3C806E", "#DADBE0", "#EDE5CE", "#F09033", "#F19E6F", "#256B9F", "#628ED7", "#C54D3D", "#C74341", "#AD2E35"]
let colAryall3 = ["#A83B40", "#F2EA99", "#EFD658", "#9F7648", "#BF8C30", "#F5BF32", "#3C4447", "#7A463B", "#51565A", "#222222"]

let colAry = colAryall1.concat(colAryall2.concat(colAryall3))

let locRow, locCol, loc, points, newPtx, newPty, totalPts, p, q, w, boxSize, lastDir, newDir, newLocLastDir
let sqColor, offset, dotMixRan, sgmt, bgColPos, bgCol

//+1 = FEATURE - needs setup
let babelMode = Math.random() //Babelmode = overlaying multiple logographies. 15%?
//+1 = FEATURE - needs setup
let darkMode = Math.random() //darkMode = background color = "#222222" (darkest color) 15%?

function setup() {
	createCanvas(windowWidth, windowHeight);
	bgWidth = min(width,height)
	createCanvas(bgWidth,bgWidth)
	
	if (darkMode < 0.15) { //15% chance of darkmode
		bgColPos = (colAry.length-1); //#222222 is last color in the array
	} else {
		bgColPos = int(random(colAry.length-1));
	}
	bgCol = colAry[bgColPos];
	colAry.splice(bgColPos,1); //remove background color from color array used for letters
	
	//background(bgCol);
	bgNoise(bgCol);
	console.log(bgCol)
	if (babelMode < 0.15) { //15% chance of multiple logographies overlaid on top of each other
		draw()
		draw()
	}
}

function draw() {
	
	let pos, posx1, posy1, posx2, posy2
	
	noiseSeed(Math.random() * 99) //semi-random noise seed each time
	
	let offset = random([0,1,1]) //0 = fully square grid, 1 = offset/diagonal + square grids. more likely chance of offset
	
	translate(width / 2, height /2);
	scale(0.9);
	translate(-width / 2, -height / 2);
	
	/*setup initial parameters; randomize these in final version*/
	//+1 = FEATURE - needs different settings
	let ltrGridSize = random([6,10,12]); //grid for the letter to be drawn on variable that can be changed. small medium large
	let totBox = ltrGridSize*ltrGridSize; //total number of squares in grid for a single letter; don't change
	//+1 = FEATURE - needs different settings
	sgmt = floor(sqrt(random([5000,10000,15000,18000])/(totBox))) //number of segments; relative to ltrGridSize. Small Medium Large XL
	if (sgmt%2 == 0) {sgmt++} //ensure odd number of columns for better column offset display
	let ltrPts = floor(totBox * random([0.3,0.5,0.7])); //how many possible squares can be filled. *0.2 should be minimum; 0.3 - 0.6 seems like good range. max 0.8?. stroke length
	//+1 = FEATURE - needs different settings
	let samDirWt = random([2,7,15]); //higher number = straighter lines; lower = squigglier; rec min 2 max 15(?); squiggliness: high medium low
	let crossEdges = random([0,1]); //1 or 0: if = 1, letter drawing can cross from right/left edge and vice versa, creating disconnected shapes
	let lastDir = random([0,1,2,3]); //initial setting of the last direction; 0=left, 1=right, 2=up, 3=down; works with samDirWt, likelihood of direction of writing
	
	console.log("ltrGridSize: " + ltrGridSize)
	console.log("sgmt: " + sgmt)
	console.log("samDirWt: " + samDirWt)
	console.log("ltrPts: " + ltrPts)
	
	let w = bgWidth / sgmt //width of a given box
	
	let boxSize = (bgWidth / ltrGridSize / sgmt); //size of each block that builds a logogram
	
	//+1 = FEATURE - needs setup
	let dotMix = random([0,0,1,1,2,2,2,2,2,2,2,2]) //dot vs line settings: 0 = all dot, 1 = mix dot-line, 2 = all line
	
	//+1 = FEATURE - needs setup
	let emboss = floor(Math.random()*2) //0 = engrave, 1 = emboss. 60/40 instead?
	console.log("emboss: " + emboss)
	
	for(let i=0; i<sgmt; i++){ 
		
		for(let j=0; j<sgmt; j++){
			
			let x = (i * w)
			let y =  (j * w)
			
			push();
			if(offset == 1 && (i+j)%2 == 1){ //if offset, only reveal every other letter in the gride to create diagonals
			} else {
				
				translate(x+boxSize, y+boxSize); 
				if(offset) { //0.8 is better if offset columns, 0.7 is better if just a square grid
					scale(0.8);
				} else {
					scale(0.7)
				} 
				translate(-x, -y);

				let locsUsed = []
				let loc = floor(random(totBox)); //start with random location between 0 and total number of squares in grid minus 1

				let letterLocs = ltrPtNames(ltrPts, locsUsed, loc, ltrGridSize, totBox, lastDir, samDirWt, crossEdges)

				let colRand = Math.random()

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
					sqColor = colAry[int(random(colAry.length))]
				}				

				for (let ll = 0; ll < letterLocs.length; ll++) {

					loc = letterLocs[ll]
					pos = gridLoc(loc,ltrGridSize); //get x and y of top left corner of square
					//get corners of the square grid to set drawing points in
					posx1 = x + pos[0]*(boxSize); //+1 top left corner
					posy1 = y + pos[1]*(boxSize);//-boxSize;
					posx2 = x + pos[0]*(boxSize)+boxSize; //+1 bottom right corner
					posy2 = y + pos[1]*(boxSize)+boxSize; 

					dotMixRan = Math.random() //random setting for dot/line variation if dotMix == 1

					push();
					if (dotMix == 0) {
						translate(posx1, posy1); //makes dots/dashes instead of continuous lines
						scale(0.5); 
						translate(-posx1, -posy1);
					} else if (dotMix == 1 && dotMixRan < 0.4) {
						translate(posx1, posy1); //makes dots/dashes instead of continuous lines
						scale(0.5); 
						translate(-posx1, -posy1);
					} //anything else will have continuous line

					fill(sqColor)
					stroke(sqColor)
					strokeWeight(1)
					
					//draw filled squares if embossing
					if (emboss == 1) {
						square(posx1, posy1, boxSize)
					}				
					
					let hatching = 1 //ABH - always be hatching! hatching adds some fuzz around the filled square = softer edges
					//hatching - lines drawn between random points in each square
					if (hatching) {
						let lns = 9 * (emboss+1)
						for (let ln = 0; ln < lns; ln++) {
							let ln1 = Math.random()
							if (ln1 < 0.33) { //line from top to bottom
								line(posx1+(boxSize*Math.random()), posy1, posx1+(boxSize*Math.random()), posy2)
							} else if (ln1 < 0.66) { //line from top to right
								line(posx1+(boxSize*Math.random()), posy1, posx2, posy1+(boxSize*Math.random()))
							} else { //line from top to left
								line(posx1+(boxSize*Math.random()), posy1, posx1, posy1+(boxSize*Math.random()))
							}
							let ln2 = Math.random()
							if (ln2 < 0.33) { //left to right
								line(posx1, posy1+(boxSize*Math.random()), posx2, posy1+(boxSize*Math.random()))
							} else if (ln2 < 0.66) { //line from bottom to right
								line(posx1+(boxSize*Math.random()), posy2, posx2, posy1+(boxSize*Math.random()))
							} else { //line from bottom to left
								line(posx1+(boxSize*Math.random()), posy2, posx1, posy1+(boxSize*Math.random()))
							}
						}
					}

					pop();
				}
			
			}
			pop();
		}
	}
	
}


function ltrPtNames(ltrPts, locsUsed, loc, ltrGridSize, totBox, lastDir, samDirWt, crossEdges) {
	
	for (var p = 0; p < ltrPts; p++) {
		
		if (locsUsed.includes(loc) == false) { //only add a location once since loc's can be used multiple times; duplicates would abbreviate letter design
			locsUsed = append(locsUsed, loc)
		}
		
		newLocLastDir = newLocFun(loc, ltrGridSize, totBox, lastDir, p, samDirWt, locsUsed, crossEdges)
		loc = newLocLastDir[0]
		lastDir = newLocLastDir[1]
	}
		return locsUsed
}

function gridLoc(loc, ltrGridSize) {
	
	let locRow =  floor(loc/ltrGridSize);
	let locCol = loc % ltrGridSize;
	
	pos = [locCol, locRow]; //x,y of square in grid determined by ltrGridSize
	
	return pos;
				 }

function newLocFun(oldLoc, ltrGridSize, totBox, lastDir, p, samDirWt, locsUsed, crossEdges) { 

	let possLocFin = []
	let possLocs = [[oldLoc - 1,0], [oldLoc + 1,1], [oldLoc - ltrGridSize,2], [oldLoc + ltrGridSize,3]] //boxes left, right, up, down

	if (p > 0) {
		for (sd = 0; sd < samDirWt; sd++) {
			let plAdd = possLocs[lastDir]
			append(possLocs,plAdd) //add greater probability that writing will continue in same direction
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
			newDir = floor(random(possLocFin.length))
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
  loadPixels();
  for (let y = 0; y < height; y++) {
    let xoff = 0;
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      // let r = random(255);
      let alpha = (noise(xoff, yoff) * 60) + 195; //ensures alpha between 195 and 255. gets subtler gradient and higher alpha/lower transparency
      pixels[index + 0] = bgColRgb[0];
      pixels[index + 1] = bgColRgb[1];
      pixels[index + 2] = bgColRgb[2];
      pixels[index + 3] = alpha;

      xoff += inc;
    }
    yoff += inc;
  }
  updatePixels();
  noLoop();
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