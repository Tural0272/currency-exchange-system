// Helper script to start Expo web and show the correct URL
const { exec } = require('child_process');

console.log('Starting Expo web server...');
console.log('After bundling completes, the web app will be available.');
console.log('If it doesn\'t open automatically, check the terminal for the URL.');
console.log('Typically: http://localhost:8081 or http://localhost:19006\n');

const process = exec('npx expo start --web', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
});

process.stdout.on('data', (data) => {
  console.log(data.toString());
});

process.stderr.on('data', (data) => {
  console.error(data.toString());
});
