export {LRU}

class LRUMeta {
    _next: LRUMeta
    _last: LRUMeta
    key:string
    data: string
}
class LRU {
    static marshal(obj: Object): LRU {
        let res = new LRU(obj['capacity'])
        res.size = obj['size']
        for (let i = res.size - 1; i >= 0; i--) {
            let meta = new LRUMeta()
            meta.key = obj['LRUmetaList'][i]['key']
            meta.data = obj['LRUmetaList'][i]['data']
            res._map.set(obj['LRUmetaList'][i]['key'],meta)
            res.addFirsrtInList(meta)
        }
        return res
    }
    static unmarshal(lru: LRU): Object {
        let sLRU = {
            capacity:lru.capacity,
            size:lru.size,
            LRUmetaList:[]
        }
        let node = lru._start._next
        while (node !== lru._end) {
            sLRU['LRUmetaList'].push({
                key:node.key,
                data:node.data
            })
            node = node._next
        }
        return sLRU
    }
    private _map: Map<string, LRUMeta>
    private _start: LRUMeta
    private _end: LRUMeta

    private capacity: number
    private size: number

    constructor(capacity: number) {
        this._map = new Map<string, LRUMeta>()
        this._start = new LRUMeta()
        this._end = new LRUMeta()
        this._start._next = this._end
        this._end._last = this._start
        this.capacity = capacity
        this.size = 0
    }

    getCapacity(): number {
        return this.capacity
    }
    getSize(): number {
        return this.size
    }

    get(key: string): string {
        if (!this._map.has(key)) return null
        let meta = this._map.get(key)
        this.removeFormList(meta)
        this.addFirsrtInList(meta)
        return meta.data
    }

    set(key: string, data: string): void {
        if (this._map.has(key)) {
            let meta = this._map.get(key)
            meta.data = data
        } else {
            let meta = new LRUMeta()
            meta.key = key
            meta.data = data
            this.addFirsrtInList(meta)
            this._map.set(key,meta)
            this.size++
            if (this.size > this.capacity) {
                this.removeFormList(this._end._last)
                this._map.delete(key)
                this.size--
            }
        }
    }

    removeFormList(meta: LRUMeta): void {
        let last = meta._last
        let next = meta._next
        last._next = next
        next._last = last
    }

    addFirsrtInList(meta: LRUMeta): void {
        this._start._next._last = meta
        meta._next = this._start._next
        this._start._next = meta
        meta._last = this._start
    }
}
