import { iTask } from "./iTask";

export {Task}

class Task implements iTask{
    taskType: string;
    creep: Creep;
    target: RoomObject;
    targetPos: RoomPosition;
    setting: Object;
    data: Object;
    nextTask: iTask;

    

    constructor(taskType: string, creep: Creep, target: RoomObject, targetPos: RoomPosition, setting: Object, data: Object, nextTask: iTask) {
        this.taskType = taskType
        this.creep = creep
        this.target = target
        this.targetPos = targetPos
        this.setting = setting
        this.data = data
        this.nextTask = nextTask
    }

    isValid(): boolean {
        return false
    }
    isDone(): boolean {
        return false
    }
    run(): void {
        
    }
    finish(): iTask {
        return this.nextTask
    }
    fork(newTask: iTask): iTask {
        this.nextTask = this
        return newTask
    }
    add(newTask: iTask): void {
        let pTask:iTask = this
        while (pTask.nextTask) {
            pTask = pTask.nextTask
        }
        pTask.nextTask = newTask
    }

}