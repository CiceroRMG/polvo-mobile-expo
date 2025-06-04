interface Monitor {
  _id: string;
  id: string;
}

interface Student {
  _id: string;
  id: string;
}

interface EntityId {
  _id: string;
  name: string;
  id: string;
}

interface TestItem {
  monitors: Monitor[];
  students: Student[];
  hasTeacherStartedTestEarly: boolean;
  instructions: string;
  initialDate: string;
  endDate: string;
  title: string;
  entityId: EntityId;
  id: string;
}

// Tipo das entidades
interface EntityAction {
  _id: string;
  methods: string[];
  label: string;
  name: string;
  id: string;
}

// Interface para o objeto 'privileges'
interface EntityPrivileges {
  _id: string;
  actions: EntityAction[];
  label: string;
  id: string;
}

// Interface para cada item dentro do array 'data' principal
export interface EntityDataItem {
  id: string;
  title: string;
  testCount: number;
  tests: TestItem[]; // Mantém TestItem aqui, pois é o que getUserEnrolledSubjects retorna
  privileges: EntityPrivileges;
}

// Novos tipos adicionados
export interface SubjectTestDetails extends TestItem {
  status: string;
}

interface Answer {
  _id: string;
  text: string;
}

export interface Question {
  title: string;
  body: string;
  answers: Answer[];
  grade: number;
  weight: number;
  questionType: string;
  id: string;
}

export interface TestDetailsData {
  test: string;
  student: string;
  questions: Question[];
  id: string;
  status: string;
}

export interface BaseApiResponse<T> {
  success: boolean;
  data: T;
}

interface Test {
  _id: string;
  initialDate: string;
  endDate: string;
  title: string;
  id: string;
}

export interface GradedTestData {
  status: 'graded';
  test: Test;
  id: string;
  updatedAt: string;
  grade: number;
}
