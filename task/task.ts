export { Task }

class Task {
    taskType: string
    creep: Creep | PowerCreep
    target: Creep | Deposit | Mineral | Nuke | PowerCreep | Resource | Ruin | Source | Structure | Tombstone
    targetPos: RoomPosition
    setting: Object
    data: Object

    _isInvalid: boolean
    _finished: boolean

    constructor(taskType: string, creep: Creep | PowerCreep, target: Creep | Deposit | Mineral | Nuke | PowerCreep | Resource | Ruin | Source | Structure | Tombstone, targetPos: RoomPosition, setting: Object, data: Object) {
        this.taskType = taskType
        this.creep = creep
        this.target = target
        this.targetPos = targetPos
        this.setting = setting
        this.data = data

        this._isInvalid = false
        this._finished = false
    }

    protected static marshal(stask: string): Task {
        let taskTotal = <string>JSON.parse(stask)
        let taskType = <string>taskTotal['taskType']
        let creep = <Creep | PowerCreep>Game.getObjectById(taskTotal['creep'])
        let target = <Creep | Deposit | Mineral | Nuke | PowerCreep | Resource | Ruin | Source | Structure | Tombstone>Game.getObjectById(taskTotal['target'])
        let posObj = JSON.parse(taskTotal['targetPos'])
        let targetPos = new RoomPosition(posObj['x'], posObj['y'], posObj['roomName'])
        let setting = JSON.parse(taskTotal['setting'])
        let data = JSON.parse(taskTotal['data'])
        return new Task(taskType, creep, target, targetPos, setting, data)
    }

    protected static unmarshal(task: Task): string {
        let taskTotal = {
            taskType: task.taskType,
            creep: task.creep.id,
            target:task.target.id,
            targetPos:JSON.stringify({
                x:task.targetPos.x,
                y:task.targetPos.y,
                roomName:task.targetPos.roomName
            }),
            setting:JSON.stringify(task.setting),
            data:JSON.stringify(task.data)
        }
        return JSON.stringify(taskTotal)
    }

    isValid(): boolean{
        return false
    }
    isDone(): boolean{
        return false
    }
    run(): void{
        return
    }
    finish(): void{
        return
    }

}