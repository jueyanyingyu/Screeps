import { PathController } from "./util/PathController"
import { TaskController } from "./util/TaskController"
import { GotoTask } from "./task/creep_task/creep_move_task"
export { init }

export { pathController }
export { taskController }
var pathController: PathController
var taskController: TaskController

function init(): void {
    pathController = PathController.marshal(Memory['PathControllerMem'])
    taskController = TaskController.marshal(Memory['TaskControllerMem'])
    console.log(Game.time)
    if (Game.time == 230) {
        console.log('a run')
        let a = function():string {
            taskController.forkTask('d7a8cea8e79b2c1f316ed1eb',new GotoTask('goto',Game.getObjectById('d7a8cea8e79b2c1f316ed1eb'),null,new RoomPosition(47,46,'sim'),{origin:new RoomPosition(24,25,'sim')},null))
            return 'd7a8cea8e79b2c1f316ed1eb'
        }
        a()
    }
}
