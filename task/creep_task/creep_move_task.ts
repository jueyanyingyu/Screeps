import { Task } from "../Task";
import { pathController } from "../../init";


export class GotoTask extends Task {

    static marshal(stask: string): GotoTask {
        let list = stask.split(';')
        let taskType = list[0]
        let creep = Game.getObjectById(list[1])
        let target = Game.getObjectById(list[2])
        let xyRoomName = list[3].split(':')
        let targetPos = new RoomPosition(Number(xyRoomName[0]), Number(xyRoomName[1]), xyRoomName[2])
        let setting = JSON.parse(list[4])
        let data = JSON.parse(list[5])
        return new GotoTask(taskType, <Creep>creep,
            <Creep | Deposit | Mineral | Nuke | PowerCreep | Resource | Ruin | Source | Structure | Tombstone>target,
            targetPos, setting, data)
    }

    static unmarshal(task: GotoTask): string {
        let res = task.taskType + ';'
        res = res + task.creep.id + ';'
        if (task.target) {
            res = res + task.target.id + ';'
        } else {
            res = res + ';'
        }
        if (task.targetPos) {
            res = res + task.targetPos.x + ':' + task.targetPos.y + ':' + task.targetPos.roomName + ';'
        } else {
            res = res + ';'
        }
        res = res + JSON.stringify(task.setting) + ';'
        res = res + JSON.stringify(task.data)
        return res
    }
    constructor(taskType: string, creep: Creep | PowerCreep, target: Creep | Deposit | Mineral | Nuke | PowerCreep | Resource | Ruin | Source | Structure | Tombstone, targetPos: RoomPosition, setting: Object, data: Object) {
        super(taskType, creep, target, targetPos, setting, data);
        this.setting['range'] = 0
    }

    isValid(): boolean {
        if (!this.creep || !this.creep.my) {
            this._isInvalid = true
            return false
        }
        if (!this.target && !this.targetPos) {
            this._isInvalid = true
            return false
        }
        return true
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
            this.setting['origin'] = this.creep.pos
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

    finish(): void {
        this._finished = true
    }
}