import { Task } from "../task/Task";

class TaskController {
    taskMap: Map<string, Task>

    static marshal(obj: Object): Map<string, Task> {
        let res = new Map<string, Task>()
        for (let id in obj) {

        }
    }
    static unmarshal(taskMap: Map<string, Task>): Object {

    }

    static parseTask(taskInfo: string): Task {
        
    }

    static stringifyTask(task: Task): string {

    }

    getTask(creepId: string): Task {
        return this.taskMap.get(creepId)
    }
}