import type { Workflow } from '@/types/workflow';

/**
 * サンプル作業手順データ
 * 機器組み立ての例
 */
export const sampleWorkflow: Workflow = {
  id: 'workflow-sample-001',
  title: '機器組み立て作業',
  description: 'AR注釈を使用した機器の組み立て手順',
  currentStepIndex: 0,
  steps: [
    {
      id: 'step-001',
      stepNumber: 1,
      title: '部品の確認',
      description: 'すべての部品が揃っているか確認してください。',
      annotationIds: [],
      completed: false,
    },
    {
      id: 'step-002',
      stepNumber: 2,
      title: 'ベースプレートの配置',
      description: 'ベースプレートを作業台に配置してください。',
      annotationIds: [],
      completed: false,
    },
    {
      id: 'step-003',
      stepNumber: 3,
      title: 'ネジの取り付け',
      description: '4つのネジをベースプレートに取り付けてください。',
      annotationIds: [],
      completed: false,
    },
    {
      id: 'step-004',
      stepNumber: 4,
      title: 'カバーの取り付け',
      description: 'カバーをベースプレートに取り付けてください。',
      annotationIds: [],
      completed: false,
    },
    {
      id: 'step-005',
      stepNumber: 5,
      title: '最終確認',
      description: 'すべての部品が正しく取り付けられているか確認してください。',
      annotationIds: [],
      completed: false,
    },
  ],
};
