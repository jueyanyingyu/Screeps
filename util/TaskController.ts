import { Task } from "../task/Task";
import { GotoTask } from "../task/creep_task/creep_move_task";

export {TaskController}

class TaskController {
    queueMap: Map<string, MemQueue>
    taskMap: Map<string, Task>

    static marshal(obj: Object): TaskController {
        let taskController = new TaskController()
        taskController.queueMap = new Map<string,MemQueue>()
        for (let s in obj['tasks']) {
            let queue = MemQueue.marshal(obj['tasks'][s]['taskList'])
            taskController.queueMap.set(obj['tasks'][s]['creepId'],queue)
        }
        return taskController
    }
    static unmarshal(taskController:TaskController): Object {
        let obj = {
            tasks:[]
        }
        for (let k in taskController.queueMap) {
            obj.tasks.push({
                creepId:k,
                taskList:MemQueue.unmarshal(taskController.queueMap.get(k))
            })
        }
        return obj
    }

    private static parseTask(stask: string): Task {
        switch (stask.split(';',1)[0]) {
            case 'goto': return GotoTask.marshal(stask)
        }
        return null
    }

    private static stringifyTask(task: Task): string {
        switch (task.taskType) {
            case 'goto': return GotoTask.unmarshal(task)
        }
        return undefined
    }

    getTask(creepId: string): Task {
        let task = TaskController.parseTask(this.queueMap.get(creepId).removeFirst())
        this.taskMap.set(creepId,task)
        return task
    }

    addTask(creepId:string,task: Task): void {
        let stask = TaskController.stringifyTask(task)
        this.queueMap.get(creepId).addLast(stask)
    }

    forkTask(creepId:string,task: Task): void {
        let nowTask = this.taskMap.get(creepId)
        if (nowTask) {
            this.queueMap.get(creepId).addFirst(TaskController.stringifyTask(nowTask))
        }
        this.taskMap.set(creepId,task)
    }
}