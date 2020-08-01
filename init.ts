import { PathController } from "./util/PathController"
import { LRU } from "./module/LRU"

export { init }

export { pathController }
var pathController: PathController

function init(): void {
    pathController = new PathController()
    if (Memory['PathControllerCache']) {
        pathController.cache = LRU.marshal(Memory['PathControllerCache'])
    } else {
        pathController.cache = new LRU(1)
    }
}
