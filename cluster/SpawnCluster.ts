import { mq, pathController, taskController } from "../init"
import { Colony } from "../colony/Colony"
import { Cluster } from "./Cluster"
import { ConstructorCluster } from "./ConstructorCluster"
import { GotoTask } from "../task/creep_task/creep_move_task"

export class SpawnCluster extends Cluster {
    spawn1: StructureSpawn
    spawnRequestId1: string
    spawn2: StructureSpawn
    spawnRequestId2: string
    spawn3: StructureSpawn
    spawnRequestId3: string

    filler1: Creep
    fillerRequestId1: string
    filler2: Creep
    fillerRequestId2: string

    fillerPosPath1: RoomPosition[]
    fillerPosPath2: RoomPosition[]

    static fillingPath1 = [4, 3, 2, 2, 1, 8, 8, 7, 6, 6, 8, 8, 7, 6, 6, 5, 4, 4, 3, 2, 3]
    static fillingPath2 = [6, 7, 8, 8, 1, 2, 2, 3, 4, 4, 2, 2, 3, 4, 5, 5, 6, 6, 7, 8, 7]

    static creepTypes = {
        filler: {
            metaBody: [CARRY, CARRY, MOVE],
            ll: 1,
            ul: 16
        }
    }

    static marshal(colony: Colony, obj: Object): SpawnCluster {
        let spawnCluster = new SpawnCluster()
        spawnCluster.colony = colony

        spawnCluster.name = obj['name']

        spawnCluster.spawn1 = Game.getObjectById(obj['spawn1'])
        spawnCluster.spawnRequestId1 = obj['spawnRequestId1']
        spawnCluster.spawn2 = Game.getObjectById(obj['spawn2'])
        spawnCluster.spawnRequestId2 = obj['spawnRequestId2']
        spawnCluster.spawn3 = Game.getObjectById(obj['spawn3'])
        spawnCluster.spawnRequestId3 = obj['spawnRequestId3']
        spawnCluster.filler1 = Game.getObjectById(obj['filler1'])
        spawnCluster.fillerRequestId1 = obj['fillerRequestId1']
        spawnCluster.filler2 = Game.getObjectById(obj['filler2'])
        spawnCluster.fillerRequestId2 = obj['fillerRequestId2']
        spawnCluster.fillerPosPath1 = SpawnCluster.getPath(colony.anchor, SpawnCluster.fillingPath1)
        spawnCluster.fillerPosPath2 = SpawnCluster.getPath(colony.anchor, SpawnCluster.fillingPath2)
        return spawnCluster
    }

    static unmarshal(spawnCluster: SpawnCluster): Object {
        return {
            name: spawnCluster.name,

            spawn1: spawnCluster.spawn1.id,
            spawnRequestId1: spawnCluster.spawnRequestId1,
            spawn2: spawnCluster.spawn2.id,
            spawnRequestId2: spawnCluster.spawnRequestId2,
            spawn3: spawnCluster.spawn3.id,
            spawnRequestId3: spawnCluster.spawnRequestId3,
            filler1: spawnCluster.filler1.id,
            fillerRequestId1: spawnCluster.fillerRequestId1,
            filler2: spawnCluster.filler2.id,
            fillerRequestId2: spawnCluster.fillerRequestId2
        }
    }
    static getPath(anchor: RoomPosition, fillerPath: number[]): RoomPosition[] {
        return pathController.getPathByDirectionList(anchor, fillerPath)
    }
    //返回序列化的请求
    static spawnCreep(creepType: string): string {
        return creepType
    }
    //返回结果
    static spawnCreepResult(id: string): Creep {
        return Game.creeps[mq.getResponses(id)]
    }

    run(): void {
        if (this.filler1) this._fillerRun(this.filler1, new RoomPosition(this.colony.anchor.x + 1, this.colony.anchor.y + 1, this.colony.anchor.roomName), SpawnCluster.fillingPath1)
        else this._getFillerById(1, this.fillerRequestId1)
        if (this.filler2) this._fillerRun(this.filler2, new RoomPosition(this.colony.anchor.x - 1, this.colony.anchor.y + 1, this.colony.anchor.roomName), SpawnCluster.fillingPath2)
        else this._getFillerById(2, this.fillerRequestId2)

        if (this.spawn3) this._spawnRun(this.spawn3)
        else this._getSpawnById(3, this.spawnRequestId3)
        if (this.spawn2) this._spawnRun(this.spawn2)
        else this._getSpawnById(2, this.spawnRequestId2)
        if (this.spawn1) this._spawnRun(this.spawn1)
        else this._getSpawnById(1, this.spawnRequestId1)
    }
    _fillerRun(filler: Creep, stablePos: RoomPosition, fillerpath: number[]) {
        if (filler.room.energyAvailable < filler.room.energyCapacityAvailable) {
            let structureList: Structure[] = filler.pos.getEnergyStructureNearBy()
            let toTransfer = null
        } else if (filler.pos.isEqualTo(stablePos)) {
            if (filler.idle()) {
                let task = new GotoTask(filler,null,stablePos,null,null)
                taskController.forkTask(filler.id,task)
            }
            filler.run()
        } else if (filler.ticksToLive < 1450) {
            if (this.spawn1) this.spawn1.renewCreep(filler)
        }
    }
    _spawnRun(spawn: StructureSpawn) {
        if (!spawn.spawning) {
            let request = JSON.parse(mq.getRequest(this.name))
            let creepType = request['body']
            let id = request['id']
            let body = []
            for (let i = SpawnCluster.creepTypes[creepType]['ll']; i <= SpawnCluster.creepTypes[creepType]['ul']; i++) {
                body.concat(SpawnCluster.creepTypes[creepType]['metaBody'])
            }
            let creepName = creepType + ':' + spawn.name + ':' + Game.time
            let result = spawn.spawnCreep(body, creepName)
            if (result === OK) mq.sendResponse(id, creepName)
            else mq.sendResponse(id, result.toString())
        }
    }
    _getFillerById(n: number, id: string): Creep {
        if (!id) {
            let newId = mq.sendRequestUrgently(this.name, this.name, SpawnCluster.spawnCreep('filler'))
            switch (n) {
                case 1: this.fillerRequestId1 = newId
                case 2: this.fillerRequestId2 = newId
            }
            return null
        }
        switch (n) {
            case 1: this.fillerRequestId1 = undefined
            case 2: this.fillerRequestId2 = undefined
        }
        return SpawnCluster.spawnCreepResult(id)
    }
    _getSpawnById(n: number, id: string): StructureSpawn {
        if (!id) {
            let newSpawnPos: RoomPosition
            switch (n) {
                case 1: newSpawnPos = new RoomPosition(this.colony.anchor.x, this.colony.anchor.y + 2, this.colony.anchor.roomName)
                    break
                case 2: newSpawnPos = new RoomPosition(this.colony.anchor.x + 2, this.colony.anchor.y + 3, this.colony.anchor.roomName)
                    break
                case 3: newSpawnPos = new RoomPosition(this.colony.anchor.x - 2, this.colony.anchor.y + 3, this.colony.anchor.roomName)
                    break
            }
            let newId = mq.sendRequestUrgently(this.colony.constructorCluster.name, this.name, ConstructorCluster.construct(newSpawnPos, STRUCTURE_SPAWN))
            switch (n) {
                case 1: this.spawnRequestId1 = newId
                    break
                case 2: this.spawnRequestId2 = newId
                    break
                case 3: this.spawnRequestId3 = newId
                    break
            }
            return null
        }
        switch (n) {
            case 1: this.spawnRequestId1 = undefined
                break
            case 2: this.spawnRequestId2 = undefined
                break
            case 3: this.spawnRequestId3 = undefined
                break
        }
        return
    }

}