import { MemQueue } from "./QUEUE";

class MQ {
    requestQueueMap: Map<string, MemQueue>
    responseQueueMap: Map<string, MemQueue>
    counter:number

    static marshal(obj: Object): MQ {
        let mq = new MQ()
        mq.requestQueueMap = new Map<string, MemQueue>()
        mq.responseQueueMap = new Map<string, MemQueue>()
        if (obj) {
            for (let s in obj['requests']) {
                let queue = MemQueue.marshal(obj['requests'][s]['requestQueue'])
                mq.requestQueueMap.set(obj['requests'][s]['consumerName'], queue)
            }
            for (let s in obj['responses']) {
                let queue = MemQueue.marshal(obj['responses'][s]['responseQueue'])
                mq.responseQueueMap.set(obj['responses'][s]['producerName'], queue)
            }
        }
        mq.counter = 0
        return mq
    }
    static unmarshal(mq: MQ): Object {
        let obj = {
            requests: [],
            responses: []
        }
        mq.requestQueueMap.forEach((requestQueue, consumerName) => {
            obj.requests.push({
                consumerName: consumerName,
                requestQueue: MemQueue.unmarshal(requestQueue)
            })
        });
        mq.responseQueueMap.forEach((responseQueue, producerName) => {
            obj.responses.push({
                producerName: producerName,
                responseQueue: MemQueue.unmarshal(responseQueue)
            })
        });
        return obj
    }

    constructor() {
        this.requestQueueMap = new Map<string, MemQueue>()
        this.responseQueueMap = new Map<string, MemQueue>()
        this.counter = 0
    }

    _getNewId():string {
        let id:string = Game.time + ':' + this.counter
        this.counter++
        return id
    }

    //返回id
    sendRequest(producerName: string, consumerName: string, body: string): string {
        let id = this._getNewId()
        let queue = this.requestQueueMap.get(consumerName)
        if (!queue) {
            let queue = new MemQueue()
            this.requestQueueMap.set(consumerName,queue)
        }
        queue.addLast(producerName + ';' + id + ';' + body)
        return id
    }
    //返回id
    sendRequestUrgently(producerName: string, consumerName: string, body: string): string {
        let id = this._getNewId()
        let queue = this.requestQueueMap.get(consumerName)
        if (!queue) {
            let queue = new MemQueue()
            this.requestQueueMap.set(consumerName,queue)
        }
        queue.addFirst(producerName + ';' + id + ';' + body)
        return id
    }
    //返回producerName:id;body,消费
    getRequest(consumerName: string): string {
        let queue = this.requestQueueMap.get(consumerName)
        if (!queue) return undefined
        return queue.removeFirst()
    }
    sendResponse(producerName: string, id: string, body: string) {
        let queue = this.responseQueueMap.get(producerName)
        if (!queue) {
            queue = new MemQueue()
            this.responseQueueMap.set(producerName,queue)
        }
        queue.addLast(id + ';' + body)
    }
    getResponses(producerName: string):Map<string,string> {
        let responsesMap = new Map<string,string>()
        let queue = this.responseQueueMap.get(producerName)
        if (!queue) return responsesMap
        while(queue.getSize() > 0) {
            let list = queue.removeFirst().split(';',1)
            responsesMap.set(list[0],list[1])
        }
        return responsesMap
    }
}