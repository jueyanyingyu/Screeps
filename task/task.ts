export { Task }

abstract class Task {
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

    abstract isValid(): boolean
    abstract isDone(): boolean
    abstract run(): void
    abstract finish(): void

}