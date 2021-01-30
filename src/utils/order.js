import { areaComputed } from './util'
import enumData from '../config/enum'
export const getEnumLabel = (options, value, defaultLabel = '') => {
	const chose = options.find(v => v.value === value)
	return chose ? chose.label : defaultLabel
}
export const computedCraft = (craftRequests) => {
	const { CRAFT } = enumData;
	const result = craftRequests.map((item) => {
		if (item.type === 1) {
			return getEnumLabel(CRAFT, item.type + item.printType * 10);
		}
		const chose = CRAFT.find((v) => v.value === item.type);
		if (chose) {
			return chose.showArea
				? chose.label + " " + areaComputed(chose.position) + "MM²"
				: chose.label;
		}
		return "";
	});
	return result.join("/");
}
export const computedRope = (ropeRequest) => {
	const { LINE_TYPE } = enumData;
	const { type, color, length } = ropeRequest;
	return [getEnumLabel(LINE_TYPE, type), color, length + "MM"].join(
		"/"
	);
}