module.exports = {
	roots: [
		"<rootDir>/src"
	],
	"testMatch": [
		'**/*.(test|spec).(js|ts)'
	],
	"transform": {
    "^.+\\.ts?$": "ts-jest"
  },
	"testEnvironment": 'node',
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],
};
