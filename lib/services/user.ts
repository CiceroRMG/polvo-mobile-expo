import { AxiosResponse } from 'axios';

import api from '../api';
import { tokenManager } from '../auth/tokenManager';

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
interface EntityDataItem {
  id: string;
  title: string;
  testCount: number;
  tests: TestItem[]; // Mantém TestItem aqui, pois é o que getUserEnrolledSubjects retorna
  privileges: EntityPrivileges;
}

// Interface para o objeto que contém 'success' e o array 'data'
interface UserSubjectsResponse {
  success: boolean;
  data: EntityDataItem[];
}

// Novos tipos adicionados
interface SubjectTestDetails extends TestItem {
  status: string;
}

interface SubjectDataResponse {
  success: boolean;
  data: SubjectTestDetails[];
}

export const userService = {
  async getUserEnrolledSubjects(): Promise<EntityDataItem[]> {
    try {
      const response: AxiosResponse<UserSubjectsResponse> = await api.get(
        'user/entitiesWithTests',
        {
          headers: tokenManager.getAuthencationHeaders(),
        },
      );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching user entities:', error);
      throw error;
    }
  },
  async getSubjectData(
    entityId: string,
    actionId: string,
    studentId: string,
  ): Promise<SubjectTestDetails[]> {
    try {
      const response: AxiosResponse<SubjectDataResponse> = await api.post(
        `ehq/${entityId}/${actionId}/studentTestEnter`,
        { entityId, studentId },
        { headers: tokenManager.getAuthencationHeaders() },
      );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching subject data by ID:', error);
      throw error;
    }
  },
};
