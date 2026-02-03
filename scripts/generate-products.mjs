import { v4 as uuidv4 } from 'uuid';

// Product data generator for Nordic minimalist style
const categories = [
  { id: uuidv4(), name: '家具', slug: 'furniture', description: '现代北欧家具' },
  { id: uuidv4(), name: '照明', slug: 'lighting', description: '照明灯具' },
  { id: uuidv4(), name: '装饰', slug: 'decor', description: '家居装饰品' },
  { id: uuidv4(), name: '厨房', slug: 'kitchen', description: '厨房用品' },
  { id: uuidv4(), name: '卧室', slug: 'bedroom', description: '卧室用品' },
  { id: uuidv4(), name: '浴室', slug: 'bathroom', description: '浴室用品' },
  { id: uuidv4(), name: '存储', slug: 'storage', description: '收纳存储' },
  { id: uuidv4(), name: '纺织品', slug: 'textiles', description: '布艺纺织品' },
];

const productNames = {
  furniture: [
    '北欧简约书架', '现代白色餐桌', '灰色布艺沙发', '天然木质椅子', '简约茶几',
    '北欧床架', '白色电视柜', '原木边几', '现代办公桌', '简约衣架',
    '北欧餐椅', '白色储物柜', '原木鞋架', '现代床头柜', '简约书桌',
    '灰色休闲椅', '白色书柜', '原木餐椅', '现代沙发床', '简约鞋柜',
    '北欧床头板', '白色边柜', '原木咖啡桌', '现代电视架', '简约工作台',
    '灰色单人沙发', '白色储物架', '原木衣柜', '现代书架', '简约餐边柜',
  ],
  lighting: [
    '现代吊灯', '北欧台灯', '简约壁灯', '白色吸顶灯', '灰色落地灯',
    '原木吊灯', '现代射灯', '北欧灯带', '简约筒灯', '白色灯罩',
    '灰色台灯', '原木壁灯', '现代灯泡', '北欧灯饰', '简约灯具',
    '白色吊灯', '灰色壁灯', '原木落地灯', '现代灯架', '北欧灯罩',
    '简约吸顶灯', '白色台灯', '灰色吊灯', '原木灯具', '现代壁灯',
    '北欧射灯', '简约灯泡', '白色灯带', '灰色灯架', '原木台灯',
  ],
  decor: [
    '白色陶瓷花瓶', '原木相框', '北欧挂画', '灰色抱枕', '简约地毯',
    '白色摆件', '原木装饰架', '现代墙贴', '北欧壁挂', '简约镜子',
    '灰色窗帘', '白色烛台', '原木装饰盒', '现代装饰画', '北欧挂钟',
    '简约花盆', '白色装饰球', '灰色靠垫', '原木相框', '现代装饰品',
    '北欧装饰灯', '简约挂毯', '白色置物架', '灰色装饰架', '原木摆件',
    '现代壁画', '北欧地毯', '简约花瓶', '白色装饰盒', '灰色相框',
  ],
  kitchen: [
    '不锈钢刀具套装', '陶瓷砧板', '北欧咖啡杯', '简约餐盘', '白色碗碟',
    '灰色杯子', '原木筷子', '现代锅具', '北欧餐具', '简约玻璃杯',
    '白色盘子', '灰色勺子', '原木砧板', '现代刀具', '北欧茶杯',
    '简约水杯', '白色餐碗', '灰色茶盘', '原木餐具', '现代烹饪工具',
    '北欧餐刀', '简约咖啡机', '白色烤盘', '灰色锅盖', '原木夹子',
    '现代量勺', '北欧漏勺', '简约切菜板', '白色托盘', '灰色筷筒',
  ],
  bedroom: [
    '棉质床单', '羽绒被', '枕头套', '床上四件套', '白色床罩',
    '灰色床垫', '原木床头灯', '现代床帘', '北欧床品', '简约被套',
    '白色枕头', '灰色毛毯', '原木床架', '现代床垫', '北欧床单',
    '简约被子', '白色床垫', '灰色床品', '原木枕头', '现代床帘',
    '北欧毛毯', '简约床单', '白色被套', '灰色枕套', '原木床头板',
    '现代床上用品', '北欧床垫', '简约毛毯', '白色床品', '灰色被子',
  ],
  bathroom: [
    '浴巾', '毛巾架', '肥皂盒', '牙刷杯', '浴帘',
    '浴垫', '镜子', '洗手液瓶', '卷纸架', '毛巾',
    '浴室柜', '淋浴喷头', '浴缸垫', '浴室灯', '镜前灯',
    '毛巾环', '肥皂架', '牙刷架', '浴室篮', '洗脸盆',
    '浴室地垫', '毛巾杆', '浴室镜', '洗漱杯', '浴室收纳',
    '浴室挂钩', '浴室门帘', '浴室灯具', '浴室配件', '浴室用品',
  ],
  storage: [
    '收纳盒', '储物柜', '收纳篮', '整理箱', '衣柜',
    '书架', '鞋架', '墙面收纳', '抽屉柜', '文件柜',
    '储物架', '收纳架', '壁挂架', '角柜', '边柜',
    '储物凳', '收纳凳', '整理柜', '展示架', '悬挂架',
    '墙面柜', '角架', '浮动架', '收纳格', '分类盒',
    '储物盒', '收纳袋', '整理盒', '分层架', '收纳柜',
  ],
  textiles: [
    '棉质地毯', '羊毛毯', '亚麻窗帘', '棉质抱枕', '羊毛毛毯',
    '棉麻布料', '绒面抱枕', '棉质桌布', '亚麻布艺', '羊毛地毯',
    '棉质床单', '羊毛毛衣', '亚麻沙发套', '棉质靠垫', '羊毛围巾',
    '棉麻混纺', '绒布抱枕', '棉质窗帘', '亚麻地毯', '羊毛毯子',
    '棉质布料', '羊毛手套', '亚麻靠垫', '棉质抱枕套', '羊毛毛毯',
    '棉麻窗帘', '绒面地毯', '棉质桌布', '亚麻布艺品', '羊毛毛毯',
  ],
};

const descriptions = [
  '采用天然材料制作，环保可持续',
  '北欧设计风格，简洁优雅',
  '高品质工艺，经久耐用',
  '现代简约设计，适合各种家居风格',
  '精选材料，舒适耐用',
  '设计感十足，提升家居品味',
  '功能性强，美观实用',
  '环保材料，健康安全',
  '精细工艺，品质卓越',
  '简约风格，百搭家居',
];

const priceRanges = {
  furniture: [1299, 2999, 4999, 6999, 8999, 12999],
  lighting: [299, 599, 899, 1299, 1999],
  decor: [99, 199, 299, 499, 699, 999],
  kitchen: [49, 99, 149, 199, 299, 399],
  bedroom: [199, 299, 399, 599, 799, 999],
  bathroom: [49, 99, 149, 199, 299],
  storage: [199, 399, 599, 799, 999, 1299],
  textiles: [99, 199, 299, 399, 499, 599],
};

function generateProducts() {
  const products = [];
  
  categories.forEach((category) => {
    const categoryNames = productNames[category.slug] || [];
    const prices = priceRanges[category.slug] || [299];
    
    categoryNames.forEach((name, index) => {
      const product = {
        id: uuidv4(),
        categoryId: category.id,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + uuidv4().substring(0, 8),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        shortDescription: name + ' - 北欧极简风格家居用品',
        basePrice: prices[Math.floor(Math.random() * prices.length)],
        cost: 0,
        weight: Math.random() * 10 + 0.5,
        dimensions: '50x50x50',
        status: 'active',
        isFeatured: Math.random() > 0.7,
        viewCount: Math.floor(Math.random() * 1000),
        rating: (Math.random() * 2 + 3.5).toFixed(1),
        ratingCount: Math.floor(Math.random() * 100),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      products.push(product);
    });
  });

  return { categories, products };
}

const { categories: cats, products } = generateProducts();

console.log('Generated data:');
console.log(`Categories: ${cats.length}`);
console.log(`Products: ${products.length}`);
console.log('\nSample products:');
console.log(JSON.stringify(products.slice(0, 3), null, 2));

// Export for use in database seeding
export { cats as categories, products };
