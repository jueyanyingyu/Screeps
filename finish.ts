import { pathController, taskController, mq, shard } from "./init"
import { TaskController } from "./util/TaskController"
import { MQ } from "./module/MQ"
import { Shard } from "./shard/Shard"

export { finish }

function finish(): void {
    Memory['MQMem'] = MQ.unmarshal(mq)
    global['pathCache'] = pathController
    Memory['taskControllerMem'] = TaskController.unmarshal(taskController)

    Memory['shardMem'] = Shard.unmarshal(shard)
}