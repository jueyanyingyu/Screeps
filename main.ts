import { init } from './init'
import { run } from './run'
import { finish } from './finish'
import { MoveTask } from './task/creep_task/creep_move_task'


module.exports.loop = function (): void {
    init()
    run()
    let creep:Creep = Game.getObjectById('1694c80cac36a82c0874247c')
    let task:MoveTask = new MoveTask('moveTask',creep,null,new RoomPosition(40,40,'sim'),{range:0,origin:new RoomPosition(5,5,'sim')},{},null)
    task.run()
    finish()
}
