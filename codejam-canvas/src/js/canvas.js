import Helpers from './helpers';

import pattern4x4 from  '../data/4x4';
import pattern32x32 from  '../data/32x32';
import image from '../data/image.png';

const config = {
	drawTypes: {
		pattern: 'pattern',
		image: 'image'
	},
	drawImages: {
		pattern4x4: pattern4x4,
		pattern32x32: pattern32x32,
		image: image
	}
};

class Canvas {
	constructor(canvasId) {
		if (!canvasId) {
			Helpers.showMessage('Error: canvasId is not set.');

			return;
		}

		const canvas = document.getElementById(canvasId);

		if (!canvas) {
			Helpers.showMessage(`Error: canvas element with id ${canvasId} was not found.`);

			return;
		}

		this.width = canvas.width;
		this.height = canvas.height;
		this.ctx = palette.getContext('2d');
	}

	setEvents() {
		const canvasChangeElems = document.querySelectorAll('.canvas_change');

		canvasChangeElems.forEach(elem => {
			const elemClasses = elem.classList;
			const drawType = elem.dataset.type;

			if (elemClasses.contains('active')) {
				this.drawCanvas(drawType);
			}

			elem.addEventListener('click', this.manageCanvasDrawing.bind(this, elem));
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
				color = Helpers.getColor(color);
				this.ctx.fillStyle = color;

				this.ctx.fillRect(j * w, i * h, w, h);
			});
		});
	}

	drawImage(imageSrc) {
		const image = new  Image();
		const _self = this;
		image.src = imageSrc;
		image.onload = function() {
			_self.ctx.drawImage(this, 0, 0, 512, 512);
		};
	}

	drawCanvas(drawType) {
		const draw = config.drawImages[drawType];
		if (drawType.includes(config.drawTypes.pattern)) {
			this.drawPattern(draw);
		} else if (drawType.includes(config.drawTypes.image)) {
			this.drawImage(draw);
		}
	}

	manageCanvasDrawing(elem) {
		const elemClasses = elem.classList;

		if (elemClasses.contains('active')) {
			return;
		}

		const activeElem = document.querySelector('.canvas_change.active');
		activeElem.classList.remove('active');
		elemClasses.add('active');
		const drawType = elem.dataset.type;

		this.clearCanvas();
		this.drawCanvas(drawType);
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