import { Task } from "../task";

class MoveSetting {
    range: number
    ignoreCreep: boolean
}

class MoveData {
    path: RoomPosition[]
}

export class MoveTask extends Task {
    moveSetting: MoveSetting = <MoveSetting>this.setting
    moveData: MoveData = <MoveData>this.data

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
        if (this.setting && this.moveSetting.range > 0) {
            range = this.moveSetting.range
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
        let res: number
        if (this.moveData.path && this.moveData.path.length > 0) {
            res = this.creep.moveByPath(this.moveData.path)
        }
        if (res === undefined || res === ERR_NOT_FOUND || res === ERR_INVALID_ARGS) {
            let pos: RoomPosition
            if (this.target) {
                pos = this.target.pos
            } else {
                pos = this.targetPos
            }
            let pathFinderOpts: PathFinderOpts = {
                //待补充
            }
            let path: RoomPosition[] = PathFinder.search(this.creep.pos, { pos: pos, range: this.moveSetting.range }, pathFinderOpts).path
            this.moveData.path = path
            this.creep.moveByPath(this.moveData.path)
        }
    }
}