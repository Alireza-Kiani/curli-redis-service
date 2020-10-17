export interface RedisLinkData {
    link: string,
    date: Date
}

export interface LinkMonitor {
    ip: string | string[],
    useragent: any
    totalViews: number,
    individualCount: string[]
}