export type BtiQuestionType = 'scale' | 'ordinal' | 'nominal' | 'multiple';

export interface BtiQuestion {
  id: number;
  text: string;
  type: BtiQuestionType;
  options: string[];
  allowCustom?: boolean;
}

export type BtiAnswer = number | string[];
export type BtiAnswers = Record<number, BtiAnswer>;
type BtiTypeInput = string | string[] | null | undefined;
export type BtiTasteAxisKey = 'sweetness' | 'body' | 'carbonation' | 'tradition' | 'alcohol';
export type BtiTasteAxisValues = Partial<Record<BtiTasteAxisKey, number>>;

export interface BtiResultProfile {
  type: string;
  name: string;
  analysisTitle: string;
  summary: string;
  traits: string[];
  recommendations: string[];
  tasteProfile: { label: string; value: number }[];
}

export const BTI_QUESTIONS: BtiQuestion[] = [
  {
    id: 1,
    text: '탁주/막걸리를 얼마나 마셔봤나요?',
    type: 'ordinal',
    options: ['처음이다', '잘 마시지 않는다', '가끔 마셔봤다', '종종 마신다', '자주 즐겨 마신다'],
  },
  {
    id: 2,
    text: '선호하는 막걸리 도수는?',
    type: 'ordinal',
    options: ['3~5도', '6~8도', '9~12도', '13~15도', '16도 이상'],
  },
  {
    id: 3,
    text: '막걸리 탁도(뿌연 정도) 선호는?',
    type: 'ordinal',
    options: ['맑고 투명한', '살짝 뿌연', '뽀얗게 뿌연', '일반적으로 탁한', '진하게 탁한'],
  },
  {
    id: 4,
    text: '달콤하고 과일향 나는 막걸리가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 5,
    text: '단맛 없이 깔끔하고 드라이한 막걸리가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 6,
    text: '안주 없이도 가볍게 마시는 막걸리를 좋아한다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 7,
    text: '술을 마실 때 사이다나 토닉워터를 타 먹는 걸 좋아한다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 8,
    text: '한 모금 마셨을 때 단맛이 먼저 느껴지길 원한다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 9,
    text: '막걸리에 다양한 부재료가 들어가는 것을 좋아한다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 10,
    text: '묵직하고 걸쭉하게 넘어가는 막걸리가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 11,
    text: '나는 에이드보다 스무디가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 12,
    text: '나는 맥주보다 소주가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 13,
    text: '나는 술을 마실 때 안주값보다 술값이 더 나온다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 14,
    text: '탄산이 톡 쏘는 청량한 막걸리가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 15,
    text: '탄산이 강하면 막걸리 본연의 향을 못 느끼는 것 같다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 16,
    text: '술 마신 후에 남는 잔향을 좋아한다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 17,
    text: '쌀과 누룩의 구수하고 전통적인 향이 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 18,
    text: '과일향이나 꽃향 등 화사하고 독특한 향이 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 19,
    text: '나는 겉절이보다 익은 김치가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 20,
    text: '아는 맛이 최고다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 21,
    text: '도수가 낮아 부담 없이 마실 수 있는 막걸리가 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 22,
    text: '갓 지은 쌀밥 냄새 같은 구수한 향이 좋다.',
    type: 'scale',
    options: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
  },
  {
    id: 23,
    text: '내가 선호하는 과일은?',
    type: 'nominal',
    options: ['레몬', '산딸기', '귤', '딸기', '메론'],
  },
  {
    id: 24,
    text: '막걸리와 함께 즐기는 음식은? (복수 선택)',
    type: 'multiple',
    options: ['치킨/튀김류', '삼겹살/육류', '해산물/회', '찌개류', '매운음식'],
    allowCustom: true,
  },
  {
    id: 25,
    text: '관심 있는 막걸리 향은? (복수 선택)',
    type: 'multiple',
    options: ['달콤한 과일향', '상큼한 과일향', '꽃향/허브향', '약재향', '쌀/누룩의 구수한 향'],
    allowCustom: true,
  },
];

const profile = (
  type: string,
  name: string,
  analysisTitle: string,
  summary: string,
  traits: string[],
  recommendations: string[],
  tasteProfile: number[]
): BtiResultProfile => ({
  type,
  name,
  analysisTitle,
  summary,
  traits,
  recommendations,
  tasteProfile: [
    { label: '단맛', value: tasteProfile[0] },
    { label: '바디', value: tasteProfile[1] },
    { label: '탄산', value: tasteProfile[2] },
    { label: '전통감', value: tasteProfile[3] },
    { label: '개성', value: tasteProfile[4] },
  ],
});

export const BTI_RESULTS: Record<string, BtiResultProfile> = {
  SHFC: profile('SHFC', '꿀단지에 빠진 인절미', '풍성한 맛을 즐기는 달콤한 미식가', '꿀단지에 풍덩 빠진 것처럼 달콤하고 묵직한 막걸리를 사랑하는 당신! 입안 가득 퍼지는 진한 단맛, 든든한 바디감, 톡 쏘는 탄산감까지 함께 느껴질 때 행복 200%예요. 고소한 쌀과 누룩 향이 중심을 잡아주는 전통적인 스타일을 선호하며, 맛 진한 안주와 함께할 때 SHFC의 매력이 더욱 살아나요!', ['#진한단맛', '#묵직한바디', '#청량한탄산', '#고소한곡물향', '#입안의축제', '#풍성한질감'], ['꿀 막걸리', '밤 막걸리', '탄산 생막걸리'], [5, 5, 5, 5, 2]),
  SHFU: profile('SHFU', '탄산 톡톡 딸기 요거트', '진하고 화사한 맛을 즐기는 감각적인 미식가', '딸기 요거트처럼 밀도 있고 달콤한 막걸리를 사랑하는 당신! 입안을 부드럽게 감싸는 진한 단맛과 걸쭉한 바디감, 기분 좋게 톡 쏘는 탄산의 조화가 딱 맞을 때 심쿵해요. 한 입 머금으면 가득 퍼지는 향긋한 과일 향과 새콤달콤한 풍미에 매번 감탄! 산뜻한 디저트와 함께할 때 SHFU의 매력이 더욱 빛나요!', ['#진한달콤함', '#요거트질감', '#과일향가득', '#탄산의조화', '#밀도있는맛', '#새콤달콤풍미'], ['딸기 탄산막걸리', '복숭아 생막걸리', '유자 탁주'], [5, 5, 5, 2, 5]),
  SHMC: profile('SHMC', '쫀득쫀득 꿀 찹쌀떡', '전통의 깊이를 음미하는 찹쌀떡 같은 미식가', '쫀득쫀득 찹쌀떡처럼 농밀하고 포근한 막걸리를 사랑하는 당신! 탄산 없이 부드럽게 감기는 목넘김과 찰진 단맛이 딱 맞을 때 행복이 차오르죠. 여러 잔보다 한 잔을 마셔도 그 깊이를 온전히 느끼고 싶어 하며, 시간이 지날수록 입안에 남는 고소한 여운을 음미하는 시간이 최고예요. 클래식한 매력의 탁주가 SHMC의 최고의 파트너예요!', ['#농밀한단맛', '#크리미한질감', '#탄산없음', '#곡물본연의맛', '#포근한목넘김', '#고소한풍미'], ['찹쌀탁주', '원주 막걸리', '고구마 막걸리'], [5, 5, 1, 5, 2]),
  SHMU: profile('SHMU', '포근포근 꽃복숭아', '포근하고 향긋한 복숭아', '폭신폭신한 복숭아 솜털처럼 부드럽고 향긋한 당신! 자극적인 것보다 포근하게 감싸주는 크리미한 질감을 사랑해요. 과일향이나 꽃향이 은은하게 스칠 때 심쿵하며, 단맛과 산미의 균형이 딱 맞을 때 행복 200%예요. 조용한 분위기에서 향을 천천히 음미하는 시간이 최고인 SHMU는 막걸리 세계의 힐링 요정이에요!', ['#부드러운단맛', '#산미의조화', '#무탄산의편안함', '#화사한과일향', '#크리미한목넘김', '#감각적인향'], ['망고 막걸리', '블루베리 탁주', '샤인머스캣 막걸리'], [5, 5, 1, 2, 5]),
  SLFC: profile('SLFC', '청량함 가득 사과 푸딩', '활기찬 일상을 즐기는 데일리 막걸러', '사과 푸딩처럼 산뜻하고 가볍게 즐기는 막걸리를 사랑하는 당신! 가벼운 바디감 덕분에 마시는 내내 부담이 없고, 톡 쏘는 탄산과 달콤한 맛은 기분 전환에 최고예요. 친구들과의 시끌벅적한 모임이나 야식 타임에 딱 어울리며, 언제 마셔도 기분 좋은 활력을 불어넣어 주는 SLFC는 막걸리 세계의 비타민이에요!', ['#산뜻한단맛', '#가벼운목넘김', '#청량한탄산', '#고소한끝맛', '#부담없는한잔', '#데일리막걸리'], ['저도수 생막걸리', '쌀 막걸리', '캔 막걸리'], [4, 2, 5, 4, 2]),
  SLFU: profile('SLFU', '팝핑 과일 에이드', '톡톡 튀는 팝핑 칵테일 마스터', '팝핑 캔디처럼 입 안에서 톡톡 터지는 청량함을 사랑하는 당신! 가벼운 목넘김 속에 터지는 탄산과 화사한 과일 향에 매번 설레요. 구수한 전통향보다 새콤달콤하고 세련된 풍미를 선호하며, 술 마시는 것 자체가 하나의 놀이처럼 즐거운 SLFU! 예쁜 잔에 담긴 과일 탄산막걸리 한 잔으로 감각적인 시간을 완성해요!', ['#상큼한탄산', '#가벼운질감', '#독특한부재료', '#청량감폭발', '#화사한향기', '#트렌디한맛'], ['자몽 막걸리', '레몬 탁주', '오미자 탄산막걸리'], [4, 2, 5, 1, 5]),
  SLMC: profile('SLMC', '햇살 머금은 식혜', '정갈한 여유를 아는 햇살 같은 휴식주의자', '햇살 머금은 식혜처럼 은은하고 정갈한 단맛에서 평온함을 찾는 당신! 탄산의 자극 없이 깔끔하게 떨어지는 맛이 마음을 차분하게 가라앉혀 줄 때 행복해요. 곡물 본연의 깔끔한 향기를 사랑하며, 조용한 분위기에서 차분하게 즐기는 시간이 최고인 SLMC는 막걸리 세계의 힐링 존재예요!', ['#은은한단맛', '#맑은목넘김', '#탄산없음', '#깔끔한곡물향', '#부드러운여운', '#정갈한맛'], ['맑은 탁주', '단술', '저도수 쌀막걸리'], [4, 2, 1, 4, 2]),
  SLMU: profile('SLMU', '산들바람 머금은 화전', '산들바람을 닮은 감성 낭만가', '화전 위 꽃잎처럼 가볍고 향긋한 막걸리를 사랑하는 당신! 가볍고 산뜻한 목넘김 끝에 예상치 못한 꽃향기나 허브향이 스칠 때 심쿵해요. 탄산 없이 매끄럽게 넘어가는 질감과 은은한 산미, 단맛의 조화가 딱 맞을 때 행복 200%! 무거운 술보다 가볍게 기분 내고 싶은 날, SLMU인 당신은 공간을 향긋하게 채우는 능력이 있어요!', ['#향긋한산미', '#가벼운단맛', '#무탄산의매력', '#꽃향가득', '#산뜻한마무리', '#세련된풍미'], ['꽃잎 막걸리', '허브 탁주', '사과 막걸리'], [4, 2, 1, 2, 5]),
  DHFC: profile('DHFC', '바삭하게 터지는 현미 누룽지', '막걸리 본연의 강렬함을 즐기는 누룽지 같은 정통파', '바삭하게 터지는 현미 누룽지처럼 강렬하고 묵직한 막걸리를 사랑하는 당신! 단맛에 가려지지 않은 본연의 쌉쌀함, 묵직한 바디감, 목을 치고 올라오는 강력한 탄산 조합에 짜릿한 쾌감을 느껴요. 누룩의 쌉쌀함과 알코올의 힘을 정면으로 마주하는 걸 두려워하지 않는 DHFC인 당신은 진정한 술꾼들이 인정하는 막걸리 세계의 호랑이예요!', ['#드라이한맛', '#묵직한바디', '#강한탄산', '#전통의맛', '#깊은풍미', '#청량한타격감'], ['고도수 생막걸리', '드라이한 탁주', '호밀 막걸리'], [1, 5, 5, 5, 2]),
  DHFU: profile('DHFU', '반전매력 고추냉이', '겉은 쿨, 속은 반전 매력 고추냉이', '뻔한 건 노노! 겉으로는 쿨해 보이지만 한 모금 마시면 "이게 무슨 맛이지?!" 하고 빠져드는 반전 매력의 소유자인 당신! 묵직한 무게감 위에 톡 쏘는 탄산과 독특한 산미 조합에 심장이 두근두근해요. 남들이 쉽게 시도 못 하는 강렬한 개성의 막걸리야말로 당신의 최애! 복잡할수록 더 맛있는 막걸리를 선호하는 DHFU인 당신은 알면 알수록 매력 터져요!', ['#깔끔한맛', '#진한농도', '#이색적인산미', '#탄산의자극', '#독특한여운', '#강렬한개성'], ['오미자 탄산막걸리', '생강 탁주', '쑥 막걸리'], [1, 5, 5, 2, 5]),
  DHMC: profile('DHMC', '묵묵한 바위 속 숭늉', '흔들리지 않는 숭늉 같은 정통파 애호가', '묵묵한 바위처럼 단단하고 진중한 막걸리를 사랑하는 당신! 인위적인 감미료나 탄산 없이 오직 쌀, 누룩, 물이 만들어내는 담백하고 묵직한 세계가 최고예요. 걸쭉하게 입안을 채우는 질감과 누룩 특유의 구수한 향이 스칠 때 믿음직한 신뢰감이 차오르죠. 유행에 흔들리지 않고 묵묵히 자신의 길을 가는 DHMC인 당신은 막걸리 세계의 소나무예요!', ['#담백함의정석', '#걸쭉한바디', '#탄산없음', '#진한누룩향', '#묵직한여운', '#어른의맛'], ['무감미료 탁주', '고도수 원주', '옥수수 막걸리'], [1, 5, 1, 5, 2]),
  DHMU: profile('DHMU', '안개 낀 숲속의 황금사과', '안갯속 보물을 찾는 감각적인 미식 탐험가', '안개 낀 숲속 황금사과처럼 숨겨진 매력을 찾아내는 당신! 달지 않고 묵직한 맛 뒤에 숨겨진 미세한 산미와 이색적인 향을 발견할 때 심쿵해요. 탄산의 방해 없이 술의 구조감을 온전히 느끼는 걸 좋아하며, 첫맛보다 끝에서 느껴지는 독특한 여운에 집중하는 DHMU인 당신은 천천히 음미할수록 드러나는 다채로운 레이어가 지적인 즐거움까지 선사해요!', ['#드라이한산미', '#묵직한질감', '#무탄산', '#은은한이색향', '#깊은개성', '#차분한마무리'], ['산미 특화 막걸리', '약재 향 탁주', '드라이 과일막걸리'], [1, 5, 1, 2, 5]),
  DLFC: profile('DLFC', '청량한 대나무 숲의 차', '청량한 대나무 숲을 닮은 깔끔한 사색가', '대나무 숲의 시원한 바람처럼 청량하고 깔끔한 막걸리를 사랑하는 당신! 단맛을 걷어낸 자리에 남은 탄산과 가벼운 목넘김이 머릿속을 맑게 비워줄 때 최고예요. 누룩의 고소한 향이 은은하게 감돌며 끝맛이 산뜻해 어떤 음식과도 완벽한 조화! 군더더기 없는 깔끔함이 필요한 친구에게는 DLFC인 당신이 언제나 함께해요!', ['#깔끔담백', '#가벼운목넘김', '#청량한탄산', '#고소한누룩향', '#산뜻한타격감', '#순수한맛'], ['가벼운 드라이 막걸리', '탄산 약주', '쌀 생막걸리'], [1, 2, 5, 5, 2]),
  DLFU: profile('DLFU', '차가운 도시의 샹그리아', '도시를 닮은 세련된 샹그리아 마니아', '차갑고 세련된 샹그리아처럼 막걸리에서도 감각적인 산미를 찾는 당신! 가볍고 달지 않은 베이스 위에 탄산이 터지며 퍼지는 화사한 과일 향에 매번 설레요. 무거운 질감은 노노, 입안을 리프레시해 주는 상큼한 마무리가 최고인 DLFU! 트렌디한 다이닝 바에서 즐기는 한 잔처럼 막걸리 타임이 항상 스타일리시해요!', ['#드라이상큼', '#가벼운바디', '#강한탄산', '#세련된산미', '#개성있는향', '#도회적인맛'], ['드라이 유자막걸리', '진저 탁주', '탄산 베리막걸리'], [1, 2, 5, 2, 5]),
  DLMC: profile('DLMC', '대숲에 앉은 맑은 백설기', '맑고 정갈한 백설기 같은 미니멀리스트', '대숲에 앉은 백설기처럼 맑고 순수한 막걸리를 사랑하는 당신! 단맛, 탄산, 무게감을 모두 덜어낸 자리에 남은 가장 정갈한 막걸리의 정수가 최고예요. 물처럼 매끄럽게 넘어가는 질감과 은은한 곡물 향이 스칠 때 마음이 차분하게 가라앉죠. 자극적인 일상에서 벗어나 순수한 본연의 맛에 집중하고 싶은 날, DLMC인 당신은 진정한 자유를 느끼는 걸 선호해요!', ['#정갈한깔끔함', '#물처럼맑음', '#탄산없음', '#정통곡물향', '#담백한끝맛', '#고고한풍미'], ['정통 드라이 탁주', '맑은 막걸리', '가벼운 누룩주'], [1, 2, 1, 5, 2]),
  DLMU: profile('DLMU', '빗소리 들리는 다실의 꽃차', '빗소리 속 꽃차를 닮은 감성 철학자', '빗소리 들리는 다실의 꽃차처럼 조용하고 섬세한 막걸리를 사랑하는 당신! 탄산 없이 조용하게 스미는 목넘김과 그 뒤에 피어오르는 세련된 산미, 독특한 허브의 여운에 깊은 사색에 빠져들어요. 요란하지 않지만 자신만의 확고한 향을 지닌 막걸리처럼, DLMU인 당신은 조용하지만 강한 취향의 힘을 가진 멋진 미식가예요!', ['#드라이한향기', '#가벼운질감', '#무탄산의고요', '#세련된산미', '#깔끔한개성', '#차분한취향'], ['산미 있는 가벼운 탁주', '허브 드라이막걸리', 'Tea 막걸리'], [1, 2, 1, 2, 5]),
};

export const BTI_RESULT_TYPES = Object.keys(BTI_RESULTS);
const BTI_DOSAGE_SUFFIXES = ['M', 'B'];

export function normalizeBtiTasteAxisValue(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  if (value > 5) {
    const percentValue = Math.max(0, Math.min(100, value));
    return Math.max(1, Math.min(5, Math.round((percentValue / 100) * 4 + 1)));
  }
  return Math.max(1, Math.min(5, value));
}

function normalizeSulbtiInput(type?: BtiTypeInput) {
  const raw = Array.isArray(type) ? type[0] : type;
  return raw?.trim().toUpperCase().replace(/^JD-/, '') || '';
}

export function resolveBtiType(type?: BtiTypeInput) {
  const code = normalizeSulbtiInput(type);
  const baseCode = code.split('-')[0];
  return BTI_RESULTS[baseCode] ? baseCode : null;
}

export function resolveSulbtiCode(type?: BtiTypeInput) {
  const code = normalizeSulbtiInput(type);
  const [baseCode, dosageCode] = code.split('-');
  if (!BTI_RESULTS[baseCode]) return null;
  if (!dosageCode) return baseCode;
  if (BTI_DOSAGE_SUFFIXES.includes(dosageCode)) return `${baseCode}-${dosageCode}`;
  return null;
}

export function getBtiDisplayType(type?: BtiTypeInput) {
  const code = resolveSulbtiCode(type);
  if (code) return code;
  const baseCode = resolveBtiType(type);
  return baseCode || 'SLMU';
}

export function normalizeBtiType(type?: BtiTypeInput) {
  return resolveBtiType(type) || 'SLMU';
}

export function getBtiResult(type?: BtiTypeInput) {
  return BTI_RESULTS[normalizeBtiType(type)];
}

export function buildAnswersWithCustomInputs(
  answers: BtiAnswers,
  customInputs: Record<number, string>
): BtiAnswers {
  return Object.entries(customInputs).reduce<BtiAnswers>((nextAnswers, [id, value]) => {
    const questionId = Number(id);
    const trimmed = value.trim();
    if (!trimmed) return nextAnswers;
    const current = nextAnswers[questionId];
    const list = Array.isArray(current) ? current : [];
    if (list.includes(trimmed)) return nextAnswers;
    return { ...nextAnswers, [questionId]: [...list, trimmed] };
  }, answers);
}

export function calculateSulbti(answers: BtiAnswers) {
  void answers;
  return BTI_RESULT_TYPES[Math.floor(Math.random() * BTI_RESULT_TYPES.length)] || 'SLMU';
}
