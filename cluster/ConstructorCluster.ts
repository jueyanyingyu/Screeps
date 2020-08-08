import { Cluster } from "./Cluster";
import { Colony } from "../colony/Colony";
import { mq } from "../init";

export class ConstructorCluster extends Cluster{


    static marshal(colony: Colony, obj: Object): ConstructorCluster {
        let constructorCluster = new ConstructorCluster()
        
        constructorCluster.colony = colony
        constructorCluster.colony = obj['name']


        return constructorCluster
    }

    static unmarshal(constructorCluster:ConstructorCluster): Object {
        return {
            name:constructorCluster.name

        }
    }
    //返回序列化的请求
    static construct(pos:RoomPosition,structureType:string): string {
        return JSON.stringify({
            pos:JSON.stringify({
                x:pos.x,
                y:pos.y,
                roomName:pos.roomName
            }),
            structureType:structureType
        })
    }
    //返回结果
    static constructResult(id: string): Structure {
        return Game.getObjectById[mq.getResponses(id)]
    }

    run(): void {
    }
}