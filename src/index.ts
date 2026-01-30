import express from 'express';
import initDatabase from './configs/initDB';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);

initDatabase().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Swagger documentation: http://localhost:${PORT}/api-docs`);
    });
});