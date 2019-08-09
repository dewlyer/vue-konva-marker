const RECT_MIN_PADDING = 20;

export const rectColors = ['#63da4f', '#59a8da', '#da2b29'];

export const rectConfig = {
    fill: '#999',
    opacity: 0.35,
    draggable: true,
    dragBoundFunc
};

export const transformerConfig = {
    keepRatio: false,
    anchorSize: 6,
    anchorFill: '#e07575',
    anchorStroke: '#e07575',
    borderStroke: '#be4f52',
    borderDash: [4, 3],
    rotateAnchorOffset: 40,
    rotateEnabled: false,
    // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    boundBoxFunc
};

export function getStageCoordsRange(stage) {
    const {width, height} = getGroupSizeByStage(stage);
    const offset = stage.getAbsolutePosition();
    const x = offset.x;
    const y = offset.y;
    const w = offset.x + width;
    const h = offset.y + height;
    return {x, y, w, h};
}

function getGroupSizeByStage(stage) {
    const group = stage.findOne('.backgroundGroup');
    return {
        width: group.width(),
        height: group.height()
    };
}

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

function boundBoxFunc(oldBoundBox, newBoundBox) {
    const stage = this.getStage();
    const size = getGroupSizeByStage(stage);
    if (newBoundBox.width <= RECT_MIN_PADDING || newBoundBox.height <= RECT_MIN_PADDING) {
        console.log(1);
        return oldBoundBox;
    }
    if (newBoundBox.x < 0 || newBoundBox.x > size.width - newBoundBox.width) {
        console.log(2);
        return oldBoundBox;
    }
    if (newBoundBox.y < 0 || newBoundBox.y > size.height - newBoundBox.height) {
        console.log(3);
        return oldBoundBox;
    }
    return newBoundBox;
}
