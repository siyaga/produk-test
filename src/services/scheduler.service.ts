import cron from 'node-cron';
import { pool } from '../configs/db';

export const SystemScheduler = ()=> {
  cron.schedule('0 0 * * *', async () => {
    try {
      const query = `
          UPDATE orders
          SET delete_at = NOW()
          WHERE created_at < NOW() - INTERVAL '7 days';
          AND deleted_at IS NULL;
      `;
      await pool.query(query);
      console.log('[Scheduler] Cleanup completed successfully.');
    }catch (error) {
            console.error('[Scheduler] Task failed:', error);
   }
   });
}