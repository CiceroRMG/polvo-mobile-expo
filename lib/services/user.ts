import { AxiosResponse } from 'axios';

import api from '../api';
import { tokenManager } from '../auth/tokenManager';

import {
  BaseApiResponse,
  EntityDataItem,
  GradedTestData,
  SubjectTestDetails,
  TestDetailsData,
} from './types/user';

interface getTestDetailsParams {
  entityId: string;
  actionId: string;
  studentId: string;
  testId: string;
}

export interface answer {
  _id: string;
  text: string;
}

interface sendStudentQuestionAnswerParams {
  studentId: string;
  testId: string;
  questionId: string;
  answers: answer[];
}

interface MarkStudentTestApplicationParams {
  entityId: string;
  actionId: string;
  studentId: string;
  testApplicationId: string;
}

export const userService = {
  async getUserEnrolledSubjects(): Promise<EntityDataItem[]> {
    try {
      const response: AxiosResponse<BaseApiResponse<EntityDataItem[]>> =
        await api.get('user/entitiesWithTests', {
          headers: tokenManager.getAuthencationHeaders(),
        });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching user entities:', error);
      throw error;
    }
  },
  async getSubjectTests(
    entityId: string,
    actionId: string,
    studentId: string,
  ): Promise<SubjectTestDetails[]> {
    try {
      const response: AxiosResponse<BaseApiResponse<SubjectTestDetails[]>> =
        await api.post(
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

  async getTestDetails({
    actionId,
    entityId,
    studentId,
    testId,
  }: getTestDetailsParams): Promise<TestDetailsData> {
    try {
      const response: AxiosResponse<BaseApiResponse<TestDetailsData>> =
        await api.post(
          `ehq/${entityId}/${actionId}/studentGetTest`,
          { studentId, testId },
          { headers: tokenManager.getAuthencationHeaders() },
        );

      return response.data.data;
    } catch (error) {
      console.error('Error fetching user entered test:', error);
      throw error;
    }
  },

  async sendStudentQuestionAnswer(
    entityId: string,
    actionId: string,
    data: sendStudentQuestionAnswerParams,
  ) {
    try {
      /* BEST DEBUGGING EVER
      console.log('Request:', {
        entityId,
        actionId,
        data: JSON.stringify(data),
        headers: tokenManager.getAuthencationHeaders(),
        route: `${api.defaults.baseURL}/ehq/${entityId}/${actionId}/studentQuestionAnswer`,
        method: 'POST',
      });
 */
      const response: AxiosResponse<BaseApiResponse<void>> = await api.post(
        `ehq/${entityId}/${actionId}/studentQuestionAnswer`,
        data,
        { headers: tokenManager.getAuthencationHeaders() },
      );
      return response.data.data;
    } catch (error) {
      console.error('Error sending student question answer:', error);
      throw error;
    }
  },

  async markStudentTestApplicationAsInProgress({
    entityId,
    actionId,
    studentId,
    testApplicationId,
  }: MarkStudentTestApplicationParams): Promise<void> {
    try {
      const response: AxiosResponse<BaseApiResponse<void>> = await api.post(
        `ehq/${entityId}/${actionId}/markStudentTestApplicationAsInProgress`,
        { studentId, testApplicationId },
        { headers: tokenManager.getAuthencationHeaders() },
      );
      return response.data.data;
    } catch (error) {
      console.error(
        'Error marking student test application as in progress:',
        error,
      );
      throw error;
    }
  },

  async markStudentTestApplicationAsCompleted({
    entityId,
    actionId,
    studentId,
    testApplicationId,
  }: MarkStudentTestApplicationParams): Promise<void> {
    try {
      const response: AxiosResponse<BaseApiResponse<void>> = await api.post(
        `ehq/${entityId}/${actionId}/markStudentTestApplicationAsCompleted`,
        { studentId, testApplicationId },
        { headers: tokenManager.getAuthencationHeaders() },
      );
      return response.data.data;
    } catch (error) {
      console.error('Erro marcando o teste como completo:', error);
      throw error;
    }
  },

  async getGradedTestApplicationsByStudentId({
    entityId,
    actionId,
    studentId,
  }: {
    entityId: string;
    actionId: string;
    studentId: string;
  }) {
    try {
      const response: AxiosResponse<BaseApiResponse<GradedTestData[]>> =
        await api.post(
          `ehq/${entityId}/${actionId}/getGradedTestApplicationsByStudentId`,
          { studentId },
          { headers: tokenManager.getAuthencationHeaders() },
        );

      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar aplicações de teste avaliadas:', error);
      throw error;
    }
  },
};
