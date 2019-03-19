export declare class Bootstrap {
    static new(key: string, val: any, ...args: any[]): typeof Bootstrap;
    static add(key: string, val: any, ...args: any[]): typeof Bootstrap;
    static set(key: string, val: any, ...args: any[]): typeof Bootstrap;
    static get<T>(key: string): any;
    static del(key: string): boolean;
    static has(key: string): boolean;
    static readonly keys: IterableIterator<any>;
    static readonly count: number;
    static clear(): void;
}
export default Bootstrap;
