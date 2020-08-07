import { Task } from "../Task";
import { pathController } from "../../init";


export class GotoTask extends Task {

    
    constructor( creep: Creep | PowerCreep, target: Creep | Deposit | Mineral | Nuke | PowerCreep | Resource | Ruin | Source | Structure | Tombstone, targetPos: RoomPosition, setting: Object, data: Object) {
        super('goto', creep, target, targetPos, setting, data);
        this.setting['range'] = 0
        this.setting['ignoreCreeps'] = true
    }

    static marshal(stask: string): GotoTask {
        return <GotoTask>Task.marshal(stask)
    }

    static unmarshal(gotoTask:GotoTask):string {
        return Task.unmarshal(<Task>gotoTask)
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