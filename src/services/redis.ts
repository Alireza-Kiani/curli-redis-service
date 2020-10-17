import { RedisClient } from 'redis';
import { promisify } from 'util';
import { RedisLinkData, LinkMonitor } from '../@types/redis';

class AsyncRedis extends RedisClient {
    public readonly hgetAsync = promisify(this.hget).bind(this);
    public readonly hsetAsync = promisify(this.hset).bind(this);
    public readonly hgetallAsync = promisify(this.hgetall).bind(this);
    public readonly hdelAsync = (hkey: string, key: string): any => {
        return new Promise((resolve, reject) => {
            this.hdel(hkey, key, (err: any, success: any) => {
                if (err) {
                    reject(err);
                }
                resolve(success);
            });
        });
    }
}


class Redis {
    private _async_redis_connection: AsyncRedis;

    constructor() {
        const { REDIS_HOST, REDIS_PASSWORD } = process.env;
        this._async_redis_connection = new AsyncRedis({
            host: REDIS_HOST,
            password: REDIS_PASSWORD
        });

    }

    public async hget(hkey: string, key: string): Promise<RedisLinkData | LinkMonitor | LinkMonitor[]> {
        const savedValue = await this._async_redis_connection.hgetAsync(hkey, key);
        return JSON.parse(savedValue);
    }
    
    public async hset(hkey: string, key: string, input: RedisLinkData | LinkMonitor | LinkMonitor[]): Promise<void> {
        const value = JSON.stringify(input);
        await this._async_redis_connection.hsetAsync([hkey, key, value]);
    }

    public async hgetall(hkey: string): Promise<any> {
        return await this._async_redis_connection.hgetallAsync(hkey);
    }

    public async hdel(hkey: string, key: any): Promise<void> {
        await this._async_redis_connection.hdelAsync(hkey, key);
    }
}

export default (new Redis());