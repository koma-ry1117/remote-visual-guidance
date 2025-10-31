/**
 * 作業手順管理システムの型定義
 * Remote Visual Guidanceプロジェクトで使用される作業手順の型を定義します
 */

/**
 * 作業ステップの型定義
 */
export interface WorkflowStep {
  /** ステップの一意識別子 */
  id: string;
  /** ステップ番号（表示用） */
  stepNumber: number;
  /** ステップのタイトル */
  title: string;
  /** ステップの詳細説明 */
  description: string;
  /** このステップで表示する注釈のIDリスト */
  annotationIds: string[];
  /** ステップが完了したかどうか */
  completed: boolean;
}

/**
 * 作業手順全体の型定義
 */
export interface Workflow {
  /** 作業手順の一意識別子 */
  id: string;
  /** 作業手順のタイトル */
  title: string;
  /** 作業手順の説明 */
  description: string;
  /** 作業手順のステップリスト */
  steps: WorkflowStep[];
  /** 現在のステップのインデックス（0から始まる） */
  currentStepIndex: number;
}
