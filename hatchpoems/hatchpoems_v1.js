
let colAryall1 = ["#12508f", "#863E2C", "#D7392E", "#29626D", "#396C21", "#204830", "#2A393C", "#6F7575", "#7B7E83", "#428857"]
let colAryall2 = ["#3C806E", "#DADBE0", "#EDE5CE", "#222222", "#F09033", "#F19E6F", "#256B9F", "#628ED7", "#C54D3D", "#C74341"]
let colAryall3 = ["#A83B40", "#F2EA99", "#EFD658", "#9F7648", "#BF8C30", "#F5BF32", "#3C4447", "#7A463B", "#51565A", "#AD2E35"]

let colAry = colAryall1.concat(colAryall2.concat(colAryall3))

let colPicker = colAry
let colAryBackup = colAry



function setup() {
	createCanvas(windowWidth, windowHeight);
	bgWidth = min(width,height)
	createCanvas(bgWidth,bgWidth)
	
	background(255);
}
	
function draw() {
	
	translate(width/2, height/6) //, height /2);
	scale(0.5);
	translate(-width/2, -height/6) //, -height / 2);
	
	let sqColor, sqColorPos, loc, x, y
	
	/*setup initial parameters; randomize these in final version*/
	let ltrGridSize = 7; //must be width 7 for fdFont. Width 7, height 15
	
	let sgmtX = 7
	let sgmtY = 9
	
	let boxSize = bgWidth / ltrGridSize / sgmtX;
	
	let w = bgWidth / sgmtX
	
	
	for(let i=0; i<sgmtX; i++){ 
		
		for(let j=0; j<sgmtY; j++){
	
			x = (i * w) + i*(w/1) //+ j*(w/3)
			y =  (j * w) + j*(w/1) //+ j*(w/3)
			

		/*
			//draw grid for debugging
			for (var x1 = 0; x1 < width; x1 += width / ltrGridSize) {
				for (var y1 = 0; y1 < height; y1 += height / ltrGridSize) {
					stroke(1);
					strokeWeight(1);
					line(x1, 0, x1, height);
					line(0, y1, width, y1);
				}
			}
		*/

			//letterLocs = [1,2,3,4,7,12,19,22,23,24,25,26,28,33,35,40,43,44,45,46,47,48] //letter a
			//letterLocs = [22,23,24,25,28,33,40,43,44,45,46,47,49,54,56,61,64,65,66,67,68,69] //letter a+21
			//letterLocs = [2,3,4,8,12,14,20,21,27,28,34,36,40,44,45,46] //letter o
			let la = 	[22,23,24,25,28,33,40,43,44,45,46,47,49,54,56,61,64,65,66,67,68,69] /*loopy a*/
			let la2 = [23,24,25,27,29,33,34,35,41,42,48,49,55,57,61,62,65,66,67,69] /*round a*/
			let lb = 	[0,7,14,21,28,23,24,25,29,33,35,41,42,48,49,55,57,61,65,66,67] 
			let lb2 = [0,7,14,21,28,23,24,25,29,33,35,41,42,48,49,55,57,61,65,66,67,56,63] 
			let lc = 	[23,24,25,26,29,35,42,49,57,65,66,67,68] 
			let ld = 	[6,13,20,23,24,25,27,29,33,34,35,41,42,48,49,55,57,61,65,66,67] //no tail
			let ld2 = [6,13,20,23,24,25,27,29,33,34,35,41,42,48,49,55,57,61,65,66,67,62,69] //tail
			let le = 	[23,24,25,29,33,35,41,42,43,44,45,46,47,49,57,61,65,66,67]
			let lf = 	[4,5,10,13,17,22,23,24,25,26,31,38,45,52,59,66]
			let lf2 = [4,5,10,13,17,24,29,30,31,32,33,38,45,52,59,66]
			let lg = 	[23,24,25,27,29,33,34,35,41,42,48,49,55,57,61,62,65,66,67,69,76,83,85,89,93,94,95]
			let lh = 	[1,8,15,22,29,31,32,36,37,40,43,48,50,55,57,62,64,69] /*skinny h*/
			let lh2 = [0,7,14,21,28,30,31,32,35,36,40,42,48,49,55,56,62,63,69] /*fat h*/
			let li = 	[24,38,45,52,59,66] /*short i*/
			let li2 = [17,31,38,45,52,59,66] /*tall i*/
			let lj = 	[24,38,45,52,59,66,70,73,77,80,85,86] /*short skinny j, centered*/
			let lj2 =	[18,32,39,46,53,60,67,70,74,77,81,85,86,87] /*tall fat j, center-right*/
			let ll = 	[10,17,24,31,38,45,52,59,61,67] /*short l, curved*/
			let ll2 =	[3,10,17,24,31,38,45,52,59,61,67] /*tall l, curved*/
			let ll3 =	[10,17,24,31,38,45,52,59,66] /*short l, straight*/
			let ll4 =	[3,10,17,24,31,38,45,52,59,66] /*tall l, straight*/
			let lm = 	[28,30,32,35,36,38,40,42,45,48,49,52,55,56,59,62,63,66,69]
			let ln = 	[28,30,31,32,35,36,40,42,48,49,55,56,62,63,69] //tail
			let ln2 = [30,31,32,36,40,42,48,49,55,56,62,63,69] //no tail
			let ln3 = [21,23,24,25,28,29,33,35,36,40,42,48,49,55,56,62,63,69] //tall tail
			let lo = 	[23,24,25,29,33,35,41,42,48,49,55,57,61,65,66,67] 
			let lp = 	[23,24,25,29,33,35,41,42,48,49,55,56,57,61,63,65,66,67,70,77,84] //no tail
			let lp2 = [21,23,24,25,28,29,33,35,41,42,48,49,55,56,57,61,63,65,66,67,70,77,84] //tail
			let lq = 	[23,24,25,29,33,35,41,42,48,49,55,57,61,62,65,66,67,69,76,83,90] //no tail
			let lq2 = [23,24,25,27,29,33,34,35,41,42,48,49,55,57,61,62,65,66,67,69,76,83,90] //tail
			let lr = 	[23,24,25,29,33,35,42,49,56,63] //no tail
			let lr2 = [21,23,24,25,28,29,33,35,42,49,56,63] //tail
			let ls = 	[23,24,25,29,33,36,44,45,46,54,57,61,65,66,67] //smaller s
			let ls2 = [9,10,11,15,19,21,27,28,36,37,38,39,40,48,49,55,57,61,65,66,67] //bigger s - looks like a capital s
			let ls3 = [22,23,24,25,26,28,34,35,,43,44,45,46,47,55,56,62,64,65,66,67,68] //wider s
			let lt = 	[3,10,17,22,23,24,25,26,31,38,45,52,59,61,67] /*tall t*/
			let lt2 = [10,17,24,29,30,31,32,33,38,45,52,59,61,67] /*short t*/
			let lu = 	[28,34,35,41,42,48,49,55,57,61,62,65,66,67,69] //tail
			let lu2 =	[28,34,35,41,42,48,49,55,57,61,65,66,67] //no tail
			let lv =	[28,34,35,41,42,48,50,54,58,60,66]
			let lw = 	[28,34,35,41,42,45,48,49,52,55,57,59,61,65,67] //no tail
			let lw2 = [28,31,34,35,38,41,42,45,48,49,52,55,57,59,61,62,65,67,69] //tail
			let lx = 	[21,27,29,33,37,39,45,51,53,57,61,63,69]
			let ly = 	[28,34,35,41,42,48,49,55,57,61,62,65,66,67,69,76,83,85,89,93,94,95] 
			let lz = 	[21,22,23,24,25,26,27,33,39,45,51,57,63,64,65,66,67,68,69] 
			//	letterLocs = [[1,2,3,4,7,12,19,22,23,24,25,26,28,33,35,40,43,44,45,46,47,48,53], [2,3,4,8,12,14,20,21,27,28,34,36,40,44,45,46]]; //letter a,o

			let letterLocs = []
			letterLocs[0] = lm
			letterLocs[1] = lw
			letterLocs[2] = lw2  
			letterLocs[3] = lx  
			//	[[6,13,20,23,24,25,27,29,33,34,35,41,42,48,49,55,57,61,65,66,67]] //, [23,24,25,29,33,35,41,42,48,49,55,57,61,65,66,67], [6,13,20,23,24,25,27,29,33,34,35,41,42,48,49,55,57,61,65,66,67], [22,23,24,25,28,33,40,43,44,45,46,47,49,54,56,61,64,65,66,67,68,69]]; //letter a,o

			//for (let lRan = 0; lRan < letterLocs.length; lRan++) {
			let lRan = floor(map(Math.random(),0,1,0,letterLocs.length))

				ltrPts = letterLocs[lRan].length
				
			
				if (colAry.length == 0) {
					colAry = colAryall1.concat(colAryall2.concat(colAryall3))
				}
				sqColorPos = floor(map(Math.random(), 0, 1, 0, colAry.length))
				sqColor = colAry[sqColorPos];
				colAry.splice(sqColorPos,1); //remove letter color from color array used for letters

				for (let ll = 0; ll < ltrPts; ll++) {

					loc = letterLocs[lRan][ll]

					pos = gridLoc(loc,ltrGridSize); //get x and y of top left corner of square

					//get corners of the square grid to set drawing points in
					posx1 = x + pos[0]*(boxSize); //+1 top left corner
					posy1 = y + pos[1]*(boxSize);//-boxSize;
					posx2 = x + pos[0]*(boxSize)+boxSize; //+1 bottom right corner
					posy2 = y + pos[1]*(boxSize)+boxSize; 


					fill(sqColor)
					stroke(sqColor)
					strokeWeight(1)


					let emboss = 0
					//draw filled squares if embossing
					if (emboss == 1) {
						square(posx1, posy1, boxSize)
					}				

					let hatching = 1 //ABH - always be hatching! hatching adds some fuzz around the filled square = softer edges
					//hatching - lines drawn between random points in each square
					if (hatching) {
						let lns = 13 * (emboss+1)
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

		//		}
			}
		}
	noLoop();
	}	
}


function gridLoc(loc, ltrGridSize) {

	let locRow =  floor(loc/ltrGridSize);
	let locCol = loc % ltrGridSize;

	pos = [locCol, locRow]; //x,y of square in grid determined by ltrGridSize

	return pos;
	}