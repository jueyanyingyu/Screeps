import { PathController } from "./util/PathController"
import { TaskController } from "./util/TaskController"
export { init }

export { pathController }
export { taskController }
var pathController: PathController
var taskController: TaskController

function init(): void {
    pathController = PathController.marshal(Memory['PathControllerMem'])
    taskController = TaskController.marshal(Memory['TaskControllerMem'])
}
