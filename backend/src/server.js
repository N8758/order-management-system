const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // 🔥 important

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
