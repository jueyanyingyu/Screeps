export { LRUCache }

class MapNode {
    _next: MapNode
    _last: MapNode
    key: string
    data: string
}
class LRUCache {
    static marshal(obj: Object): LRUCache {
        let res = new LRUCache(obj['capacity'])
        res.size = obj['size']
        for (let i = res.size - 1; i >= 0; i--) {
            let meta = new MapNode()
            meta.key = obj['mapNodeList'][i]['key']
            meta.data = obj['mapNodeList'][i]['data']
            res._map.set(obj['mapNodeList'][i]['key'], meta)
            res.addFirsrtInList(meta)
        }
        return res
    }
    static unmarshal(LRUCache: LRUCache): Object {
        let sLRUCache = {
            capacity: LRUCache.capacity,
            size: LRUCache.size,
            MapNodeList: []
        }
        let MapNode = LRUCache._start._next
        while (MapNode !== LRUCache._end) {
            sLRUCache['mapNodeList'].push({
                key: MapNode.key,
                data: MapNode.data
            })
            MapNode = MapNode._next
        }
        return sLRUCache
    }
    private _map: Map<string, MapNode>
    private _start: MapNode
    private _end: MapNode

    private capacity: number
    private size: number

    constructor(capacity: number) {
        this._map = new Map<string, MapNode>()
        this._start = new MapNode()
        this._end = new MapNode()
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
            let meta = new MapNode()
            meta.key = key
            meta.data = data
            this.addFirsrtInList(meta)
            this._map.set(key, meta)
            this.size++
            if (this.size > this.capacity) {
                this.removeFormList(this._end._last)
                this._map.delete(key)
                this.size--
            }
        }
    }

    private removeFormList(meta: MapNode): void {
        let last = meta._last
        let next = meta._next
        last._next = next
        next._last = last
    }

    private addFirsrtInList(meta: MapNode): void {
        this._start._next._last = meta
        meta._next = this._start._next
        this._start._next = meta
        meta._last = this._start
    }
}
