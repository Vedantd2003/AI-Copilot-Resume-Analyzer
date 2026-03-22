console.log('Starting test server...');

const express = require('express');
const app = express();
const PORT = 5000;

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Test server is running' });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log('✅ Try visiting: http://localhost:5000/health');
});
