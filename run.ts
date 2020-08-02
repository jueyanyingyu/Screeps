import { taskController } from "./init"

export { run }

function run(): void {
    for (let name in Game.creeps) {
        let task = taskController.getTask(Game.creeps[name].id)
        if (!task) {
            continue
        }
        if (task.isValid()) {
            task.run()
        }//todo done延迟
        if (task.isDone()) {
            task.finish()
        }
    }
}