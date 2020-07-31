import { init } from './init'
import { run } from './run'
import { finish } from './finish'

module.exports.loop = function (): void {
    init()
    run()
    finish()
}
