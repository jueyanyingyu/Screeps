class MemQueueNode {
    _next: MemQueueNode
    _last: MemQueueNode
    data: string

}
class MemQueue {
    static marshal(obj: Object): MemQueue {
        let res = new MemQueue()
        res.size = obj['size']
        for (let i = res.size - 1; i >= 0; i--) {
            res.addFirst(obj['memQueueNodeList'][i])
        }
        return res
    }
    static unmarshal(memQueue: MemQueue): Object {
        let SMemQueue = {
            size:memQueue.size,
            memQueueNodeList:[]
        }
        let memQueueNode = memQueue._start._next
        while (memQueueNode !== memQueue._end) {
            SMemQueue.memQueueNodeList.push(memQueueNode.data)
            memQueueNode = memQueueNode._next
        }
        return SMemQueue
    }

    private _start: MemQueueNode
    private _end: MemQueueNode

    private size: number

    constructor() {
        this._start = new MemQueueNode()
        this._end = new MemQueueNode()
        this._start._next = this._end
        this._end._last = this._start
        this.size = 0
    }

    getSize(): number {
        return this.size
    }

    get(index: number): string {
        return this.getMemQueueNode(index).data
    }
    insert(index: number, data: string): void {
        if (this.size === 0) {
            let newNode = new MemQueueNode()
            newNode.data = data
            this._start._next = newNode
            newNode._last = this._start
            this._end._last = newNode
            newNode._next = this._end
            this.size++
        } else {
            let p = this.getMemQueueNode(index)
            if (!p) return
            let newNode = new MemQueueNode()
            newNode.data = data
            p._last._next = newNode
            newNode._last = p._last
            p._last = newNode
            newNode._next = p
            this.size++
        }
    }
    remove(index: number): string {
        let p = this.getMemQueueNode(index)
        if (!p) return
        p._last._next = p._next
        p._next._last = p._last
        this.size--
        return p.data
    }
    addFirst(data: string): void {
        this.insert(0, data)
    }
    addLast(data: string): void {
        this.insert(this.size - 1, data)
    }
    getFirst(): string {
        return this.get(0)
    }
    getLast(): string {
        return this.get(this.size - 1)
    }
    removeFirst(): string {
        return this.remove(0)
    }
    removeLast(): string {
        return this.remove(this.size - 1)
    }
    private getMemQueueNode(index: number): MemQueueNode {
        if (index < 0 || index + 1 > this.size) return null
        if (index < this.size / 2) {
            let p = this._start._next
            let i = 0
            while (i < index) {
                p = p._next
                i++
            }
            return p
        } else {
            let p = this._end._last
            let i = this.size - 1
            while (i > index) {
                p = p._last
                i--
            }
            return p
        }
    }
}