import { Task } from "../task/Task";
import { GotoTask } from "../task/creep_task/creep_move_task";
import { MemQueue } from "../module/QUEUE";

export { TaskController }

class TaskController {
    queueMap: Map<string, MemQueue>
    taskMap: Map<string, Task>

    static marshal(obj: Object): TaskController {
        let taskController = new TaskController()
        taskController.queueMap = new Map<string, MemQueue>()
        taskController.taskMap = new Map<string, Task>()
        if (obj) {
            for (let s in obj['tasks']) {
                let queue = MemQueue.marshal(obj['tasks'][s]['taskList'])
                taskController.queueMap.set(obj['tasks'][s]['creepId'], queue)
            }
        }
        return taskController
    }
    static unmarshal(taskController: TaskController): Object {
        taskController.taskMap.forEach((task, id) => {
            if (task._isInvalid) {
                //log
            } else if (task._finished) {

            } else {
                let queue = taskController.queueMap.get(id)
                if (!queue) {
                    queue = new MemQueue()
                    taskController.queueMap.set(id, queue)
                }
                queue.addFirst(this.stringifyTask(task))
            }
        });
        let obj = {
            tasks: []
        }
        taskController.queueMap.forEach((queue, id) => {
            if (queue.getSize() != 0) {
                obj.tasks.push({
                    creepId: id,
                    taskList: MemQueue.unmarshal(queue)
                })
            }
        })
        return obj
    }

    private static parseTask(stask: string): Task {
        switch (stask.split(';', 1)[0]) {
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
        if (this.taskMap.has(creepId)) {
            return this.taskMap.get(creepId)
        }
        let queue = this.queueMap.get(creepId)
        if (!queue || queue.getSize() === 0) {
            return null
        }
        let task = TaskController.parseTask(queue.removeFirst())
        this.taskMap.set(creepId, task)
        return task
    }

    addTask(creepId: string, task: Task): void {
        let stask = TaskController.stringifyTask(task)
        let queue = this.queueMap.get(creepId)
        if (!queue) {
            queue = new MemQueue()
            this.queueMap.set(creepId, queue)
        }
        queue.addLast(stask)
    }

    forkTask(creepId: string, task: Task): void {
        let nowTask = this.taskMap.get(creepId)
        if (nowTask) {
            let queue = this.queueMap.get(creepId)
            if (!queue) {
                queue = new MemQueue()
                this.queueMap.set(creepId, queue)
            }
            queue.addFirst(TaskController.stringifyTask(nowTask))
        }
        this.taskMap.set(creepId, task)
    }
}