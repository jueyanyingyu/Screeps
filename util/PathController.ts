import { LRUCache } from "../module/LRUCache"



class GetPathOpts {
    range: number
    ignoreCreeps: boolean
    ignoreRoads: boolean
    flee: boolean
}
export class PathController {
    private cache: LRUCache

    static marshal(obj: Object): PathController {
        let pathController = new PathController()
        if (obj) {
            pathController.cache = LRUCache.marshal(obj)
        } else {
            pathController.cache = new LRUCache(200)
        }
        return pathController

    }
    static unmarshal(pathController: PathController): Object {
        return LRUCache.unmarshal(pathController.cache)
    }

    getPath(origin: RoomPosition, goal: RoomPosition, opts?: GetPathOpts): RoomPosition[] {
        let pathKey: string = Math.floor(Game.time / 1500) + ':' + origin.x + ':' + origin.y + ':' + origin.roomName + ';' + goal.x + ':' + goal.y + ':' + goal.roomName
        if (opts) {
            for (let i in opts) {
                pathKey = pathKey + ':' + opts[i]
            }
        }
        let path: RoomPosition[]
        if (this.cache.get(pathKey)) {
            path = this.deserializePath(this.cache.get(pathKey))
        }
        if (!path) {
            let pathFinderOpts: PathFinderOpts = {
                flee: opts.flee,
                plainCost: opts.ignoreRoads ? 1 : 2,
                swampCost: opts.ignoreRoads ? 5 : 10,
                roomCallback: function (roomName: string): CostMatrix {
                    let costs = new PathFinder.CostMatrix
                    let room = Game.rooms[roomName]
                    if (!room) {
                        let roomTerrain: RoomTerrain = new Room.Terrain(roomName)
                        for (let i = 0; i < 50; i++) {
                            for (let j = 0; j < 50; j++) {
                                let type = roomTerrain.get(i, j)
                                let cost: number
                                if (type === 0) {
                                    cost = 1
                                } else if (type === TERRAIN_MASK_WALL) {
                                    cost = 0xff
                                } else {
                                    cost = 5
                                }
                            }
                        }
                        return costs
                    }
                    room.find(FIND_STRUCTURES).forEach(function (struct) {
                        if (!opts.ignoreRoads && struct.structureType === STRUCTURE_ROAD) {
                            // 相对于平原，寻路时将更倾向于道路
                            costs.set(struct.pos.x, struct.pos.y, 1)
                        } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my)) {
                            // 不能穿过无法行走的建筑
                            costs.set(struct.pos.x, struct.pos.y, 0xff)
                        }
                    })

                    // 躲避房间中的 creep
                    room.find(FIND_CREEPS).forEach(function (creep) {
                        costs.set(creep.pos.x, creep.pos.y, opts.ignoreCreeps ? 2 : 0xff);
                    })
                    return costs
                }
            }
            let res = PathFinder.search(origin, { pos: goal, range: opts.range }, pathFinderOpts)
            this.cache.set(pathKey, this.serializePath(res.path))
            return res.path
        }
        return path
    }

    serializePath(path: RoomPosition[]): string {
        let res = []
        for (let p of path) {
            res.push({
                x: p.x,
                y: p.y,
                roomName: p.roomName
            })
        }
        return JSON.stringify(res)
    }
    deserializePath(pathString: string): RoomPosition[] {
        let path: RoomPosition[] = []
        let list = JSON.parse(pathString)
        for (let p of list) {
            path.push(new RoomPosition(p['x'], p['y'], p['roomName']))
        }
        return path
    }
}
