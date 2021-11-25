
let colAryall1 = ["#12508f", "#863E2C", "#D7392E", "#29626D", "#396C21", "#204830", "#2A393C", "#6F7575", "#7B7E83", "#428857"]
let colAryall2 = ["#3C806E", "#DADBE0", "#EDE5CE", "#222222", "#F09033", "#F19E6F", "#256B9F", "#628ED7", "#C54D3D", "#C74341"]
let colAryall3 = ["#A83B40", "#F2EA99", "#EFD658", "#9F7648", "#BF8C30", "#F5BF32", "#3C4447", "#7A463B", "#51565A", "#AD2E35"]

colors = colAryall1.concat(colAryall2.concat(colAryall3))

let locRow, locCol, pos, loc, points, newPtx, newPty, totalPts, p, q, w, boxSize, lastDir, newDir, newLocLastDir, sqColor, offset

function setup() {
	createCanvas(windowWidth, windowHeight);
	bgWidth = min(width,height)
	//bgWidth = max(width,height)
	createCanvas(bgWidth,bgWidth)
	
	background(255);
	
	/*setup initial parameters; randomize these in final version*/
	let gridSize = random([7,13,20]); //grid for the letter to be drawn on variable that can be changed. recommend 5-7 for letters
	//maybe make seg options relative to gridSize??
	let seg = 10 //random([20,25,30]); //size of grid for letters to be written on across the page; min 30 for letter grid...looks better with more
	let totBox = gridSize*gridSize; //total number of squares in grid; don't change
	let ltrPts = floor(totBox * random([0.3,0.5,0.8])); //how many possible squares can be filled. *0.2 should be minimum; 0.3 - 0.6 seems like good range. max 0.8?
	let samDirWt = random([2,5,7,12]); //higher number = straighter lines; lower = squigglier; rec min 2 max 15(?)
	let crossEdges = random([0,1,1]); //1 or 0: if = 1, letter drawing can cross from right/left edge and vice versa, creating disconnected shapes
	let lastDir = random([0,1,2,3]); //initial setting of the last direction; 0=left, 1=right, 2=up, 3=down; works with samDirWt, likelihood of direction of writing
	
	console.log("gridSize: " + gridSize)
	console.log("seg: " + seg)
	console.log("samDirWt: " + samDirWt)
	console.log("ltrPts: " + ltrPts)
	
	let w = width / seg //width of a given box
	
	let offset = 0.6
	
	let boxSize = (bgWidth / gridSize / seg) * offset;
	
	
	for(let i=0; i<seg; i++){ 
		
		for(let j=0; j<seg; j++){
		
			let x = (i * w)
			let y =  (j * w)
			
			let locsUsed = []
			let loc = floor(random(totBox)); //start with random location between 0 and total number of squares in grid minus 1

			let letterLocs = ltrPtNames(ltrPts, locsUsed, loc, gridSize, totBox, lastDir, samDirWt, crossEdges)
			
			let colRand = Math.random()

			if (colRand < 0.5) {
				sqColor = 0
			} else if (colRand > 0.5 && colRand < 0.8) {
				sqColor = 255
			} else {
				sqColor = colors[int(random(colors.length))]
			}				
			
			for (let ll = 0; ll < letterLocs.length; ll++) {
				loc = letterLocs[ll]
				pos = gridLoc(loc,gridSize); //get x and y of top left corner of square
				//get corners of the square grid to set drawing points in
				posx1 = x + pos[0]*(boxSize) + (boxSize*offset);
				posy1 = y + pos[1]*(boxSize) + (boxSize*offset);
				

				//sqColor = 0
				
				fill(sqColor)
				stroke(sqColor)
				square(posx1, posy1, boxSize)
			}
		}
	}

}

function ltrPtNames(ltrPts, locsUsed, loc, gridSize, totBox, lastDir, samDirWt, crossEdges) {
	
	for (var p = 0; p < ltrPts; p++) {
		
		if (locsUsed.includes(loc) == false) { //only add a location once since loc's can be used multiple times; duplicates would abbreviate letter design
			locsUsed = append(locsUsed, loc)
		}
		
		newLocLastDir = newLocFun(loc, gridSize, totBox, lastDir, p, samDirWt, locsUsed, crossEdges)
		loc = newLocLastDir[0]
		lastDir = newLocLastDir[1]
	}
		return locsUsed
}

function gridLoc(loc, gridSize) {
	
	let locRow =  floor(loc/gridSize);
	let locCol = loc % gridSize;
	
	pos = [locCol, locRow]; //x,y of square in grid determined by gridSize
	
	return pos;
				 }

function newLocFun(oldLoc, gridSize, totBox, lastDir, p, samDirWt, locsUsed, crossEdges) { 

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
		if (crossEdges == 0) {
			if (possLocPos[0] == 0 || possLocPos[0] == gridSize) { //in first or last column
				possLocs[l][2] = possLocs[l][2]+1;
			}
			if (possLocPos[1] == 0 || possLocPos[1] == gridSize) { //in first or last row
				possLocs[l][2] = possLocs[l][2]+1;
			}
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
	
	