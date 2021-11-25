
let colAryall1 = ["#12508f", "#863E2C", "#D7392E", "#29626D", "#396C21", "#204830", "#2A393C", "#6F7575", "#7B7E83", "#428857"]
let colAryall2 = ["#3C806E", "#DADBE0", "#EDE5CE", "#222222", "#F09033", "#F19E6F", "#256B9F", "#628ED7", "#C54D3D", "#C74341"]
let colAryall3 = ["#A83B40", "#F2EA99", "#EFD658", "#9F7648", "#BF8C30", "#F5BF32", "#3C4447", "#7A463B", "#51565A", "#AD2E35"]

let locRow, locCol, pos, loc, points, newPtx, newPty, totalPts, p, q, w, boxSize, lastDir, newDir, newLocLastDir

function setup() {
	createCanvas(windowWidth, windowHeight);
	bgWidth = min(width,height)
	createCanvas(bgWidth,bgWidth)
	
	background(255);
	
	let gridSize = 5;
	let totBox = gridSize*gridSize; //total number of squares in grid
	let ltrPts = floor(totBox * 0.75);
	let boxSize = bgWidth / gridSize;
	let samDirWt = 5; //higher number = greater probability that lines will continue in same dir - more long straight sections
	let lastDir = 0;
	
	/*
	//draw grid for debugging
	for (var x = 0; x < width; x += width / gridSize) {
		for (var y = 0; y < height; y += height / gridSize) {
			stroke(1);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
	*/
	
	let locsUsed = []
	loc = floor(random(totBox)); //start with random location between 0 and total number of squares in grid minus 1
	for (var p = 0; p < ltrPts; p++) {
		
		if (locsUsed.includes(loc) == false) { //only add a location once to the check otherwise will limit the design length
			locsUsed = append(locsUsed, loc)
		}
		
		pos = gridLoc(loc,gridSize); //get x and y of top left corner of square
		
		//get corners of the square grid to set drawing points in
		posx1 = pos[0]*(boxSize);
		posy1 = pos[1]*(boxSize);
		
		fill("#222222")
		stroke("#222222")
		square(posx1, posy1, boxSize)
		newLocLastDir = newLocFun(loc, gridSize, totBox, lastDir, p, samDirWt, locsUsed)
		loc = newLocLastDir[0]
		lastDir = newLocLastDir[1]
		
	}
	
		
}
		
function gridLoc(loc, gridSize) {
	
	let locRow =  floor(loc/gridSize)
	let locCol = loc % gridSize
	
	pos = [locCol, locRow]
	
	return pos
				 
				 }

function newLocFun(oldLoc, gridSize, totBox, lastDir, p, samDirWt, locsUsed) { 

	let possLocFin = []
	let possLocs = [[oldLoc - 1,0], [oldLoc + 1,1], [oldLoc - gridSize,2], [oldLoc + gridSize,3]] //boxes left, right, up, down

	if (p > 0) {
		for (sd = 0; sd < samDirWt; sd++) {
			let plAdd = possLocs[lastDir]
			append(possLocs,plAdd) //add greater probability that writing will continue in same direction
		}
	}
	
	for (let l = 0; l < possLocs.length; l++) {
		possLocs[l][2] = 0
		let possLocPos = gridLoc(possLocs[l][0], gridSize)
		
		//This section stops left-right crossover - is that desirable or no? Maybe different setting for diff alfabets?
		if (possLocPos[0] == 0 || possLocPos[0] == gridSize) { //in first or last column
			possLocs[l][2] = possLocs[l][2]+1;
		}
		if (possLocPos[1] == 0 || possLocPos[1] == gridSize) { //in first or last row
			possLocs[l][2] = possLocs[l][2]+1;
		}
		
		
		for (let lu = 0; lu < locsUsed.length; lu++) { //see if adjacent cells already used, if so add to count
			if (possLocs[l][0] - 1 == locsUsed[lu] || //left of possible location
				 	possLocs[l][0] + 1 == locsUsed[lu] || //right of possible location
					possLocs[l][0] - gridSize == locsUsed[lu] || //up of possible location
					possLocs[l][0] + gridSize == locsUsed[lu] || //down of possible location
					possLocs[l][0] - (gridSize-1) == locsUsed[lu] || //upper-right of poss loc
					possLocs[l][0] - (gridSize+1) == locsUsed[lu] || //upper-left of poss loc
					possLocs[l][0] + (gridSize-1) == locsUsed[lu] || //lower-right of poss loc
					possLocs[l][0] + (gridSize+1) == locsUsed[lu]	//lower-left of poss loc
				 ){
				possLocs[l][2] = possLocs[l][2]+1
			}
		}
	}
		
	for (let l = 0; l < possLocs.length; l++) {
		if (possLocs[l][0] >= 0 && 
				possLocs[l][0] < totBox &&
			 	possLocs[l][2] < 3) {
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
	
	