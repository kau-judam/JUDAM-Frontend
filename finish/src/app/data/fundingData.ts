export interface FundingProject {
  id: number;
  title: string;
  brewery: string;
  location: string;
  category: string;
  image: string;
  goalAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  status: string;
}

export const fundingProjects: FundingProject[] = [
  {
    id: 1,
    title: "봄을 담은 벚꽃 막걸리 프로젝트",
    brewery: "꽃샘양조장",
    location: "경기 양평",
    category: "막걸리",
    image:
      "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwYm90dGxlcyUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzQ1OTU2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 4350000,
    backers: 156,
    daysLeft: 12,
    status: "진행 중",
  },
  {
    id: 2,
    title: "전통 누룩의 재발견 - 현대적 막걸리",
    brewery: "술샘양조장",
    location: "경기 양평",
    category: "막걸리",
    image:
      "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGxpcXVvciUyMGJvdHRsZSUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NTk1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 3750000,
    backers: 127,
    daysLeft: 18,
    status: "진행 중",
  },
  {
    id: 3,
    title: "꽃향기 가득한 약주 프로젝트",
    brewery: "꽃담양조",
    location: "전북 전주",
    category: "약주",
    image:
      "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGFsY29ob2wlMjBicmV3aW5nJTIwcHJvY2Vzc3xlbnwxfHx8fDE3NzQ1OTU2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 8000000,
    currentAmount: 6400000,
    backers: 203,
    daysLeft: 8,
    status: "진행 중",
  },
  {
    id: 4,
    title: "증류식 소주의 부활",
    brewery: "안동양조",
    location: "경북 안동",
    category: "소주",
    image:
      "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwd2luZSUyMGZlcm1lbnRhdGlvbiUyMGNlcmFtaWMlMjBqYXJ8ZW58MXx8fHwxNzc0NTk1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 10000000,
    currentAmount: 4500000,
    backers: 89,
    daysLeft: 22,
    status: "진행 중",
  },
  {
    id: 5,
    title: "산사 막걸리 프로젝트",
    brewery: "산사양조",
    location: "강원 평창",
    category: "막걸리",
    image:
      "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYWxjb2hvbCUyMGJvdHRsZSUyMGVsZWdhbnQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc0NTk1Njg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 4000000,
    currentAmount: 4500000,
    backers: 178,
    daysLeft: 0,
    status: "성공",
  },
  {
    id: 6,
    title: "한라봉 소주 특별판",
    brewery: "제주양조",
    location: "제주",
    category: "소주",
    image:
      "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwYm90dGxlJTIwcG91cmluZyUyMGdsYXNzJTIwZGFya3xlbnwxfHx8fDE3NzQ1OTU2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 7000000,
    currentAmount: 8200000,
    backers: 234,
    daysLeft: 0,
    status: "성공",
  },
];
