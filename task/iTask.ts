export {iTask}

interface iTask {
    taskType: string
    creep: Creep
    target: RoomObject | null
    targetPos: RoomPosition
    setting: Object
    data: Object
    nextTask: iTask | null

    isValid():boolean
    isDone():boolean
    run():void
    finish():iTask

    fork(newTask: iTask):iTask
    add(newTask: iTask):void
}                                                                 