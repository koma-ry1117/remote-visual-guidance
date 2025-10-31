'use client';

import React, { useState } from 'react';
import type { Workflow, WorkflowStep } from '@/types/workflow';

/**
 * WorkflowPanelコンポーネントのProps
 */
interface WorkflowPanelProps {
  workflow: Workflow;
  onStepChange?: (stepIndex: number) => void;
  onStepComplete?: (stepId: string) => void;
}

/**
 * WorkflowPanel
 * 作業手順を表示し、ステップの進行を管理するパネルコンポーネント
 */
export default function WorkflowPanel({
  workflow,
  onStepChange,
  onStepComplete,
}: WorkflowPanelProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    workflow.currentStepIndex
  );
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(workflow.steps.filter((s) => s.completed).map((s) => s.id))
  );

  const currentStep = workflow.steps[currentStepIndex];
  const totalSteps = workflow.steps.length;

  /**
   * 次のステップに進む
   */
  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex);
    }
  };

  /**
   * 前のステップに戻る
   */
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange?.(prevIndex);
    }
  };

  /**
   * 現在のステップを完了にする
   */
  const handleComplete = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep.id));
    onStepComplete?.(currentStep.id);
  };

  /**
   * 進捗率を計算
   */
  const progressPercentage = (completedSteps.size / totalSteps) * 100;

  return (
    <div className="fixed top-4 right-4 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-50">
      <div className="flex flex-col gap-4">
        {/* タイトル */}
        <div>
          <h2 className="text-lg font-bold text-gray-800">{workflow.title}</h2>
          <p className="text-xs text-gray-600 mt-1">{workflow.description}</p>
        </div>

        {/* 進捗バー */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>進捗</span>
            <span>
              {completedSteps.size} / {totalSteps} 完了
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 現在のステップ */}
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
              ステップ {currentStep.stepNumber}
            </span>
            {completedSteps.has(currentStep.id) && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                完了
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">
            {currentStep.title}
          </h3>
          <p className="text-sm text-gray-600">{currentStep.description}</p>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 rounded-md text-sm font-medium transition-colors"
          >
            前へ
          </button>
          <button
            onClick={handleComplete}
            disabled={completedSteps.has(currentStep.id)}
            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-md text-sm font-medium transition-colors"
          >
            完了
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === totalSteps - 1}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-md text-sm font-medium transition-colors"
          >
            次へ
          </button>
        </div>

        {/* ステップ一覧 */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            すべてのステップ
          </p>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {workflow.steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStepIndex(index);
                  onStepChange?.(index);
                }}
                className={`text-left px-2 py-1.5 rounded text-xs transition-colors ${
                  index === currentStepIndex
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="font-semibold">{step.stepNumber}.</span>{' '}
                {step.title}
                {completedSteps.has(step.id) && (
                  <span className="ml-1 text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
