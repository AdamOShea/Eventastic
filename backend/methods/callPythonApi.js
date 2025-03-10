const { spawn } = require('child_process');

/**
 * Executes a Python file and returns JSON results.
 * @param {string} scriptPath - The path to the Python script.
 * @param {Array} args - Optional arguments to pass to the script.
 * @returns {Promise<Object>} - Parsed JSON response from Python.
 */
const callPythonApi = (scriptPath, args = []) => {
  return new Promise((resolve, reject) => {
    const process = spawn('python3', [scriptPath, ...args]);

    let output = '';
    let error = '';

    // Capture stdout (Python script output)
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Capture stderr (Python script errors)
    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process exit
    process.on('close', (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}: ${error}`);
      } else {
        try {
          console.log(`✅ Raw Python Output from ${scriptPath}:`, output.trim()); 
          const jsonResponse = JSON.parse(output.trim());
          resolve(jsonResponse);
        } catch (parseError) {
          reject(`Error parsing JSON: ${parseError.message}\nPython Output: ${output}`);
        }
      }
    });
  });
};

module.exports = { callPythonApi };
