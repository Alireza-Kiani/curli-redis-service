import Redis from '../services/redis';
import { RedisLinkData, LinkMonitor } from '../@types/redis';

class ApiService {
    
    async getValue(hkey: string, key: string): Promise<any> {
        return await Redis.hget(hkey, key);
    }
    
    async setValue(hkey: string, key: string, value: RedisLinkData | LinkMonitor | LinkMonitor[]): Promise<void> {
        await Redis.hset(hkey, key, value);
    }
}


export default (new ApiService());