RoomPosition.prototype.getByDir = function (direction: number): RoomPosition {
    let x, y: number
    switch (direction) {
        case TOP: {
            x = this.x
            y = this.y - 1
            break
        }
        case TOP_RIGHT: {
            x = this.x + 1
            y = this.y - 1
            break
        }
        case RIGHT: {
            x = this.x + 1
            y = this.y
            break
        }
        case BOTTOM_RIGHT: {
            x = this.x + 1
            y = this.y + 1
            break
        }
        case BOTTOM: {
            x = this.x
            y = this.y + 1
            break
        }
        case BOTTOM_LEFT: {
            x = this.x - 1
            y = this.y + 1
            break
        }
        case LEFT: {
            x = this.x - 1
            y = this.y
            break
        }
        case TOP_LEFT: {
            x = this.x - 1
            y = this.y - 1
            break
        }

    }
    x = x < 0 ? 0 : (x > 50 ? 50 : x)
    y = y < 0 ? 0 : (y > 50 ? 50 : y)
    return new RoomPosition(x, y, this.roomName)
};
RoomPosition.prototype.getEnergyStructureNearBy = function (): Structure[] {
    let room = Game.rooms[this.roomName]
    if (!room)
        return []
    let structureList: Structure[]
    for (let i = TOP; i <= TOP_LEFT; i++) {
        structureList.concat(_.filter(room.lookForAt(LOOK_STRUCTURES, this.getByDir(i)),
            (s) => (<Structure>s).structureType === STRUCTURE_SPAWN ||
                (<Structure>s).structureType === STRUCTURE_EXTENSION ||
                (<Structure>s).structureType === STRUCTURE_STORAGE ||
                (<Structure>s).structureType === STRUCTURE_CONTAINER))
    }
    return structureList
}

