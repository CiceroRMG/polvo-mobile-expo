export type FinishedTest = {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  startedAt: string;
  endedAt: string;
};

export const finishedTestsMock: FinishedTest[] = [
  {
    id: 'mat',
    title: 'Matemática discreta aba reta da silva junior',
    score: 10,
    maxScore: 10,
    startedAt: '06/05/2025, 16:02',
    endedAt: '06/05/2025, 16:47',
  },
  {
    id: 'aaaa',
    title: 'aaaa',
    score: 3,
    maxScore: 10,
    startedAt: '07/05/2025, 14:02',
    endedAt: '07/05/2025, 14:47',
  },
  {
    id: 'nova',
    title: 'nova prova',
    score: 8,
    maxScore: 10,
    startedAt: '07/05/2025, 14:02',
    endedAt: '07/05/2025, 14:47',
  },
  {
    id: 'aaaaaaaaa',
    title: 'aaaaaaaaa',
    score: 5,
    maxScore: 10,
    startedAt: '07/05/2025, 15:07',
    endedAt: '07/05/2025, 15:52',
  },
  {
    id: '123',
    title: 'aaaaaaaaa',
    score: 5,
    maxScore: 10,
    startedAt: '07/05/2025, 15:07',
    endedAt: '07/05/2025, 15:52',
  },
  {
    id: '11616',
    title: 'aaaaaaaaa',
    score: 5,
    maxScore: 10,
    startedAt: '07/05/2025, 15:07',
    endedAt: '07/05/2025, 15:52',
  },
  {
    id: '754',
    title: 'aaaaaaaaa',
    score: 5,
    maxScore: 10,
    startedAt: '07/05/2025, 15:07',
    endedAt: '07/05/2025, 15:52',
  },
  {
    id: '48448',
    title: 'aaaaaaaaa',
    score: 5,
    maxScore: 10,
    startedAt: '07/05/2025, 15:07',
    endedAt: '07/05/2025, 15:52',
  },
];

export function getFinishedSubjectTestsMock(): Promise<FinishedTest[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(finishedTestsMock), 600); // 600 ms de “delay”
  });
}
