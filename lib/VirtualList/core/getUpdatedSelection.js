export const getUpdatedSelection = (params) => {
    var _a;
    const { items, oldSelectedIds, clickedItemId, modifiers: { altKey, ctrlKey, metaKey, shiftKey }, } = params;
    let newIds = [...oldSelectedIds];
    if (ctrlKey || metaKey) {
        if (newIds.includes(clickedItemId)) {
            newIds = newIds.filter(id => id !== clickedItemId);
        }
        else {
            newIds.push(clickedItemId);
        }
    }
    else if (altKey) {
        newIds = newIds.filter(id => id !== clickedItemId);
    }
    else if (shiftKey) {
        const lastSelectedId = (_a = (!!newIds.length ? newIds[newIds.length - 1] : undefined)) !== null && _a !== void 0 ? _a : clickedItemId;
        const fromI = items.findIndex(({ item }) => item.id === lastSelectedId);
        const toI = items.findIndex(({ item }) => item.id === clickedItemId);
        const start = toI >= fromI ? fromI : toI;
        const end = toI >= fromI ? toI : fromI;
        const reverse = toI < fromI;
        let selectedIds = items.slice(start, end + 1).map(({ item }) => item.id);
        selectedIds = reverse ? selectedIds.reverse() : selectedIds;
        newIds = [...newIds, ...selectedIds];
    }
    else {
        newIds = [clickedItemId];
    }
    // removing duplicates
    newIds = newIds.filter((id, i) => newIds.lastIndexOf(id) === i);
    return newIds;
};
//# sourceMappingURL=getUpdatedSelection.js.map