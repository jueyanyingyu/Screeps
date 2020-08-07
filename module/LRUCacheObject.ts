export { LRUCacheObject }

class MapNodeObject {
    _next: MapNodeObject
    _last: MapNodeObject
    key: string
    data: Object
}
class LRUCacheObject {
    private _map: Map<string, MapNodeObject>
    private _start: MapNodeObject
    private _end: MapNodeObject

    private capacity: number
    private size: number

    constructor(capacity: number) {
        this._map = new Map<string, MapNodeObject>()
        this._start = new MapNodeObject()
        this._end = new MapNodeObject()
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

    get(key: string): Object {
        if (!this._map.has(key)) return null
        let meta = this._map.get(key)
        this.removeFormList(meta)
        this.addFirsrtInList(meta)
        return meta.data
    }

    set(key: string, data: Object): void {
        if (this._map.has(key)) {
            let meta = this._map.get(key)
            meta.data = data 
            this.removeFormList(meta)
            this.addFirsrtInList(meta)
        } else {
            let meta = new MapNodeObject()
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

    private removeFormList(meta: MapNodeObject): void {
        let last = meta._last
        let next = meta._next
        last._next = next
        next._last = last
    }

    private addFirsrtInList(meta: MapNodeObject): void {
        this._start._next._last = meta
        meta._next = this._start._next
        this._start._next = meta
        meta._last = this._start
    }
}
