import { Task } from "../Task";
import { PathController } from "../../util/PathController";
import { pathController } from "../../init";
import { openStdin } from "process";


export class MoveTask extends Task {

    isValid(): boolean {
        if (!typeof this.creep) {
            return false
        }
        if (!this.target && !this.targetPos) {
            return false
        }
        return this.creep.getActiveBodyparts(MOVE) > 0

    }
    isDone(): boolean {
        let range: number = 0
        if (this.setting['range'] > 0) {
            range = this.setting['range']
        }
        let pos: RoomPosition
        if (this.target) {
            pos = this.target.pos
        } else {
            pos = this.targetPos
        }
        if (this.creep.pos.roomName === pos.roomName && this.creep.pos.inRangeTo(pos.x, pos.y, range)) {
            return true
        }
        return false
    }
    run(): void {
        if (!this.setting['origin']) {
            this.setting['orngin'] = this.creep.pos
        }
        let goal: RoomPosition
        if (this.target) {
            goal = this.target.pos
        } else {
            goal = this.targetPos
        }
        let getpathOpts = {
            range: this.setting['range'],
            ignoreCreeps: this.setting['ignoreCreeps'],
            ignoreRoads: this.setting['ignoreRoads'],
            flee: this.setting['flee']
        }
        let path = pathController.getPath(this.setting['origin'], goal, getpathOpts)
        let res = this.creep.moveByPath(path)
        if (res === ERR_NOT_FOUND) {
            this.setting['origin'] = this.creep.pos
            let newPath = pathController.getPath(this.setting['origin'], goal, getpathOpts)
            this.creep.moveByPath(newPath)
        }
    }
}