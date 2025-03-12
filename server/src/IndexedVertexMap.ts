export interface IVMap<T> {
    push(key: string, value: T): string;

    get(key: string): T[];

    clearAll(): void;

    clearKey(key: string): void;

    remove(key: string, index: string): void;

    forEach(key: string, iterator: (value: T, index: string) => void): void;
    forEachKeys(iterator: (values:T[], key: string) => void): void;

    has(key: string): boolean;

    size(key: string): number
    sizeKeys(): number

    filter(key: string, f: (a: T) => boolean): void
}


interface IndexedVertexMap<K, T> {
    map: Map<K, T[]>;
    // indexes: Map<K, number>;
}

const proto: ThisType<IndexedVertexMap<string, any>> = {
    push(key: string, value: any): string {
        if (!this.map.has(key)) {
            this.map.set(key, []);
        }
        this.map.get(key).push(value)
    },

    get(key: string): any[] {
        return Array.from(this.map.get(key)?.values() || []);
    },

    clearAll() {
        this.map.clear();
    },

    clearKey(key: string) {
        this.map.delete(key);
    },

    remove(key: string) {
        this.map.delete(key)
    },

    forEachKeys(iterator: (values:any[], key: string) => void) {
      this.map.forEach(iterator)
    },
    forEach(key: string, iterator: (value: any, index: number) => void) {
        this.map.get(key)?.forEach(iterator);
    },

    has(key: string): boolean {
        return this.map.has(key);
    },

    sizeKeys(): number{
        return this.map.size
    },
    size(key: string): number {
        return this.map.get(key)?.length || 0;
    },
    filter(key: string, f: (a: any) => boolean): void {
        if (this.map.has(key)) {
            //@ts-ignore
            this.map.set(key, this.map.get(key).filter(f))
        }
    }
};


export default function IndexedVertexMap<T>(): IVMap<T> {
    const o = Object.create(proto)
    o.map = new Map()
    // o.indexes = new Map()
    // if (constructor) {
    //   o.constructor = constructor ||
    // }
    return o
}
