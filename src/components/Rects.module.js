function dragBoundFunc(pos) {
    const stage = this.getStage();
    const range = getStageCoordsRange(stage);
    const w = this.width() * this.scaleX();
    const h = this.height() * this.scaleY();

    if (pos.x > range.w - w) {
        pos.x = range.w - w;
    } else if (pos.x < range.x) {
        pos.x = range.x;
    }

    if (pos.y > range.h - h) {
        pos.y = range.h - h;
    } else if (pos.y < range.y) {
        pos.y = range.y;
    }

    return pos;
}

export const RECT_MIN_PADDING = 20;

export const rectStyleBase = {
    fill: '#999',
    opacity: 0.35,
    draggable: true,
    dragBoundFunc
};

export function getGroupSizeByStage(stage) {
    const group = stage.findOne('.backgroundGroup');
    return {
        width: group.width(),
        height: group.height()
    };
}

export function getStageCoordsRange(stage) {
    const {width, height} = getGroupSizeByStage(stage);
    const offset = stage.getAbsolutePosition();
    const x = offset.x;
    const y = offset.y;
    const w = offset.x + width;
    const h = offset.y + height;
    return {x, y, w, h};
}
