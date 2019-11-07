export default class Helpers {
	static getColor(color) {
		if (typeof color === 'string') {
			return '#' + color;
		}

		let rgbaColor = [...color];
		rgbaColor[3] = rgbaColor.length === 4 ? (rgbaColor[3] / 255).toFixed(2) : 1;
		rgbaColor = `rgba(${rgbaColor.join(',')})`;

		return rgbaColor;
	}

	static showMessage(message) {
		alert(message);
	}
}