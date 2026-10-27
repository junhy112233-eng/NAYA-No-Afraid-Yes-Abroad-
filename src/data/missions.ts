export interface Mission {
  id: number;
  partner: string;
  targetSentence: string;
  koreanMeaning: string;
  keyWords: string[];
  smallWords: string[];
  firstLetterHint: string;
  chunks: [string, string];
  mapType:
    | 'traffic-left'
    | 'crosswalk'
    | 'crossroads'
    | 't-junction'
    | 'roundabout'
    | 'lane'
    | 'pedestrian'
    | 'uphill'
    | 'across-from'
    | 'downhill';
  locationName: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 1,
    partner: 'Excuse me. Where is the bank?',
    targetSentence: 'Turn left at the traffic lights.',
    koreanMeaning: '신호등에서 좌회전하세요.',
    keyWords: ['left', 'traffic lights'],
    smallWords: ['at', 'the'],
    firstLetterHint: 'Turn l___ at the traffic lights.',
    chunks: ['Turn left', 'at the traffic lights.'],
    mapType: 'traffic-left',
    locationName: 'City Bank',
  },
  {
    id: 2,
    partner: 'How can I get to the station?',
    targetSentence: 'Go straight across the crosswalk.',
    koreanMeaning: '횡단보도를 건너서 직진하세요.',
    keyWords: ['straight', 'crosswalk'],
    smallWords: ['across', 'the'],
    firstLetterHint: 'Go s_______ across the crosswalk.',
    chunks: ['Go straight', 'across the crosswalk.'],
    mapType: 'crosswalk',
    locationName: 'Subway Station',
  },
  {
    id: 3,
    partner: 'What should I do at the next intersection?',
    targetSentence: 'Turn right at the crossroads.',
    koreanMeaning: '다음 사거리에서 우회전하세요.',
    keyWords: ['right', 'crossroads'],
    smallWords: ['at', 'the'],
    firstLetterHint: 'Turn r____ at the crossroads.',
    chunks: ['Turn right', 'at the crossroads.'],
    mapType: 'crossroads',
    locationName: 'Main Crossroads',
  },
  {
    id: 4,
    partner: 'Where should I turn?',
    targetSentence: 'Turn left at the T-junction.',
    koreanMeaning: '삼거리에서 좌회전하세요.',
    keyWords: ['left', 'T-junction'],
    smallWords: ['at', 'the'],
    firstLetterHint: 'Turn l___ at the T-junction.',
    chunks: ['Turn left', 'at the T-junction.'],
    mapType: 't-junction',
    locationName: 'T-Junction Ave',
  },
  {
    id: 5,
    partner: 'How do I get to the museum?',
    targetSentence: 'Go around the roundabout.',
    koreanMeaning: '회전교차로를 따라 돌아가세요.',
    keyWords: ['around', 'roundabout'],
    smallWords: ['go', 'the'],
    firstLetterHint: 'Go a_____ the roundabout.',
    chunks: ['Go around', 'the roundabout.'],
    mapType: 'roundabout',
    locationName: 'Art Museum',
  },
  {
    id: 6,
    partner: 'Which lane should I use?',
    targetSentence: 'Stay in the left lane.',
    koreanMeaning: '왼쪽 차로를 유지하세요.',
    keyWords: ['left', 'lane'],
    smallWords: ['in', 'the'],
    firstLetterHint: 'Stay in the l___ lane.',
    chunks: ['Stay in', 'the left lane.'],
    mapType: 'lane',
    locationName: 'Highway Blvd',
  },
  {
    id: 7,
    partner: 'Where can I cross the road?',
    targetSentence: 'Use the pedestrian crossing.',
    koreanMeaning: '횡단보도를 이용하세요.',
    keyWords: ['pedestrian', 'crossing'],
    smallWords: ['the'],
    firstLetterHint: 'Use the p_________ crossing.',
    chunks: ['Use the', 'pedestrian crossing.'],
    mapType: 'pedestrian',
    locationName: 'Town Square',
  },
  {
    id: 8,
    partner: 'Is the park far from here?',
    targetSentence: 'Walk uphill past the traffic lights.',
    koreanMeaning: '신호등을 지나 오르막길로 걸어가세요.',
    keyWords: ['uphill', 'past', 'traffic lights'],
    smallWords: ['the'],
    firstLetterHint: 'Walk u_____ past the traffic lights.',
    chunks: ['Walk uphill', 'past the traffic lights.'],
    mapType: 'uphill',
    locationName: 'Sunny Park Hill',
  },
  {
    id: 9,
    partner: 'How do I find the library?',
    targetSentence: 'It is across from the post office.',
    koreanMeaning: '우체국 맞은편에 있어요.',
    keyWords: ['across from', 'post office'],
    smallWords: ['it', 'is', 'the'],
    firstLetterHint: 'It is a_____ f___ the post office.',
    chunks: ['It is across from', 'the post office.'],
    mapType: 'across-from',
    locationName: 'Public Library',
  },
  {
    id: 10,
    partner: 'How can I get to the bus stop?',
    targetSentence: 'Go downhill and turn right at the corner.',
    koreanMeaning: '내리막길로 내려가서 모퉁이에서 우회전하세요.',
    keyWords: ['downhill', 'right', 'corner'],
    smallWords: ['and', 'at', 'the'],
    firstLetterHint: 'Go d_______ and turn r____ at the corner.',
    chunks: ['Go downhill and', 'turn right at the corner.'],
    mapType: 'downhill',
    locationName: 'Bus Terminal',
  },
];

export interface VocabWord {
  english: string;
  korean: string;
  example: string;
  meaning: string;
}

export const VOCABULARY_LIST: VocabWord[] = [
  {
    english: 'Traffic lights',
    korean: '신호등',
    example: 'Turn left at the traffic lights.',
    meaning: '신호등에서 좌회전하세요.',
  },
  {
    english: 'Crosswalk / Pedestrian crossing',
    korean: '횡단보도',
    example: 'Use the pedestrian crossing.',
    meaning: '횡단보도를 이용하세요.',
  },
  {
    english: 'Intersection / Crossroads',
    korean: '교차로 / 사거리',
    example: 'Turn right at the crossroads.',
    meaning: '사거리에서 우회전하세요.',
  },
  {
    english: 'T-junction',
    korean: 'T자형 삼거리',
    example: 'Turn left at the T-junction.',
    meaning: '삼거리에서 좌회전하세요.',
  },
  {
    english: 'Roundabout',
    korean: '회전교차로',
    example: 'Go around the roundabout.',
    meaning: '회전교차로를 따라 돌아가세요.',
  },
  {
    english: 'Lane',
    korean: '차로 (차선)',
    example: 'Stay in the left lane.',
    meaning: '왼쪽 차로를 유지하세요.',
  },
  {
    english: 'Across from / Opposite',
    korean: '맞은편',
    example: 'It is across from the post office.',
    meaning: '우체국 맞은편에 있어요.',
  },
  {
    english: 'Corner',
    korean: '모퉁이',
    example: 'Turn right at the corner.',
    meaning: '모퉁이에서 우회전하세요.',
  },
  {
    english: 'Uphill / Downhill',
    korean: '오르막길 / 내리막길',
    example: 'Walk uphill past the park.',
    meaning: '공원을 지나 오르막길로 걸어가세요.',
  },
  {
    english: 'Past',
    korean: '~을 지나서',
    example: 'Walk past the bookstore.',
    meaning: '서점을 지나서 걸어가세요.',
  },
  {
    english: 'Go straight',
    korean: '직진하다',
    example: 'Go straight across the crosswalk.',
    meaning: '횡단보도를 건너서 직진하세요.',
  },
];
