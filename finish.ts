import { pathController, taskController, mq } from "./init"
import { PathController } from "./util/PathController"
import { TaskController } from "./util/TaskController"
import { MQ } from "./module/MQ"

export { finish }

function finish(): void {
    Memory['MQMem'] = MQ.unmarshal(mq)
    Memory['PathControllerMem'] = PathController.unmarshal(pathController)
    Memory['TaskControllerMem'] = TaskController.unmarshal(taskController)
}