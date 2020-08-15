import dayjs from 'dayjs';

export function emailValidate(value) {
	return /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(
		value,
	);
}

export const numberLabel = (num) => {
	const NUMBER = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	return NUMBER.format(num);
};

export const timeLabel = (time, type = 'year') => {
	if (type === 'year') return dayjs(time).format('YYYY年MM月DD日');
	else if (type === 'month') return dayjs(time).format('YYYY年MM月');
	else if (type === 'day') return dayjs(time).format('YYYY.MM.DD');
};
