import Redis from '../services/redis';
import { RedisLinkData, LinkMonitor } from '../@types/redis';
import { BloomFilter } from '@albert-team/rebloom';

class ApiService {

    BloomFilter(): BloomFilter {
        return Redis._BloomFilter!;
    }
    
    async getValue(hkey: string, key: string): Promise<any> {
        return await Redis.hget(hkey, key);
    }
    
    async setValue(hkey: string, key: string, value: RedisLinkData | LinkMonitor | LinkMonitor[]): Promise<void> {
        await Redis.hset(hkey, key, value);
    }
}


export default (new ApiService());