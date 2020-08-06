import { PathController } from "./util/PathController"
import { TaskController } from "./util/TaskController"
import { GotoTask } from "./task/creep_task/creep_move_task"
import { MQ } from "./module/MQ"
import { Colony } from "./colony/Colony"

export { init }
export { mq }
export { pathController }
export { taskController }
var mq: MQ
var pathController: PathController
var taskController: TaskController

function init(): void {
    mq = MQ.marshal(Memory['MQMem'])
    pathController = PathController.marshal(Memory['PathControllerMem'])
    taskController = TaskController.marshal(Memory['TaskControllerMem'])
    
    
}
