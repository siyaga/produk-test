import express from 'express';
import initDatabase from './configs/initDB';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

initDatabase().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`-----------------------------------------------`);
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📑 Swagger: http://localhost:${PORT}/api-docs`);
        console.log(`-----------------------------------------------`);
    });
}).catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1); // Exit process if database fails
});