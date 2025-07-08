import { supabase } from '../services/supabaseClient';

// Enhanced sample data for Mauritania Football App
export const sampleTeams = [
  {
    name: 'نادي نواكشوط',
    description: 'نادي نواكشوط لكرة القدم - العاصمة الرياضية',
    city: 'نواكشوط',
    coach: 'محمد الأمين ولد أحمد',
    founded_year: 1985,
    founding_date: '1985-03-15',
    logo_url: 'https://example.com/nouakchott-logo.png',
    primary_color: '#1e3c72',
    secondary_color: '#2a5298',
    stadium: 'الملعب الأولمبي',
    division: 'الدوري الممتاز',
    team_status: 'active',
    website: 'https://nouakchottfc.mr',
    captain: 'محمد ولد أحمد',
    wins: 15,
    draws: 8,
    losses: 7,
    goals_scored: 42,
    goals_conceded: 28,
    achievements: [
      { year: 2020, title: 'بطل كأس موريتانيا' },
      { year: 2019, title: 'وصيف الدوري الممتاز' },
      { year: 2018, title: 'بطل كأس الاتحاد الإفريقي للأندية' }
    ],
    staff: [
      { name: 'عبد الرحمن سالم', role: 'مدرب مساعد' },
      { name: 'أحمد فال', role: 'مدرب اللياقة البدنية' },
      { name: 'فاطمة محمد', role: 'طبيبة الفريق' }
    ],
    banner_image: 'https://example.com/nouakchott-banner.jpg',
    team_photos: [
      { id: 1, url: 'https://example.com/team1.jpg', caption: 'صورة الفريق 2023' },
      { id: 2, url: 'https://example.com/team2.jpg', caption: 'احتفال البطولة' }
    ]
  },
  {
    name: 'نادي نواذيبو',
    description: 'نادي نواذيبو الرياضي - قوة الشمال',
    city: 'نواذيبو',
    coach: 'أحمد ولد محمد',
    founded_year: 1978,
    founding_date: '1978-11-20',
    logo_url: 'https://example.com/nouadhibou-logo.png',
    primary_color: '#c0392b',
    secondary_color: '#e74c3c',
    stadium: 'ملعب نواذيبو البلدي',
    division: 'الدوري الممتاز',
    team_status: 'active',
    website: 'https://nouadhiboufc.mr',
    captain: 'عبد الرحمن سالم',
    wins: 12,
    draws: 10,
    losses: 8,
    goals_scored: 38,
    goals_conceded: 32,
    achievements: [
      { year: 2021, title: 'بطل الدوري الممتاز' },
      { year: 2020, title: 'وصيف كأس موريتانيا' }
    ],
    staff: [
      { name: 'محمد أحمد', role: 'مدرب مساعد' },
      { name: 'سالم ولد عبدي', role: 'مدرب حراس المرمى' }
    ],
    banner_image: 'https://example.com/nouadhibou-banner.jpg',
    team_photos: [
      { id: 1, url: 'https://example.com/nouadhibou1.jpg', caption: 'تدريبات الفريق' }
    ]
  },
  {
    name: 'نادي روصو',
    description: 'النادي الأهلي لمدينة روصو - فخر الجنوب',
    city: 'روصو',
    coach: 'عبد الرحمن سالم',
    founded_year: 1990,
    founding_date: '1990-06-10',
    logo_url: 'https://example.com/rosso-logo.png',
    primary_color: '#27ae60',
    secondary_color: '#2ecc71',
    stadium: 'ملعب روصو الرياضي',
    division: 'الدرجة الأولى',
    team_status: 'active',
    website: 'https://rossofc.mr',
    captain: 'محمد الأمين',
    wins: 18,
    draws: 6,
    losses: 6,
    goals_scored: 52,
    goals_conceded: 25,
    achievements: [
      { year: 2022, title: 'بطل الدرجة الأولى' },
      { year: 2021, title: 'هداف الدوري - محمد الأمين' }
    ],
    staff: [
      { name: 'علي محمد', role: 'مدرب مساعد' }
    ],
    banner_image: 'https://example.com/rosso-banner.jpg',
    team_photos: []
  },
  {
    name: 'نادي كيفة',
    description: 'نادي كيفة لكرة القدم - عراقة التاريخ',
    city: 'كيفة',
    coach: 'محمد فال',
    founded_year: 1988,
    founding_date: '1988-09-05',
    logo_url: 'https://example.com/kaedi-logo.png',
    primary_color: '#f39c12',
    secondary_color: '#e67e22',
    stadium: 'ملعب كيفة المركزي',
    division: 'الدرجة الأولى',
    team_status: 'active',
    website: 'https://kaedifc.mr',
    captain: 'أحمد فال',
    wins: 14,
    draws: 8,
    losses: 8,
    goals_scored: 45,
    goals_conceded: 35,
    achievements: [
      { year: 2019, title: 'وصيف الدرجة الأولى' }
    ],
    staff: [
      { name: 'محمد ولد سالم', role: 'مدرب مساعد' }
    ],
    banner_image: 'https://example.com/kaedi-banner.jpg',
    team_photos: []
  }
];

export const sampleNews = [
  {
    title: 'افتتاح الموسم الجديد لكرة القدم الموريتانية',
    content: 'تم افتتاح الموسم الجديد لكرة القدم الموريتانية بحضور كبير من الجماهير والمسؤولين الرياضيين. المسابقة تضم 16 فريقًا من مختلف مناطق البلاد وتعتبر الأقوى في تاريخ البطولة. سيشهد الموسم الجديد تطبيق قوانين جديدة ونظام حديث للحكم بالفيديو.',
    author: 'عبد الله محمد الصحفي',
    is_featured: true,
    image_url: 'https://example.com/news1.jpg',
    excerpt: 'افتتح الموسم الجديد لكرة القدم الموريتانية بمشاركة 16 فريقًا من جميع أنحاء البلاد',
    category: 'أخبار رياضية',
    tags: ['افتتاح', 'موسم جديد', 'كرة قدم', 'موريتانيا'],
    status: 'published',
    publish_date: new Date().toISOString(),
    is_breaking_news: true,
    seo_title: 'افتتاح الموسم الجديد لكرة القدم الموريتانية 2023',
    seo_description: 'تفاصيل افتتاح الموسم الجديد لكرة القدم الموريتانية بمشاركة 16 فريقًا',
    seo_keywords: 'كرة قدم, موريتانيا, موسم جديد, افتتاح',
    social_media_title: '🏆 انطلاق الموسم الجديد لكرة القدم الموريتانية',
    social_media_description: 'شاهد تفاصيل افتتاح أقوى موسم في تاريخ كرة القدم الموريتانية',
    related_articles: [],
    gallery: [
      { id: 1, url: 'https://example.com/news1-gallery1.jpg', caption: 'مراسم الافتتاح' },
      { id: 2, url: 'https://example.com/news1-gallery2.jpg', caption: 'الجماهير في الملعب' }
    ]
  },
  {
    title: 'نادي نواكشوط يحقق فوزًا مهمًا',
    content: 'حقق نادي نواكشوط فوزًا مهمًا على منافسه نادي نواذيبو بنتيجة 2-1 في مباراة قوية شهدها الملعب الأولمبي. سجل أهداف نواكشوط كل من محمد ولد أحمد وأحمد فال، بينما سجل لنواذيبو عبد الرحمن سالم.',
    author: 'أحمد ولد سالم',
    is_featured: true,
    image_url: 'https://example.com/news2.jpg',
    excerpt: 'فوز مهم لنادي نواكشوط على نواذيبو بنتيجة 2-1 في الملعب الأولمبي',
    category: 'تقارير المباريات',
    tags: ['نواكشوط', 'نواذيبو', 'فوز', 'مباراة'],
    status: 'published',
    publish_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_breaking_news: false,
    seo_title: 'نواكشوط ينتصر على نواذيبو 2-1',
    seo_description: 'تقرير مباراة نواكشوط ونواذيبو في الدوري الموريتاني',
    seo_keywords: 'نواكشوط, نواذيبو, مباراة, دوري',
    social_media_title: '⚽ نواكشوط ينتصر على نواذيبو!',
    social_media_description: 'مباراة مثيرة انتهت بفوز نواكشوط 2-1',
    related_articles: [],
    gallery: []
  },
  {
    title: 'تطوير البنية التحتية لكرة القدم',
    content: 'أعلنت الحكومة الموريتانية عن خطة شاملة لتطوير البنية التحتية لكرة القدم تشمل بناء ملاعب جديدة وتحسين الموجودة.',
    author: 'محمد الأمين',
    is_featured: false,
    image_url: 'https://example.com/news3.jpg',
    excerpt: 'خطة حكومية شاملة لتطوير البنية التحتية الرياضية',
    category: 'أخبار الاتحاد',
    tags: ['تطوير', 'بنية تحتية', 'ملاعب'],
    status: 'published',
    publish_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    is_breaking_news: false,
    seo_title: 'خطة تطوير البنية التحتية الرياضية في موريتانيا',
    seo_description: 'تفاصيل الخطة الحكومية لتطوير الملاعب والمرافق الرياضية',
    seo_keywords: 'تطوير, ملاعب, موريتانيا, رياضة',
    social_media_title: '🏗️ خطة تطوير ملاعب كرة القدم',
    social_media_description: 'استثمارات جديدة في البنية التحتية الرياضية',
    related_articles: [],
    gallery: []
  },
  {
    title: 'انطلاق برنامج تدريب المدربين',
    content: 'انطلق برنامج تدريب المدربين الجديد بهدف رفع مستوى التدريب في البلاد وإعداد جيل جديد من المدربين المؤهلين.',
    author: 'فاطمة بنت أحمد',
    is_featured: false,
    image_url: 'https://example.com/news4.jpg',
    excerpt: 'برنامج جديد لتأهيل المدربين ورفع مستوى التدريب',
    category: 'تدريب وتطوير',
    tags: ['تدريب', 'مدربين', 'تأهيل'],
    status: 'published',
    publish_date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    is_breaking_news: false,
    seo_title: 'برنامج تدريب المدربين في موريتانيا',
    seo_description: 'انطلاق برنامج جديد لتأهيل وتدريب المدربين',
    seo_keywords: 'تدريب, مدربين, موريتانيا, تأهيل',
    social_media_title: '📚 برنامج تدريب المدربين',
    social_media_description: 'استثمار في تطوير الكوادر التدريبية',
    related_articles: [],
    gallery: []
  }
];

export const samplePlayers = [
  {
    name: 'محمد ولد أحمد',
    position: 'مهاجم',
    age: 24,
    photo_url: 'https://example.com/player1.jpg',
    biography: 'لاعب موهوب بدأ مسيرته في نادي نواكشوط وأصبح من أفضل المهاجمين في البطولة.',
    stats: {
      goals: 15,
      assists: 8,
      matches: 25
    },
    jersey_number: 10,
    date_of_birth: '1999-05-15',
    height: 178.5,
    weight: 72.3,
    nationality: 'MR',
    preferred_foot: 'right',
    contract_start: '2022-01-01',
    contract_end: '2025-12-31',
    market_value: 150000.00,
    player_status: 'active',
    is_captain: true,
    appearances: 25,
    goals: 15,
    assists: 8,
    yellow_cards: 3,
    red_cards: 0,
    clean_sheets: 0,
    minutes_played: 2250,
    attributes: {
      pace: 8,
      shooting: 9,
      passing: 7,
      dribbling: 8,
      defending: 4,
      physical: 7,
      technique: 8,
      tactical: 7,
      mental: 8
    },
    social_media: {
      instagram: '@mohamed_ahmed_10',
      twitter: '@MAhmed10',
      facebook: 'Mohamed Ahmed Official'
    },
    gallery: [
      { id: 1, url: 'https://example.com/player1-gallery1.jpg', caption: 'احتفال بالهدف' },
      { id: 2, url: 'https://example.com/player1-gallery2.jpg', caption: 'في التدريب' }
    ]
  },
  {
    name: 'عبد الرحمن سالم',
    position: 'حارس مرمى',
    age: 28,
    photo_url: 'https://example.com/player2.jpg',
    biography: 'حارس مرمى متمرس وقائد فريق نواذيبو، معروف بردود أفعاله السريعة.',
    stats: {
      saves: 45,
      cleanSheets: 12,
      matches: 28
    },
    jersey_number: 1,
    date_of_birth: '1995-08-22',
    height: 185.0,
    weight: 78.5,
    nationality: 'MR',
    preferred_foot: 'right',
    contract_start: '2021-07-01',
    contract_end: '2024-06-30',
    market_value: 80000.00,
    player_status: 'active',
    is_captain: true,
    appearances: 28,
    goals: 0,
    assists: 2,
    yellow_cards: 2,
    red_cards: 1,
    clean_sheets: 12,
    minutes_played: 2520,
    attributes: {
      pace: 6,
      shooting: 3,
      passing: 7,
      dribbling: 5,
      defending: 9,
      physical: 8,
      technique: 7,
      tactical: 8,
      mental: 9
    },
    social_media: {
      instagram: '@abdurrahman_salem',
      twitter: '@ASalem1',
      facebook: 'Abdurrahman Salem GK'
    },
    gallery: []
  },
  {
    name: 'أحمد فال',
    position: 'وسط',
    age: 26,
    photo_url: 'https://example.com/player3.jpg',
    biography: 'لاعب وسط مبدع وصانع ألعاب، يتميز بدقة التمرير والرؤية التكتيكية.',
    stats: {
      goals: 8,
      assists: 18,
      matches: 27
    },
    jersey_number: 8,
    date_of_birth: '1997-12-10',
    height: 175.2,
    weight: 69.8,
    nationality: 'MR',
    preferred_foot: 'left',
    contract_start: '2022-08-15',
    contract_end: '2026-08-14',
    market_value: 120000.00,
    player_status: 'active',
    is_captain: false,
    appearances: 27,
    goals: 8,
    assists: 18,
    yellow_cards: 5,
    red_cards: 0,
    clean_sheets: 0,
    minutes_played: 2430,
    attributes: {
      pace: 7,
      shooting: 6,
      passing: 9,
      dribbling: 8,
      defending: 6,
      physical: 6,
      technique: 9,
      tactical: 9,
      mental: 8
    },
    social_media: {
      instagram: '@ahmed_fall_8',
      twitter: '@AFall8',
      facebook: ''
    },
    gallery: []
  },
  {
    name: 'محمد الأمين',
    position: 'مدافع',
    age: 29,
    photo_url: 'https://example.com/player4.jpg',
    biography: 'مدافع صلب وقائد فريق روصو، يتميز بالقوة البدنية والقراءة الجيدة للعب.',
    stats: {
      goals: 3,
      assists: 5,
      matches: 26
    },
    jersey_number: 4,
    date_of_birth: '1994-03-18',
    height: 182.0,
    weight: 79.2,
    nationality: 'MR',
    preferred_foot: 'right',
    contract_start: '2021-01-01',
    contract_end: '2024-12-31',
    market_value: 90000.00,
    player_status: 'active',
    is_captain: true,
    appearances: 26,
    goals: 3,
    assists: 5,
    yellow_cards: 8,
    red_cards: 1,
    clean_sheets: 15,
    minutes_played: 2340,
    attributes: {
      pace: 6,
      shooting: 4,
      passing: 6,
      dribbling: 5,
      defending: 9,
      physical: 9,
      technique: 6,
      tactical: 8,
      mental: 8
    },
    social_media: {
      instagram: '@mohamed_lamine',
      twitter: '',
      facebook: 'Mohamed Lamine Defender'
    },
    gallery: []
  }
];

export const sampleShopCategories = [
  {
    name: 'القمصان الرسمية',
    description: 'قمصان الفرق الرسمية للموسم الحالي مع أحدث التصاميم',
    image_url: 'https://example.com/jerseys.jpg'
  },
  {
    name: 'الإكسسوارات',
    description: 'إكسسوارات وأدوات رياضية متنوعة للاعبين والمشجعين',
    image_url: 'https://example.com/accessories.jpg'
  },
  {
    name: 'الأحذية الرياضية',
    description: 'أحذية كرة القدم والأحذية الرياضية من أفضل الماركات',
    image_url: 'https://example.com/shoes.jpg'
  },
  {
    name: 'هدايا تذكارية',
    description: 'هدايا وتذكارات رياضية مميزة للمناسبات الخاصة',
    image_url: 'https://example.com/gifts.jpg'
  }
];

export const sampleShopItems = [
  {
    name: 'قميص نادي نواكشوط الرسمي',
    description: 'قميص رسمي للموسم الحالي بالألوان التقليدية، مصنوع من أجود الخامات مع تقنية امتصاص العرق',
    price: 2500.00,
    stock_quantity: 50,
    is_available: true,
    image_url: 'https://example.com/jersey1.jpg',
    product_status: 'active',
    is_featured: true,
    discount_price: 2000.00,
    weight: 250.0,
    sku: 'NFC-HOME-2023',
    tags: ['قميص', 'نواكشوط', 'رسمي', 'موسم 2023'],
    barcode: '1234567890123',
    meta_title: 'قميص نادي نواكشوط الرسمي - موسم 2023',
    meta_description: 'احصل على قميص نادي نواكشوط الرسمي للموسم الجديد',
    has_promotion: true,
    promotion_start_date: new Date().toISOString().split('T')[0],
    promotion_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_variants: true,
    variants: [
      { id: 1, size: 'S', price: 2500.00, stock: 10 },
      { id: 2, size: 'M', price: 2500.00, stock: 15 },
      { id: 3, size: 'L', price: 2500.00, stock: 20 },
      { id: 4, size: 'XL', price: 2500.00, stock: 5 }
    ],
    product_images: [
      { id: 1, url: 'https://example.com/jersey1-front.jpg', caption: 'الجهة الأمامية' },
      { id: 2, url: 'https://example.com/jersey1-back.jpg', caption: 'الجهة الخلفية' }
    ]
  },
  {
    name: 'حذاء كرة القدم المحترف',
    description: 'حذاء كرة قدم عالي الجودة للاعبين المحترفين، مزود بتقنية الثبات والراحة',
    price: 15000.00,
    stock_quantity: 25,
    is_available: true,
    image_url: 'https://example.com/shoe1.jpg',
    product_status: 'active',
    is_featured: false,
    discount_price: null,
    weight: 350.0,
    sku: 'PROF-BOOT-001',
    tags: ['حذاء', 'كرة قدم', 'محترف', 'رياضي'],
    barcode: '1234567890124',
    meta_title: 'حذاء كرة القدم المحترف',
    meta_description: 'أحذية كرة قدم احترافية للاعبين المحترفين',
    has_promotion: false,
    promotion_start_date: null,
    promotion_end_date: null,
    has_variants: true,
    variants: [
      { id: 1, size: '40', price: 15000.00, stock: 5 },
      { id: 2, size: '41', price: 15000.00, stock: 8 },
      { id: 3, size: '42', price: 15000.00, stock: 7 },
      { id: 4, size: '43', price: 15000.00, stock: 5 }
    ],
    product_images: []
  },
  {
    name: 'كرة قدم رسمية',
    description: 'كرة قدم رسمية معتمدة للمباريات، مطابقة للمواصفات الدولية',
    price: 8000.00,
    stock_quantity: 30,
    is_available: true,
    image_url: 'https://example.com/ball1.jpg',
    product_status: 'active',
    is_featured: true,
    discount_price: 7200.00,
    weight: 450.0,
    sku: 'BALL-OFF-001',
    tags: ['كرة', 'رسمية', 'مباريات', 'معتمدة'],
    barcode: '1234567890125',
    meta_title: 'كرة قدم رسمية معتمدة',
    meta_description: 'كرة قدم رسمية للمباريات والتدريبات',
    has_promotion: true,
    promotion_start_date: new Date().toISOString().split('T')[0],
    promotion_end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_variants: false,
    variants: [],
    product_images: []
  },
  {
    name: 'وشاح نادي نواذيبو',
    description: 'وشاح رسمي لنادي نواذيبو بألوان الفريق الأصلية',
    price: 1200.00,
    stock_quantity: 100,
    is_available: true,
    image_url: 'https://example.com/scarf1.jpg',
    product_status: 'active',
    is_featured: false,
    discount_price: null,
    weight: 100.0,
    sku: 'NDB-SCARF-001',
    tags: ['وشاح', 'نواذيبو', 'مشجعين', 'هدية'],
    barcode: '1234567890126',
    meta_title: 'وشاح نادي نواذيبو الرسمي',
    meta_description: 'وشاح رسمي لمشجعي نادي نواذيبو',
    has_promotion: false,
    promotion_start_date: null,
    promotion_end_date: null,
    has_variants: false,
    variants: [],
    product_images: []
  }
];

// Function to insert enhanced initial data into Supabase
export const insertInitialData = async () => {
  try {
    console.log('إدراج البيانات الأولية المحسنة...');

    // Insert teams
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .insert(sampleTeams)
      .select();

    if (teamsError) {
      console.error('خطأ في إدراج الفرق:', teamsError);
      return { success: false, error: teamsError.message };
    }

    console.log('تم إدراج الفرق بنجاح');

    // Insert news
    const { error: newsError } = await supabase
      .from('news')
      .insert(sampleNews);

    if (newsError) {
      console.error('خطأ في إدراج الأخبار:', newsError);
      return { success: false, error: newsError.message };
    }

    console.log('تم إدراج الأخبار بنجاح');

    // Insert players with team IDs
    const playersWithTeamIds = samplePlayers.map((player, index) => ({
      ...player,
      team_id: teamsData[index % teamsData.length]?.id
    }));

    const { error: playersError } = await supabase
      .from('players')
      .insert(playersWithTeamIds);

    if (playersError) {
      console.error('خطأ في إدراج اللاعبين:', playersError);
      return { success: false, error: playersError.message };
    }

    console.log('تم إدراج اللاعبين بنجاح');

    // Insert shop categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('shop_categories')
      .insert(sampleShopCategories)
      .select();

    if (categoriesError) {
      console.error('خطأ في إدراج فئات المتجر:', categoriesError);
      return { success: false, error: categoriesError.message };
    }

    console.log('تم إدراج فئات المتجر بنجاح');

    // Insert shop items with category IDs
    const itemsWithCategoryIds = sampleShopItems.map((item, index) => ({
      ...item,
      category_id: categoriesData[index % categoriesData.length]?.id
    }));

    const { error: itemsError } = await supabase
      .from('shop_items')
      .insert(itemsWithCategoryIds);

    if (itemsError) {
      console.error('خطأ في إدراج منتجات المتجر:', itemsError);
      return { success: false, error: itemsError.message };
    }

    console.log('تم إدراج منتجات المتجر بنجاح');

    // Insert sample matches with enhanced data
    const sampleMatches = [
      {
        home_team_id: teamsData[0]?.id,
        away_team_id: teamsData[1]?.id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        match_time: '18:00:00',
        venue: 'الملعب الأولمبي',
        competition: 'الدوري الموريتاني',
        status: 'scheduled',
        referee: 'أحمد محمد الحكم',
        attendance: null,
        season: '2023-2024',
        match_day: 1,
        is_featured: true,
        match_description: 'قمة الجولة الأولى بين فريقي العاصمة والشمال',
        highlights: '',
        match_stats: {
          homePossession: 50,
          awayPossession: 50,
          homeShots: 0,
          awayShots: 0,
          homeShotsOnTarget: 0,
          awayShotsOnTarget: 0,
          homeCorners: 0,
          awayCorners: 0,
          homeFouls: 0,
          awayFouls: 0,
          homeYellowCards: 0,
          awayYellowCards: 0,
          homeRedCards: 0,
          awayRedCards: 0,
          homeOffsides: 0,
          awayOffsides: 0
        },
        events: [],
        cover_image: 'https://example.com/match1.jpg',
        gallery: []
      },
      {
        home_team_id: teamsData[2]?.id,
        away_team_id: teamsData[3]?.id,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        match_time: '16:00:00',
        venue: 'ملعب كيفة',
        competition: 'الدوري الموريتاني',
        status: 'scheduled',
        referee: 'محمد سالم الحكم',
        attendance: null,
        season: '2023-2024',
        match_day: 2,
        is_featured: false,
        match_description: 'مواجهة مهمة في الدرجة الأولى',
        highlights: '',
        match_stats: {
          homePossession: 50,
          awayPossession: 50,
          homeShots: 0,
          awayShots: 0,
          homeShotsOnTarget: 0,
          awayShotsOnTarget: 0,
          homeCorners: 0,
          awayCorners: 0,
          homeFouls: 0,
          awayFouls: 0,
          homeYellowCards: 0,
          awayYellowCards: 0,
          homeRedCards: 0,
          awayRedCards: 0,
          homeOffsides: 0,
          awayOffsides: 0
        },
        events: [],
        cover_image: '',
        gallery: []
      },
      {
        home_team_id: teamsData[1]?.id,
        away_team_id: teamsData[0]?.id,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        match_time: '17:30:00',
        venue: 'ملعب نواذيبو',
        competition: 'الدوري الموريتاني',
        home_score: 2,
        away_score: 1,
        status: 'completed',
        referee: 'عبد الله أحمد الحكم',
        attendance: 8500,
        season: '2023-2024',
        match_day: 15,
        is_featured: true,
        match_description: 'مباراة مثيرة انتهت بفوز أصحاب الأرض',
        highlights: 'أهداف رائعة وإثارة كبيرة طوال المباراة',
        match_stats: {
          homePossession: 55,
          awayPossession: 45,
          homeShots: 12,
          awayShots: 8,
          homeShotsOnTarget: 6,
          awayShotsOnTarget: 4,
          homeCorners: 7,
          awayCorners: 3,
          homeFouls: 14,
          awayFouls: 18,
          homeYellowCards: 2,
          awayYellowCards: 3,
          homeRedCards: 0,
          awayRedCards: 1,
          homeOffsides: 2,
          awayOffsides: 4
        },
        events: [
          { type: 'goal', minute: 23, team: 'home', player: 'عبد الرحمن سالم', description: 'هدف رائع من خارج المنطقة' },
          { type: 'goal', minute: 45, team: 'away', player: 'محمد ولد أحمد', description: 'هدف التعادل قبل نهاية الشوط' },
          { type: 'goal', minute: 78, team: 'home', player: 'أحمد محمد', description: 'هدف الفوز من ركلة حرة' },
          { type: 'red_card', minute: 85, team: 'away', player: 'أحمد فال', description: 'طرد لتدخل عنيف' }
        ],
        cover_image: 'https://example.com/match3.jpg',
        gallery: [
          { id: 1, url: 'https://example.com/match3-gallery1.jpg', caption: 'احتفال بالهدف الأول' }
        ]
      }
    ];

    const { error: matchesError } = await supabase
      .from('matches')
      .insert(sampleMatches);

    if (matchesError) {
      console.error('خطأ في إدراج المباريات:', matchesError);
      return { success: false, error: matchesError.message };
    }

    console.log('تم إدراج المباريات بنجاح');
    console.log('تم إدراج جميع البيانات الأولية المحسنة بنجاح!');
    
    return { success: true, message: 'تم إدراج البيانات المحسنة بنجاح' };

  } catch (error) {
    console.error('خطأ في إدراج البيانات الأولية:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sampleTeams,
  sampleNews,
  samplePlayers,
  sampleShopCategories,
  sampleShopItems,
  insertInitialData
}; 