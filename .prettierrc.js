module.exports = {
	singleQuote: true,
	semi: false,
	overrides: [
		{
			files: '*.wxml',
			options: { parser: 'html' },
		},
	],
}
