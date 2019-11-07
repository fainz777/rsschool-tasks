export default class Helpers {
	static getColor(color) {
		const defaultColor = '#000';

		if (typeof color === 'string') {
			return '#' + color;
		}

		let rgbaColor = [...color];

		try {
			rgbaColor[3] = rgbaColor.length === 4 ? (rgbaColor[3] / 255).toFixed(2) : 1;
			rgbaColor = `rgba(${rgbaColor.join(',')})`;
		} catch(e) {
			return defaultColor
		}

		return rgbaColor;
	}

	static showMessage(message) {
		alert(message);
	}
}