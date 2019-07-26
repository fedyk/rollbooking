module.exports = {
	roots: [
		"<rootDir>/dist"
	],
	"testMatch": [
		"**/*.(test|spec).(js|ts)"
	],
	"transform": {
		"^.+\\.ts?$": "ts-jest"
	},
	"testEnvironment": "node",
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	]
};
