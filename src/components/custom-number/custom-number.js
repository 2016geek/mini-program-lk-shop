import { numberLabel } from '../../utils/util';

const STORAGE_PRE = 'customNumber-';

Component({
	externalClasses: ['my-class'],
	properties: {
		number: {
			type: Number,
			value: 0,
		},
		totalTime: {
			type: Number,
			value: 500,
		},
		useAnimation: {
			type: Boolean,
			value: false,
		},
		storageKey: {
			type: String,
			value: '',
		},
	},
	data: {
		oldNumber: 0,
		currentNumber: 0,
		showLabel: '00.00',
		step: 0,
		isUp: true,
		timeStep: 20,
	},
	observers: {
		number(num) {
			const { currentNumber, totalTime, timeStep, storageKey } = this.data;
			const storageValue = this.getStorageValue();
			const old = storageKey ? storageValue : currentNumber;
			const isUp = num >= old;
			const distance = Math.abs(num - old);
			const times = Math.min(totalTime / timeStep, distance);
			const step = distance / times;

			this.setData({ step, isUp }, () => {
				this.setCurrentNumber();
			});
		},
		currentNumber(current) {
			const { number } = this.data;
			if (number === current) {
				this.setStorageValue(current);
			}
		},
	},
	methods: {
		setCurrentNumber() {
			const { useAnimation, number } = this.data;
			if (!useAnimation) {
				this.setData({
					currentNumber: number,
					showLabel: numberLabel(number),
				});
				return;
			}
			const timer = setTimeout(() => {
				const { currentNumber, number, step, isUp } = this.data;
				const isOver = isUp ? currentNumber >= number : currentNumber <= number;

				if (isOver) {
					this.setData({
						currentNumber: number,
						showLabel: numberLabel(number),
					});
					return;
				}
				const current = isUp ? currentNumber + step : currentNumber - step;
				this.setData({
					currentNumber: current,
					showLabel: numberLabel(current),
				}, () => this.setCurrentNumber());
				clearTimeout(timer);
			}, this.data.timeStep);
		},
		getStorageValue() {
			const { storageKey } = this.data;
			if (!storageKey) return 0;
			try {
				const value = wx.getStorageSync(STORAGE_PRE + storageKey);
				this.setData({
					currentNumber: value || 0,
				});
				return value || 0;
			}
			catch (e) {
				return 0;
			}
		},
		setStorageValue(value) {
			const { storageKey } = this.data;
			if (!storageKey) return;
			wx.setStorageSync(STORAGE_PRE + storageKey, value);
		},
	},
});

