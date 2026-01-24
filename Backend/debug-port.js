const fs = require('fs');
const path = require('path');

console.log('=== Debugging PORT variable ===');

// Read server.js file
const serverPath = path.join(__dirname, 'server.js');
const content = fs.readFileSync(serverPath, 'utf8');

// Find PORT variable declaration
const portDeclarationMatch = content.match(/const PORT.*=.*;/);
if (portDeclarationMatch) {
    console.log('PORT declaration found:', portDeclarationMatch[0]);

    // Extract the value part
    const valuePart = portDeclarationMatch[0].split('=')[1].trim().replace(';', '');
    console.log('Value part:', valuePart);

    // Try to evaluate it
    try {
        const PORT = eval(valuePart);
        console.log('Evaluated PORT:', PORT);
    } catch (error) {
        console.log('Error evaluating PORT:', error.message);
    }
}

// Find app.listen calls
const listenMatches = [...content.matchAll(/app\.listen\((.*?)\)/g)];
if (listenMatches.length > 0) {
    console.log('app.listen calls found:', listenMatches.length);
    listenMatches.forEach((match, index) => {
        console.log(`Call ${index + 1}:`, match[1]);
    });
}

// Check if PORT is used in listen
const listenWithPort = content.match(/app\.listen\(PORT/);
if (listenWithPort) {
    console.log('app.listen is using PORT variable');
} else {
    console.log('app.listen is NOT using PORT variable');
}

console.log('=== Checking process.env ===');
console.log('PORT from process.env:', process.env.PORT);
console.log('=== Debug complete ===');
