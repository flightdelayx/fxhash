/*testing colors*/
let colAry1 = ["#12508f", "#863E2C", "#D7392E", "#29626D", "#396C21", "#204830", "#2A393C", "#6F7575", "#7B7E83", "#428857"]
let colAry2 = ["#3C806E", "#DADBE0", "#EDE5CE", "#222222", "#F09033", "#F19E6F", "#256B9F", "#628ED7", "#C54D3D", "#C74341"]
let colAry3 = ["#A83B40", "#F2EA99", "#EFD658", "#9F7648", "#BF8C30", "#F5BF32", "#3C4447", "#7A463B", "#51565A", "#AD2E35"]
let colAry, numCol, cl, yStart, yStop


colAry = colAry1.concat(colAry2.concat(colAry3))
colAry.sort()

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	numCol = colAry.length
	textSize()
	textAlign(CENTER,CENTER)
	
	for (i=0; i<numCol; i++) {
		cl = colAry[i]
		console.log(cl)
		fill(cl);
		noStroke();
		yStart = i*height/numCol;
		yStop = (height/numCol) + (i*height/numCol);
		rect(0, yStart, width, yStop);
		fill(255)
		text(cl, width/2, (yStart+yStop)/2)
		
	}
	
} 