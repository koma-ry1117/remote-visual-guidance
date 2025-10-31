'use client';

import React, { useState } from 'react';
import { captureAndDownload } from '@/utils/capture';

/**
 * CaptureButtonコンポーネントのProps
 */
interface CaptureButtonProps {
  /** キャプチャする要素のID（省略時は全画面） */
  elementId?: string;
  /** ボタンのラベル */
  label?: string;
  /** キャプチャ成功時のコールバック */
  onCapture?: (filename: string) => void;
  /** キャプチャ失敗時のコールバック */
  onError?: (error: Error) => void;
}

/**
 * CaptureButton
 * スクリーンショットを撮影するボタンコンポーネント
 */
export default function CaptureButton({
  elementId,
  label = 'スクリーンショット',
  onCapture,
  onError,
}: CaptureButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState<string>('');

  /**
   * スクリーンショットを撮影
   */
  const handleCapture = async () => {
    setIsCapturing(true);
    setMessage('');

    try {
      const result = await captureAndDownload(elementId);
      setMessage('スクリーンショットを保存しました');
      onCapture?.(result.filename);

      // メッセージを3秒後に消す
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'スクリーンショットの撮影に失敗しました';
      setMessage(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));

      // エラーメッセージを5秒後に消す
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCapture}
        disabled={isCapturing}
        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isCapturing ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>撮影中...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {/* メッセージ表示 */}
      {message && (
        <div
          className={`text-xs px-3 py-2 rounded ${
            message.includes('失敗') || message.includes('エラー')
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
