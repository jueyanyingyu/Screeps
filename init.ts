import { PathController } from "./util/PathController"
import { TaskController } from "./util/TaskController"
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
    pathController = global['pathCache'] ? global['pathCache'] : new PathController()
    taskController = TaskController.marshal(Memory['TaskControllerMem'])
    
    
}
