/**
 * Topic-aware Image Mapper for ExplainingDream.com Articles
 * Maps article titles and categories to high-resolution, contextually relevant Unsplash photos.
 */

// Curated high quality Unsplash photos organized by topic
const TOPIC_PHOTO_MAP: Record<string, string[]> = {
  kaaba: [
    'photo-1591604466107-ec97de577aff',
    'photo-1564769625905-50e93615e769',
    'photo-1542816417-0983cbe82752',
    'photo-1584286595398-a59f21d313f5',
  ],
  quran: [
    'photo-1609599006353-e629aaabfeae',
    'photo-1519817650390-64a93db51149',
    'photo-1584286595398-a59f21d313f5',
    'photo-1507679799987-c73779587ccf',
  ],
  water: [
    'photo-1507525428034-b723cf961d3e',
    'photo-1518241353330-0f7941c2d9b5',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1500382017468-9049fed747ef',
    'photo-1506744038136-46273834b3fb',
  ],
  gold: [
    'photo-1610375461246-83df859d849d',
    'photo-1535632066927-ab7c9ab60908',
    'photo-1515562141207-7a88fb7ce338',
    'photo-1579783902614-a3fb3927b675',
  ],
  animal: [
    'photo-1550583724-b2692b85b150',
    'photo-1534188753412-3e26d0d618d6',
    'photo-1517849845537-4d257902454a',
    'photo-1470240731273-7821a6eeb6bd',
  ],
  travel: [
    'photo-1469854523086-cc02fe5d8800',
    'photo-1476514525535-ce702453a94d',
    'photo-1503376780353-7e6692767b70',
    'photo-1469474968028-56623f02e42e',
  ],
  marriage: [
    'photo-1519741497674-611481863552',
    'photo-1511285560929-80b456fea0bc',
    'photo-1522673607200-164d1b6ce486',
  ],
  family: [
    'photo-1519689680058-324335c77eba',
    'photo-1555252333-9f8e92e65df9',
    'photo-1502082553048-f009c37129b9',
  ],
  death: [
    'photo-1509114397022-ed747cca3f65',
    'photo-1518709268805-4e9042af9f23',
    'photo-1499209974431-9dac3cea0047',
  ],
  food: [
    'photo-1498837167922-ddd27525d352',
    'photo-1587049352847-81a56d773cae',
    'photo-1506084868230-bb9d95c24759',
  ],
  sky: [
    'photo-1519681393784-d120267933ba',
    'photo-1532012197267-da84d127e765',
    'photo-1507413245164-6160d8298b31',
    'photo-1475924156734-496f6cac6ec1',
  ],
  nature: [
    'photo-1447752875215-b2761acb3c5d',
    'photo-1426604966848-d7adac402bff',
    'photo-1441974231531-c6227db76b6e',
    'photo-1501785888041-af3ef285b470',
  ],
};

export function getRelevantArticleImageUrl(index: number, title: string, category: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerCat = category.toLowerCase();

  let selectedSet: string[] = TOPIC_PHOTO_MAP.nature;

  if (lowerTitle.includes('كعبة') || lowerTitle.includes('حرم') || lowerTitle.includes('مكة') || lowerTitle.includes('مقدسات') || lowerCat.includes('عبادات')) {
    selectedSet = TOPIC_PHOTO_MAP.kaaba;
  } else if (lowerTitle.includes('قرآن') || lowerTitle.includes('آية') || lowerTitle.includes('أنبياء') || lowerTitle.includes('رسول') || lowerTitle.includes('مصحف') || lowerTitle.includes('صلاة') || lowerTitle.includes('دعاء') || lowerCat.includes('روحانية')) {
    selectedSet = TOPIC_PHOTO_MAP.quran;
  } else if (lowerTitle.includes('ماء') || lowerTitle.includes('مطر') || lowerTitle.includes('بحر') || lowerTitle.includes('نهر') || lowerTitle.includes('غيث') || lowerTitle.includes('زورق')) {
    selectedSet = TOPIC_PHOTO_MAP.water;
  } else if (lowerTitle.includes('ذهب') || lowerTitle.includes('فضة') || lowerTitle.includes('كنز') || lowerTitle.includes('ماس') || lowerTitle.includes('مجوهرات') || lowerTitle.includes('ثروة') || lowerCat.includes('مال')) {
    selectedSet = TOPIC_PHOTO_MAP.gold;
  } else if (lowerTitle.includes('ثعبان') || lowerTitle.includes('أفعى') || lowerTitle.includes('أسد') || lowerTitle.includes('طيور') || lowerTitle.includes('حيوان') || lowerTitle.includes('حشرات')) {
    selectedSet = TOPIC_PHOTO_MAP.animal;
  } else if (lowerTitle.includes('سيارة') || lowerTitle.includes('سفر') || lowerTitle.includes('طريق') || lowerTitle.includes('مركبة') || lowerTitle.includes('أسفار') || lowerCat.includes('مركبات')) {
    selectedSet = TOPIC_PHOTO_MAP.travel;
  } else if (lowerTitle.includes('زواج') || lowerTitle.includes('فستان') || lowerTitle.includes('خطوبة') || lowerTitle.includes('ارتباط')) {
    selectedSet = TOPIC_PHOTO_MAP.marriage;
  } else if (lowerTitle.includes('حمل') || lowerTitle.includes('طفل') || lowerTitle.includes('ولادة') || lowerTitle.includes('أمومة') || lowerTitle.includes('ذرية') || lowerCat.includes('اجتماعية')) {
    selectedSet = TOPIC_PHOTO_MAP.family;
  } else if (lowerTitle.includes('موت') || lowerTitle.includes('أموات') || lowerTitle.includes('برزخ') || lowerTitle.includes('دفن') || lowerTitle.includes('قبر')) {
    selectedSet = TOPIC_PHOTO_MAP.death;
  } else if (lowerTitle.includes('طعام') || lowerTitle.includes('خبز') || lowerTitle.includes('عسل') || lowerTitle.includes('فاكهة') || lowerTitle.includes('أكل')) {
    selectedSet = TOPIC_PHOTO_MAP.food;
  } else if (lowerTitle.includes('شمس') || lowerTitle.includes('قمر') || lowerTitle.includes('نجوم') || lowerTitle.includes('سماء') || lowerTitle.includes('بدر') || lowerTitle.includes('ليل')) {
    selectedSet = TOPIC_PHOTO_MAP.sky;
  } else if (lowerCat.includes('طبيعة') || lowerCat.includes('حيوان')) {
    selectedSet = TOPIC_PHOTO_MAP.nature;
  }

  const photoId = selectedSet[index % selectedSet.length];
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=85&w=1200&sig=art_${index + 1}`;
}
