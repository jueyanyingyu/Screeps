import { SpawnCluster } from "../cluster/SpawnCluster"
import { ConstructorCluster } from "../cluster/ConstructorCluster"
import { Shard } from "../shard/Shard"

export class Colony {
    name: string

    anchor: RoomPosition

    spawnCluster: SpawnCluster
    constructorCluster: ConstructorCluster

    static marshal(shard: Shard, obj: Object): Colony {
        let colony = new Colony()
        colony.name = obj['name']
        let list = obj['anchor'].split(':')
        colony.anchor = new RoomPosition(Number(list[0]), Number(list[1]), list[2])
        colony.spawnCluster = SpawnCluster.marshal(colony, obj['spawnCluster'])
        colony.constructorCluster = ConstructorCluster.marshal(colony, obj['constructorCluster'])
        return colony
    }
    static unmarshal(colony: Colony): Object {
        return {
            name: colony.name,
            anchor: colony.anchor.x + ':' + colony.anchor.y + ':' + colony.anchor.roomName,
            spawnCluster: SpawnCluster.unmarshal(colony.spawnCluster),
            constructorCluster: ConstructorCluster.unmarshal(colony.constructorCluster)
        }
    }
    run(): void {
        this.spawnCluster.run()
        this.constructorCluster.run()
    }
}