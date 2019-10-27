import pattern4x4 from  '../data/4x4';
import pattern32x32 from  '../data/32x32';
import image from '../data/image.png';

const config = {
	pattern4x4: pattern4x4,
	pattern32x32: pattern32x32,
	image: image
};

function getColor(color) {
	if (typeof color === 'string') {
		return '#' + color;
	}

	let rgbaColor = [...color];
	rgbaColor[3] = rgbaColor.length === 4 ? (rgbaColor[3] / 255).toFixed(2) : 1;
	rgbaColor = `rgba(${rgbaColor.join(',')})`;

	return rgbaColor;
}

class Canvas {
	constructor(canvasId) {
		const canvas = document.getElementById(canvasId);
		this.width = canvas.width;
		this.height = canvas.height;
		this.ctx = palette.getContext('2d');
	}

	setEvents() {
		const canvasChangeElems = document.querySelectorAll('.canvas_change');

		canvasChangeElems.forEach(elem => {
			const elemClasses = elem.classList;
			const drawType = elem.dataset.type;
			const _self = this;

			if (elemClasses.contains('active')) {
				this.drawCanvas(drawType);
			}

			elem.addEventListener('click', function() {
				_self.manageCanvasDrawing(this, _self);
			});
		});
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	drawPattern(pattern) {
		const w = this.width / pattern.length;
		const h = this.height / pattern[0].length;

		pattern.forEach((line, i) => {
			line.forEach((color, j) => {
				color = getColor(color);
				this.ctx.fillStyle = color;

				this.ctx.fillRect(j * w, i * h, w, h);
			});
		});
	}

	async drawImage(imageSrc) {
		const image = new  Image();
		const _self = this;
		image.src = imageSrc;
		image.onload = function() {
			_self.ctx.drawImage(this, 0, 0, 512, 512);
		};
	}

	drawCanvas(drawType) {
		const draw = config[drawType];
		if (drawType.includes('pattern')) {
			this.drawPattern(draw);
		} else if (drawType.includes('image')) {
			this.drawImage(draw);
		}
	}

	manageCanvasDrawing(elem, self) {
		const elemClasses = elem.classList;

		if (elemClasses.contains('active')) {
			return;
		}

		const activeElem = document.querySelector('.canvas_change.active');
		activeElem.classList.remove('active');
		elemClasses.add('active');
		const drawType = elem.dataset.type;

		self.clearCanvas();
		self.drawCanvas(drawType);
	}

	init() {
		this.setEvents();
	}
}

function init() {
	let palette = new Canvas('palette');
	palette.init()
}

document.addEventListener('DOMContentLoaded', init);