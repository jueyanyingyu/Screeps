import { Colony } from "../colony/Colony"
import { SpawnCluster } from "../cluster/SpawnCluster"

export class Shard {
    name:string

    colonys:Colony[]
    

    static marshal(obj:Object):Shard {
        if (!obj) {
            let shard = new Shard(Game.shard.name)

            let spawn:StructureSpawn
            for (var key in Game.spawns) {
                spawn = Game.spawns[key]
            }

            let colony = new Colony()
            colony.anchor = new RoomPosition(spawn.pos.x,spawn.pos.y - 2,spawn.pos.roomName)
            colony.name = shard.name + ':'+ spawn.pos.roomName
            shard.colonys.push(colony)

            let spawnCluster = new SpawnCluster()
            spawnCluster.colony = colony
            spawnCluster.name = colony.name + ':spawnCluster'
            spawnCluster.spawn1 = spawn
            colony.spawnCluster = spawnCluster
            return shard
        }
        let shard = new Shard(obj['name'])
        for (let m of obj['colonys']) {
            shard.colonys.push(Colony.marshal(shard,m))
        }
        return shard
    }
    static unmarshal(shard:Shard):Object {
        let obj = {
            name:shard.name,
            colonys:[]
        }
        for (let m of shard.colonys) {
            obj.colonys.push(Colony.unmarshal(m))
        }
        return obj
    }

    private constructor(name:string) {
        this.name = name
    }
    run():void {
        for (let c of this.colonys) {
            c.run()
        }
    }
}