import pattern4x4 from  '../data/4x4';
import pattern32x32 from  '../data/32x32';
import image from '../data/image.png';

const config = {
	pattern4x4: pattern4x4,
	pattern32x32: pattern32x32,
	image: image
}

class Canvas {
	constructor() {}

}

function getColor(color) {
	if (typeof color === 'string') {
		return '#' + color;
	}

	let rgbaColor = [...color];
	rgbaColor[3] = rgbaColor.length === 4 ? (rgbaColor[3] / 255).toFixed(2) : 1;
	rgbaColor = `rgba(${rgbaColor.join(',')})`;

	return rgbaColor;
}

function clearCanvas(ctx) {
	ctx.clearRect(0, 0, 512, 512);
}

function drawPattern(ctx, pattern) {
	const w = 512 / pattern.length;
	const h = 512 / pattern[0].length;

	pattern.forEach((line, i) => {
		line.forEach((color, j) => {
			color = getColor(color);
			ctx.fillStyle = color;

			ctx.fillRect(j * w, i * h, w, h);
		});
	});
}

async function drawImage(ctx, imageSrc) {
	const image = new  Image();
	image.src = imageSrc;
	image.onload = function() {
		ctx.drawImage(this, 0, 0, 512, 512);
	};
}

function drawCanvas(ctx, drawType) {
	const draw = config[drawType];
	if (drawType.includes('pattern')) {
		drawPattern(ctx, draw);
	} else if (drawType.includes('image')) {
		drawImage(ctx, draw);
	}
}

function manageCanvasDrawing() {

	const elemClasses = this.classList;

	if (elemClasses.contains('active')) {
		return;
	}

	const activeElem = document.querySelector('.canvas_change.active');
	activeElem.classList.remove('active');

	elemClasses.add('active');

	const drawType = this.dataset.type;

	const palette = document.getElementById('palette');
	const ctx = palette.getContext('2d');
	clearCanvas(ctx);
	drawCanvas(ctx, drawType);
}

function init() {
	const palette = document.getElementById('palette');

	const paletteCtx = palette.getContext('2d');
	const canvasChangeElems = document.querySelectorAll('.canvas_change');

	canvasChangeElems.forEach(elem => {
		const elemClasses = elem.classList;
		const drawType = elem.dataset.type;

		if (elemClasses.contains('active')) {
			drawCanvas(paletteCtx, drawType);
		}

		elem.addEventListener('click', manageCanvasDrawing);
	});

	//drawPattern(paletteCtx, pattern4x4);
	//drawImage(paletteCtx, image);

	//console.log(p);
}

document.addEventListener('DOMContentLoaded', init);