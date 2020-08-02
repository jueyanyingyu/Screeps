import { pathController, taskController } from "./init"
import { PathController } from "./util/PathController"
import { TaskController } from "./util/TaskController"

export { finish }

function finish(): void {
    Memory['PathControllerMem'] = PathController.unmarshal(pathController)
    Memory['TaskControllerMem'] = TaskController.unmarshal(taskController)
}