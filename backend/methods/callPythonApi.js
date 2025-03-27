const { spawn } = require('child_process');

const callPythonApi = (scriptPath, args = []) => {
  return new Promise((resolve, reject) => {
    const process = spawn('python', [scriptPath, ...args]);

    let output = '';
    let errorOutput = '';

    // Capture stdout (Python script output)
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Capture stderr (Python script errors)
    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
      //console.error(`🐍 Python stderr (${scriptPath}):`, data.toString()); 
    });

    // Handle process exit
    process.on('close', (code) => {
      //console.log(` Raw Python Output from ${scriptPath}:`, output.trim()); // 🔍 Debug Output

      if (errorOutput.trim()) {
        //console.warn(`⚠️ Python stderr output (${scriptPath}):\n${errorOutput.trim()}`); 
      }

      if (!output.trim()) {
        console.error(`❌ Python script returned empty response: ${scriptPath}`);
        reject(new Error("No data returned from Python script"));
        return;
      }

      try {
        const jsonResponse = JSON.parse(output.trim());  //  Ensure valid JSON
        resolve(jsonResponse);
      } catch (parseError) {
        console.error(`❌ JSON Parse Error from ${scriptPath}:`, parseError);
        reject(new Error("Failed to parse JSON output from Python"));
      }
    });
  });
};

module.exports = { callPythonApi };
