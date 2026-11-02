import 'dotenv/config';
import { app } from './app.js';
import { initializeDatabase } from './config/database.js';
const port = Number(process.env.PORT || 4000);
await initializeDatabase();
app.listen(port, () => console.log(`Abhiraj Internship API running at http://localhost:${port}`));
