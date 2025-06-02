import { AxiosResponse } from 'axios';

import api from '../api';
import { tokenManager } from '../auth/tokenManager';

import {
  BaseApiResponse,
  EntityDataItem,
  SubjectTestDetails,
  TestDetailsData,
} from './types/user';

interface getTestDetailsParams {
  entityId: string;
  actionId: string;
  studentId: string;
  testId: string;
}

interface sendStudentQuestionAnswerParams {
  studentId: string;
  testId: string;
  questionId: string;
  answerId: string;
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
};
