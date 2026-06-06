export interface Chapter {
  id: string;
  title: string;
  description: string;
  targetFocus: string; // Focus area for Gemini generation (e.g. grammar rule, word list, theme)
}

export interface Book {
  id: string;
  title: string;
  category: 'vocabulary' | 'grammar' | 'expression' | 'basic' | 'speaking';
  categoryLabel: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyLabel: string;
  description: string;
  emoji: string;
  chapters: Chapter[];
}

export const booksData: Book[] = [
  {
    id: 'vocab-1000',
    title: '기적의 말하기 영단어 1000',
    category: 'vocabulary',
    categoryLabel: '단어',
    difficulty: 'beginner',
    difficultyLabel: '초급',
    description: '말문이 트이기 위해 꼭 알아야 하는 핵심 영단어 1000개와 활용 예문 학습',
    emoji: '🍎',
    chapters: [
      { id: 'ch1', title: '일상 필수 기본 동사', description: '자주 쓰이는 기본 동작과 동사', targetFocus: 'get, take, make, do, have, go, come 등 기본 동사' },
      { id: 'ch2', title: '성격과 상태 표현 형용사', description: '사물과 사람의 상태를 설명하는 형용사', targetFocus: 'happy, sad, busy, free, tired 등 기본 형용사' },
      { id: 'ch3', title: '하루 일과 필수 명사', description: '집, 학교, 직장에서 매일 쓰는 명사', targetFocus: 'routine, home, office, meal, time 등 일상 명사' },
      { id: 'ch4', title: '감정과 기분 단어', description: '내 기분과 감정을 명확히 전하는 어휘', targetFocus: 'excited, nervous, worried, comfortable 등 감정 표현' },
      { id: 'ch5', title: '의견과 판단 표현', description: '생각이나 가치를 평가할 때 쓰는 형용사/부사', targetFocus: 'important, useful, difficult, easy, usually 등 판단 어휘' }
    ]
  },
  {
    id: 'grammar-1',
    title: '말하기 영문법 1',
    category: 'grammar',
    categoryLabel: '문법',
    difficulty: 'beginner',
    difficultyLabel: '초급',
    description: '가장 기본적인 be동사와 일반동사 활용을 통한 영문법 기초',
    emoji: '📝',
    chapters: [
      { id: 'ch1', title: 'be동사 현재형과 부정문', description: '나와 상태에 대해 말하기', targetFocus: 'am/is/are, am not/isn\'t/aren\'t 패턴' },
      { id: 'ch2', title: 'be동사 의문문', description: '상대방의 상태 물어보기', targetFocus: 'Are you...?, Is he/she...? 의문문 구조' },
      { id: 'ch3', title: '일반동사 현재시제와 3인칭 단수', description: '반복되는 습관과 사실 말하기', targetFocus: 'like, work, live 등 일반동사 원형 및 3인칭 단수 -s/-es 규칙' },
      { id: 'ch4', title: '일반동사의 부정문과 의문문', description: '아닌 것 말하고 물어보기', targetFocus: 'don\'t/doesn\'t, Do you...? / Does he/she...?' }
    ]
  },
  {
    id: 'grammar-2',
    title: '말하기 영문법 2',
    category: 'grammar',
    categoryLabel: '문법',
    difficulty: 'intermediate',
    difficultyLabel: '중급',
    description: '조동사와 의문사를 사용하여 다채로운 문장 구조 형성하기',
    emoji: '💡',
    chapters: [
      { id: 'ch1', title: '능력과 미래를 나타내는 조동사', description: '할 수 있는 일과 예정된 미래 말하기', targetFocus: 'can/can\'t, will/won\'t 및 be going to 차이와 활용' },
      { id: 'ch2', title: '의무와 충고의 조동사', description: '해야 할 일과 조언 건네기', targetFocus: 'must, have to, should, don\'t have to' },
      { id: 'ch3', title: '정보를 묻는 의문사 의문문', description: '구체적인 질문 던지기', targetFocus: 'What, Where, When, Who, Why, How 의문사 활용 구조' },
      { id: 'ch4', title: '과거시제 규칙과 불규칙', description: '이미 지난 일에 대해 소통하기', targetFocus: 'regular verb -ed, irregular verbs (went, ate, saw) 및 did/didn\'t 활용' }
    ]
  },
  {
    id: 'grammar-3',
    title: '말하기 영문법 3',
    category: 'grammar',
    categoryLabel: '문법',
    difficulty: 'intermediate',
    difficultyLabel: '중급',
    description: '현재완료와 수동태 등 입체적인 문법 구조 적용',
    emoji: '🌀',
    chapters: [
      { id: 'ch1', title: '현재완료 시제 (경험/계속)', description: '과거부터 지금까지 이어진 경험 말하기', targetFocus: 'have/has + p.p., ever, never, since, for' },
      { id: 'ch2', title: '수동태 문장 말하기', description: '동작을 받는 대상 강조하기', targetFocus: 'be + p.p. (+ by...) 능동태의 수동태 변환 연습' },
      { id: 'ch3', title: '관계대명사 기본 (who/which)', description: '명사에 구체적인 설명 덧붙이기', targetFocus: '주격/목적격 관계대명사 who, which, that' },
      { id: 'ch4', title: '가정법 과거와 조건문', description: '현재 실현 불가능한 상상과 조건', targetFocus: 'If I were/had..., I would... 구조 및 단순 조건문' }
    ]
  },
  {
    id: 'grammar-4',
    title: '말하기 영문법 4',
    category: 'grammar',
    categoryLabel: '문법',
    difficulty: 'advanced',
    difficultyLabel: '고급',
    description: '분사구문, 관계부사, 고급 조동사 등 정교하고 세련된 문장 구사',
    emoji: '🚀',
    chapters: [
      { id: 'ch1', title: '동시동작과 이유의 분사구문', description: '두 가지 일을 동시에 매끄럽게 연결하기', targetFocus: 'doing..., having p.p.... 형태의 분사구문 구성과 해석' },
      { id: 'ch2', title: '관계부사의 활용 (where, when, why)', description: '공간, 시간, 이유를 디테일하게 묘사하기', targetFocus: 'where, when, why, how 관계부사 절' },
      { id: 'ch3', title: '조동사 + have p.p. 패턴', description: '과거에 대한 후회나 강력한 추측 말하기', targetFocus: 'should have p.p., must have p.p., cannot have p.p.' },
      { id: 'ch4', title: '문장 구조의 일치와 도치', description: '강조를 위한 문장 순서 바꾸기', targetFocus: 'Neither/So do I, 부정어 도치 (Never have I...)' }
    ]
  },
  {
    id: 'expr-sense',
    title: '영어 단어의 혁신 소통 - 감각표현',
    category: 'expression',
    categoryLabel: '표현',
    difficulty: 'intermediate',
    difficultyLabel: '중급',
    description: '오감(시각, 청각, 후각, 미각, 촉각)을 활용한 생생하고 직관적인 영어 표현',
    emoji: '👁️',
    chapters: [
      { id: 'ch1', title: '눈으로 보고 느끼는 시각 표현', description: '외양, 빛깔, 첫인상 묘사하기', targetFocus: 'look like, spot, notice, colorful, bright, dim 감각 표현' },
      { id: 'ch2', title: '귀로 듣고 전하는 청각 표현', description: '소리, 목소리, 대화 묘사하기', targetFocus: 'sound like, noisy, quiet, whisper, echo, deafening 표현' },
      { id: 'ch3', title: '코와 입으로 느끼는 맛/냄새 표현', description: '음식 맛과 향기 생생하게 설명하기', targetFocus: 'taste like, smell of, sweet, salty, spicy, fragrant, stinky 표현' },
      { id: 'ch4', title: '몸으로 와닿는 촉각과 느낌', description: '온도, 질감, 몸의 물리적 느낌 표현', targetFocus: 'feel like, soft, rough, smooth, freezing, sticky, painful 표현' }
    ]
  },
  {
    id: 'expr-situation',
    title: '영어 단어의 혁신 소통 - 상황표현',
    category: 'expression',
    categoryLabel: '표현',
    difficulty: 'intermediate',
    difficultyLabel: '중급',
    description: '외국 여행이나 비즈니스에서 맞닥뜨리는 실전 상황별 생존 영어',
    emoji: '✈️',
    chapters: [
      { id: 'ch1', title: '공항 및 기내에서', description: '입국 심사, 탑승 수속, 기내 요청 사항', targetFocus: 'boarding pass, check-in, immigration, window/aisle seat' },
      { id: 'ch2', title: '식당에서 주문하고 결제하기', description: '예약, 주문, 컴플레인, 분할 계산', targetFocus: 'make a reservation, order, separate bills, keeping the change' },
      { id: 'ch3', title: '쇼핑몰과 매장에서', description: '제품 탐색, 입어보기, 환불/교환 요구', targetFocus: 'try it on, look for, refund, exchange, size/color options' },
      { id: 'ch4', title: '호텔 체크인과 체크아웃', description: '예약 확인, 룸서비스 요청, 편의시설 안내', targetFocus: 'check in/out, room service, amenities, deposit, luggage storage' }
    ]
  },
  {
    id: 'expr-leisure',
    title: '영어 단어의 혁신 소통 - 여가표현',
    category: 'expression',
    categoryLabel: '표현',
    difficulty: 'intermediate',
    difficultyLabel: '중급',
    description: '취미 생활, 스포츠, 휴가, 여가 시간을 말할 때 쓰는 풍부한 표현',
    emoji: '🍿',
    chapters: [
      { id: 'ch1', title: '영화, 책, 문화생활 즐기기', description: '좋아하는 영화 장르나 책에 대한 감상 공유', targetFocus: 'action/romance, based on a true story, recommendation, masterpiece' },
      { id: 'ch2', title: '스포츠와 취미 공유하기', description: '하고 있는 운동과 일과 후 흥미거리 소개', targetFocus: 'play/do/go sports, work out, hobby, dynamic, relax' },
      { id: 'ch3', title: '여행 계획과 휴가 추억', description: '다음 여행 계획 및 다녀온 곳 추억하기', targetFocus: 'go on vacation, itinerary, historic site, souvenir, local food' },
      { id: 'ch4', title: '인터넷과 SNS 활동', description: '인터넷 서핑과 소셜 네트워크 대화 나누기', targetFocus: 'post, scroll through, subscribe, comment, online gaming' }
    ]
  },
  {
    id: 'expr-daily',
    title: '영어 단어의 혁신 소통 - 일상표현',
    category: 'expression',
    categoryLabel: '표현',
    difficulty: 'intermediate',
    difficultyLabel: '중급',
    description: '아침 기상부터 밤 취침까지 하루 24시간 동안의 일상 행동 표현',
    emoji: '⏰',
    chapters: [
      { id: 'ch1', title: '아침 일과와 출근 준비', description: '기상부터 출근/등교하기 전까지의 행동', targetFocus: 'wake up vs get up, hit the snooze, grab breakfast, commute' },
      { id: 'ch2', title: '회사 및 직장 생활', description: '회의 참여, 보고서 작성, 동료와의 대화', targetFocus: 'attend a meeting, file a report, chat with colleagues, lunch break' },
      { id: 'ch3', title: '퇴근 후 저녁 시간', description: '장을 보고 요리하거나 약속 잡기', targetFocus: 'hang out with friends, buy groceries, cook dinner, unwind' },
      { id: 'ch4', title: '밤 일과와 수면 습관', description: '하루를 마무리하고 수면에 들기', targetFocus: 'take a shower, read a book, set the alarm, fall asleep, toss and turn' }
    ]
  },
  {
    id: 'basic-grammar',
    title: '시원스쿨 기초영어법',
    category: 'basic',
    categoryLabel: '기초영어',
    difficulty: 'beginner',
    difficultyLabel: '초급',
    description: '단어를 연결하는 초간단 결합 법칙을 통해 기초 영어회화 입문',
    emoji: '👶',
    chapters: [
      { id: 'ch1', title: '단어 두 개로 첫걸음', description: '주어와 동사 연결하기', targetFocus: 'I go, She runs, They study 등 기본 결합' },
      { id: 'ch2', title: '을/를 대상 붙이기 (3형식)', description: '무엇을 하는지 밝히기', targetFocus: 'I want water, We like English 등 목적어 결합' },
      { id: 'ch3', title: '위치와 시간 덧붙이기 (전치사)', description: '어디서 언제 일어났는지 확장하기', targetFocus: 'in, at, on, to 전치사 기본 규칙과 결합' },
      { id: 'ch4', title: '의도 표현하기 (want to/have to)', description: '하고 싶은 일과 해야 하는 일 말하기', targetFocus: 'I want to + 동사, I have to + 동사 구조화' }
    ]
  },
  {
    id: 'speaking-method',
    title: '스피킹 통암기 학습법',
    category: 'speaking',
    categoryLabel: '스피킹',
    difficulty: 'intermediate',
    difficultyLabel: '중급',
    description: '유용한 핵심 영어 문장 템플릿과 청크 단위 통암기를 통한 유창성 훈련',
    emoji: '📣',
    chapters: [
      { id: 'ch1', title: '단어 결합형 핵심 청크', description: '자주 쓰이는 숙어 형태 청크 통째로 암기', targetFocus: 'look forward to, make sure to, run out of 등 청크 숙지' },
      { id: 'ch2', title: '문장 완성형 유용한 템플릿', description: '패턴만 알면 바로 나오는 문장 뼈대 연습', targetFocus: 'It is important to..., I was wondering if..., How about...?' },
      { id: 'ch3', title: '상황 문맥에 맞는 대화 적용', description: '짧은 대화 속에서 흐름에 맞게 적용하기', targetFocus: 'A-B 대화 롤플레이를 통한 청크 실전 적용' },
      { id: 'ch4', title: '자유 주제에 템플릿 활용하기', description: '자신의 생각을 템플릿을 써서 길게 스피킹하기', targetFocus: '내 취향/의견 피력 시 청크/템플릿 활용하여 3문장 이상 이어 말하기' }
    ]
  }
];
