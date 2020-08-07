interface RoomPosition {
    getByDir(direction: number): RoomPosition;
    getEnergyStructureNearBy(): Structure[];
}