// server/src/services/codeExecution.js
const { VM } = require('vm2');

// Function to safely execute user code
const executeCode = async (code, language, testCases) => {
  const results = [];
  
  // Currently only supporting JavaScript execution in isolated VM
  if (language === 'javascript') {
    for (const testCase of testCases) {
      try {
        // Create new sandbox for each test
        const vm = new VM({
          timeout: 5000, // 5 seconds
          sandbox: {
            console: {
              log: () => {},
              error: () => {},
              warn: () => {}
            }
          }
        });
        
        // Prepare code with test case
        const testCode = `
          ${code}
          
          // Input: ${testCase.input}
          // Expected: ${testCase.expectedOutput}
          
          const result = JSON.stringify(runTest(${testCase.input}));
          result;
        `;
        
        // Execute code
        const output = vm.run(testCode);
        
        // Compare with expected output
        const expected = JSON.stringify(JSON.parse(testCase.expectedOutput));
        const passed = output === expected;
        
        results.push({
          input: testCase.input,
          expected: JSON.parse(testCase.expectedOutput),
          output: JSON.parse(output),
          passed,
          isHidden: testCase.isHidden
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: JSON.parse(testCase.expectedOutput),
          error: error.message,
          passed: false,
          isHidden: testCase.isHidden
        });
      }
    }
  } else {
    // For other languages, we'd need to implement dockerized execution
    // or use third-party services like Judge0
    throw new Error(`Execution for ${language} is not supported yet`);
  }
  
  return results;
};

module.exports = { executeCode };