export const STAGE_PADDING = 300;

export const STAGE_SCALE = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export const ACTION_GROUPS = [
    {title: '试卷信息'},
    {title: '客观题'},
    {title: '主观题'},
    {title: '选做题'},
];

export const ACTION_INFO_GROUP = [
    {
        title: '水平矫正：',
        item: [
            {
                name: 'hor-correct_point',
                params: false
            },
            {
                name: 'hor-correct_line',
                params: false
            }
        ]
    },
    {
        title: '科目识别：',
        item: [
            {
                name: 'subject-discern',
                params: false
            }
        ]
    },
    {
        title: '考号区：',
        item: [
            {
                name: 'exam-no_code',
                params: true
            },
            {
                name: 'exam-no_fill',
                params: true
            }
        ]
    },
    {
        title: '定位点：',
        item: [
            {
                name: 'location-point_1',
                params: false
            },
            {
                name: 'location-point_2',
                params: false
            },
            {
                name: 'location-point_3',
                params: false
            }
        ]
    },
    {
        title: '缺考：',
        item: [
            {
                name: 'absent-mark',
                params: true
            }
        ]
    },
    {
        title: '遮罩区：',
        item: [
            {
                name: 'over-layer',
                params: true
            }
        ]
    }
];

export const ACTION_INFO_MAP = {
    'hor-correct_point': {
        button: '定位点',
        label: '水平定位点'
    },
    'hor-correct_line': {
        button: '水平点',
        label: '水平矫正点'
    },
    'subject-discern': {
        button: '选择',
        label: '科目识别'
    },
    'exam-no_code': {
        button: '条形码区',
        label: '条形码区'
    },
    'exam-no_fill': {
        button: '填涂考号',
        label: '填涂考号'
    },
    'location-point_1': {
        button: '定位点1',
        label: '定位点1'
    },
    'location-point_2': {
        button: '定位点2',
        label: '定位点2'
    },
    'location-point_3': {
        button: '定位点3',
        label: '定位点3'
    },
    'absent-mark': {
        button: '选择',
        label: '缺考标记'
    },
    'over-layer': {
        button: '选择',
        label: '遮罩区'
    }
};