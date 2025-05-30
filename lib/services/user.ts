import { AxiosResponse } from 'axios';

import api from '../api';
import { tokenManager } from '../auth/tokenManager';

import {
  EntityDataItem,
  SubjectDataResponse,
  SubjectTestDetails,
  TestDetailsData,
  TestDetailsResponse,
  UserSubjectsResponse,
} from './types/user';

interface getUserEnteredTestParams {
  entityId: string;
  actionId: string;
  studentId: string;
  testId: string;
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
  async getSubjectTests(
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

  async getUserEnteredTest({
    actionId,
    entityId,
    studentId,
    testId,
  }: getUserEnteredTestParams): Promise<TestDetailsData> {
    try {
      const response: AxiosResponse<TestDetailsResponse> = await api.post(
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
};
