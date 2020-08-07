import { taskController } from "../init"
Creep.prototype.idle = function():boolean {
    if (!taskController.getTask(this.id))
        return true
    return false
}
Creep.prototype.run = function():void {
    if (!this.idle()) {
        taskController.getTask(this.id).run()
    }
}