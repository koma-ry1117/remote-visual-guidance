'use client';

import React, { useState } from 'react';
import { useARAnnotation } from '@/contexts/ARAnnotationContext';
import type { ArrowAnnotation, TextAnnotation } from '@/types/annotations';

/**
 * AnnotationToolbar
 * AR注釈を配置するためのUIツールバー
 *
 * ユーザーが矢印注釈とテキスト注釈を追加できるボタンを提供します
 */
export default function AnnotationToolbar() {
  const { addAnnotation } = useARAnnotation();
  const [selectedColor, setSelectedColor] = useState('#ff0000');

  /**
   * ランダムなIDを生成
   */
  const generateId = (): string => {
    return `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * 矢印注釈を追加
   */
  const handleAddArrow = () => {
    const annotation: ArrowAnnotation = {
      id: generateId(),
      type: 'arrow',
      position: { x: 0, y: 1, z: 0 }, // デフォルト位置
      direction: { x: 0, y: 1, z: 0 }, // デフォルト方向（上向き）
      color: selectedColor,
      visible: true,
      length: 1.0,
    };
    addAnnotation(annotation);
  };

  /**
   * テキスト注釈を追加
   */
  const handleAddText = () => {
    const annotation: TextAnnotation = {
      id: generateId(),
      type: 'text',
      position: { x: 0, y: 1.5, z: 0 }, // デフォルト位置
      text: '新しいテキスト',
      color: selectedColor,
      visible: true,
      fontSize: 0.5,
    };
    addAnnotation(annotation);
  };

  // カラーパレット
  const colors = [
    '#ff0000', // 赤
    '#00ff00', // 緑
    '#0000ff', // 青
    '#ffff00', // 黄
    '#ff00ff', // マゼンタ
    '#00ffff', // シアン
    '#ffffff', // 白
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-50">
      <div className="flex flex-col gap-4">
        {/* タイトル */}
        <h3 className="text-sm font-semibold text-gray-800">注釈ツール</h3>

        {/* 注釈追加ボタン */}
        <div className="flex gap-2">
          <button
            onClick={handleAddArrow}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            矢印を追加
          </button>
          <button
            onClick={handleAddText}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            テキストを追加
          </button>
        </div>

        {/* カラーパレット */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-700">色を選択</label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* 選択中の色表示 */}
        <div className="text-xs text-gray-600">
          選択中の色: <span className="font-mono">{selectedColor}</span>
        </div>
      </div>
    </div>
  );
}
