import p5 from "p5";

// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
//window.$fxhashFeatures = {
//	"Background": "Black",
//   	"Number of lines": 10,
//   	"Inverted": true
// }

let sketch = function(p5) {
	/*
		Albersquares - generative art based on Josef Albers' Homage to the Square
	*/

	//split colors into multiple arrays to start for readability
	//albers-ish color palette from Met's Josef Albers collection https://www.metmuseum.org/art/collection/search#!?q=Josef%20Albers%20homage&perPage=20&offset=0&pageSize=0&sortBy=Relevance&sortOrder=asc&searchField=All

	let aCol1 = ["#12508f", "#863E2C", "#D7392E", "#29626D", "#396C21", "#204830", "#2A393C", "#6F7575", "#7B7E83", "#428857"]
	let aCol2 = ["#3C806E", "#DADBE0", "#EDE5CE", "#222222", "#F09033", "#F19E6F", "#256B9F", "#628ED7", "#C54D3D", "#C74341"]
	let aCol3 = ["#A83B40", "#F2EA99", "#EFD658", "#9F7648", "#BF8C30", "#F5BF32", "#3C4447", "#7A463B", "#51565A", "#AD2E35"]

	//monochrome grayscale
	let mCol1 = ["#000000", "#101010", "#1b1b1b", "#242424", "#2c2c2c", "#333333", "#3a3a3a", "#414141", "#484848", "#4f4f4f"]
	let mCol2 = ["#565656", "#5d5d5d", "#646464", "#6b6b6b", "#727272", "#797979", "#818181", "#898989", "#919191", "#999999"]
	let mCol3 = ["#a2a2a2", "#ababab", "#b4b4b4", "#bebebe", "#c8c8c8", "#d2d2d2", "#dddddd", "#e8e8e8", "#f3f3f3", "#ffffff"]

	let squareSize, bgWidth, colors, cRnd, colLength, yShift, xShift, sqColor

	p5.setup =function() {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		bgWidth = p5.min(p5.width, p5.height)
		p5.createCanvas(bgWidth, bgWidth)
		p5.background(0);

		//color palette selection - 95% colored, 5% monochrome
		cRnd = fxrand()
		if (cRnd < 0.95) {
			colors = p5.concat(p5.concat(aCol1,aCol2),aCol3)
		}
		else {
			colors = p5.concat(p5.concat(mCol1,mCol2),mCol3)
		}

		//draw some squares!
		let numSquares = 4 //number of squares in each grid section 
		let seg = p5.floor(fxrand()*6)+5 //gives integer from 5-10
			//(5,11) will give 16.67% each of: 25, 36, 49, 64, 81, 100 total squares
		
		let w = p5.width / seg;
		let XorYShift = 0;
		let yShiftOpt, xShiftOpt;
		
		for(let i=0; i<seg; i++){ 
			
			for(let j=0; j<seg; j++){
				XorYShift = p5.floor(fxrand()*20); //shift on x or y axis -- 90% shift on y axis, 5% centered, 5% shift on x axis
				yShiftOpt = p5.floor(fxrand()*18); //shift up or down
				xShiftOpt = p5.floor(fxrand()*2); //shift left or right

				if (XorYShift == 0) { // 5% total are centered
					yShift = 0;
					xShift = 0;
				} else if (XorYShift == 1 || XorYShift == 2) //10% total shift on x axis
					{
					if (xShiftOpt > 0) { //half left (5%) half right (5%)
						xShift = 1;
					} else {
						xShift = -1;
					}
					yShift = 0;
				} else {
					if (yShiftOpt > 0) { //5% total shift up, 80% total shift down
						yShift = 1;
					} else {
						yShift = -1;
					}
					xShift = 0;
				}
				
				for(let s=0; s<numSquares; s++){

					squareSize = (p5.width/ (seg+1)) - s*(p5.width/((seg+1)*5)) ;//each smaller square is same ratio smaller

					let x = (i * w + w / 2) + (s*(p5.width/((seg+1)*20)))*xShift; 
					let y =  (j * w + w / 2) + (s*(p5.width/((seg+1)*20)))*yShift;

				p5.squares1(x,y,squareSize)

					}
				}
		}
		
	}

	p5.squares1 = function(x,y,z) {
			p5.rectMode(p5.CENTER);
			colLength = colors.length;
		
			sqColor = colors[p5.floor(fxrand()*colLength)]; //get random color from colors array for each square

			p5.fill(sqColor);
			p5.noStroke();
			p5.square(x,y,z);
		
	} 
}


let myp5 = new p5(sketch, window.document.body);