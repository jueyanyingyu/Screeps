import { PathController } from "./util/PathController"
import { TaskController } from "./util/TaskController"
import { MQ } from "./module/MQ"
import { Shard } from "./shard/Shard"

export { init }
export { mq }
export { pathController }
export { taskController }
export { shard }
var mq: MQ
var pathController: PathController
var taskController: TaskController

var shard: Shard

function init(): void {
    mq = MQ.marshal(Memory['MQMem'])
    pathController = global['pathCache'] ? global['pathCache'] : new PathController()
    taskController = TaskController.marshal(Memory['taskControllerMem'])

    shard = Shard.marshal(Memory['shardMem'])
}
