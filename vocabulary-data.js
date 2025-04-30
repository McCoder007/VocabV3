// Vocabulary data organized by weekly sets
const vocabularySets = [
    {
        id: "week1",
        name: "Week 1",
        words: [
            {
                image: 'images/headphones.png',
                english: 'headphones',
                chinese: '耳机',
                status: 'new'
            },
            {
                image: 'images/basketball.png',
                english: 'basketball',
                chinese: '篮球',
                status: 'new'
            },
            {
                image: 'images/ski.png',
                english: 'skiing',
                chinese: '滑雪',
                status: 'new'
            },
            {
                image: 'images/windsurfing.png',
                english: 'windsurfing',
                chinese: '帆板运动',
                status: 'new'
            },
            {
                image: 'images/rollercoaster.png',
                english: 'roller coaster',
                chinese: '过山车',
                status: 'new'
            },
            {
                image: 'images/tree_roots.png',
                english: 'tree roots',
                chinese: '树根',
                status: 'new'
            },
            {
                image: 'images/lungs.png',
                english: 'lungs',
                chinese: '肺',
                status: 'new'
            },
            {
                image: 'images/mud.png',
                english: 'mud',
                chinese: '泥',
                status: 'new'
            },
            {
                image: 'images/ladder.png',
                english: 'ladder',
                chinese: '梯子',
                status: 'new'
            },
            {
                image: 'images/duck.png',
                english: 'duck',
                chinese: '鸭子',
                status: 'new'
            },
            {
                image: 'images/cliff_diving.png',
                english: 'cliff diving',
                chinese: '悬崖跳水',
                status: 'new'
            },
            {
                image: 'images/button.png',
                english: 'button',
                chinese: '按钮',
                status: 'new'
            },
            {
                image: 'images/sewing_machine.png',
                english: 'sewing machine',
                chinese: '缝纫机',
                status: 'new'
            },
            {
                image: 'images/backpack.png',
                english: 'backpack',
                chinese: '背包',
                status: 'new'
            },
            {
                image: 'images/train.png',
                english: 'train',
                chinese: '火车',
                status: 'new'
            },
            {
                image: 'images/windmill.png',
                english: 'windmill',
                chinese: '风车',
                status: 'new'
            }
        ]
    },
    {
        id: "week2",
        name: "Week 2",
        words: [
            {
                image: 'images/wallet.png',
                english: 'wallet',
                chinese: '钱包',
                status: 'new'
            },
            {
                image: 'images/scale.png',
                english: 'scale',
                chinese: '体重秤 / 秤',
                status: 'new'
            },
            {
                image: 'images/ceiling_fan.png',
                english: 'ceiling fan',
                chinese: '吊扇',
                status: 'new'
            },
            {
                image: 'images/dishes.png',
                english: 'dishes',
                chinese: '碗碟 / 餐具',
                status: 'new'
            },
            {
                image: 'images/ambulance.png',
                english: 'ambulance',
                chinese: '救护车',
                status: 'new'
            },
            {
                image: 'images/qr_code.png',
                english: 'QR code',
                chinese: '二维码',
                status: 'new'
            },
            {
                image: 'images/pocket.png',
                english: 'pocket',
                chinese: '口袋',
                status: 'new'
            },
            {
                image: 'images/reef.png',
                english: 'reef',
                chinese: '珊瑚礁',
                status: 'new'
            },
            {
                image: 'images/glacier.png',
                english: 'glacier',
                chinese: '冰川',
                status: 'new'
            },
            {
                image: 'images/rain_forest.png',
                english: 'rain forest',
                chinese: '雨林',
                status: 'new'
            },
            {
                image: 'images/oven.png',
                english: 'oven',
                chinese: '烤箱',
                status: 'new'
            },
            {
                image: 'images/squirrel.png',
                english: 'squirrel',
                chinese: '松鼠',
                status: 'new'
            },
            {
                image: 'images/fireflies.png',
                english: 'fireflies',
                chinese: '萤火虫',
                status: 'new'
            },
            {
                image: 'images/lollipop.png',
                english: 'lollipop',
                chinese: '棒棒糖',
                status: 'new'
            },
            {
                image: 'images/scarf.png',
                english: 'scarf',
                chinese: '围巾',
                status: 'new'
            },
            {
                image: 'images/broccoli.png',
                english: 'broccoli',
                chinese: '西兰花',
                status: 'new'
            },
            {
                image: 'images/tomato.png',
                english: 'tomato',
                chinese: '番茄',
                status: 'new'
            },
            {
                image: 'images/carrot.png',
                english: 'carrot',
                chinese: '胡萝卜',
                status: 'new'
            },
            {
                image: 'images/peppers.png',
                english: 'peppers',
                chinese: '辣椒 / 青椒',
                status: 'new'
            },
            {
                image: 'images/vegetables.png',
                english: 'vegetables',
                chinese: '蔬菜',
                status: 'new'
            },
            {
                image: 'images/pineapple.png',
                english: 'pineapple',
                chinese: '菠萝',
                status: 'new'
            },
            {
                image: 'images/mango.png',
                english: 'mango',
                chinese: '芒果',
                status: 'new'
            },
            {
                image: 'images/bread.png',
                english: 'bread',
                chinese: '面包',
                status: 'new'
            },
            {
                image: 'images/soy_sauce.png',
                english: 'soy sauce',
                chinese: '酱油',
                status: 'new'
            },
            {
                image: 'images/soda.png',
                english: 'soda',
                chinese: '汽水',
                status: 'new'
            },
            {
                image: 'images/milk.png',
                english: 'milk',
                chinese: '牛奶',
                status: 'new'
            }
        ]
    }
];

// For backwards compatibility - current active vocabulary set
let vocabularyData = []; 