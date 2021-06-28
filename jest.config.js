module.exports = {
	roots: [
		"./test"
	],
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
		'^.+\\.ts?$': 'ts-jest',
	},
	moduleNameMapper: {
		"wgxh-framework$": "@wgxh-framework/core/dist/index.cjs.js",
	},
	testRegex: "test/(.+)\\.test\\.(jsx?|tsx?)$",
	testEnvironment: 'jsdom',
	extensionsToTreatAsEsm: [".ts"],
	moduleFileExtensions: ["ts", "js"],
};
