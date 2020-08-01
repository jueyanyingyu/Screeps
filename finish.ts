import { pathController } from "./init"
import { LRU } from "./module/LRU"

export { finish }

function finish(): void {
    Memory['PathControllerCache'] = LRU.unmarshal(pathController.cache)
}