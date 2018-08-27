module.exports = {
	testMatch: [
		'**/*.(test|spec).js'
	],
	transform: {
    "^.+\\.ts?$": "ts-jest"
  },
	testEnvironment: 'node'
};
