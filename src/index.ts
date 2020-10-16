import Express from './app';
import './services/cronjob';

const { PORT } = process.env;

Express.listen(PORT, () => {
    console.log(`Redis service is running on port ${PORT} via Express`);
});