import axios from 'axios';


export const getExternalExchangeRate = async () => {
    try {
       const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
            timeout: 5000 // Prevents the application from hanging
        });
        return res.data;
    } catch (error : any) {
        console.error('External API Integration Error:', error.message);
        throw new Error('External service currently unavailable');
    }
};

