import { SpawnCluster } from "../cluster/SpawnCluster"
import { ConstructorCluster } from "../cluster/ConstructorCluster"

export class Colony {
    name:string

    anchor:RoomPosition

    spawnCluster:SpawnCluster
    constructorCluster:ConstructorCluster
}