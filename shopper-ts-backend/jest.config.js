module.exports = {
    transform: {
        '^.+\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'node',
    testRegex: '(/tests/.*|(\.|/)(test|spec))\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};