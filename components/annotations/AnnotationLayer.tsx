'use client';

import React from 'react';
import { useARAnnotation } from '@/contexts/ARAnnotationContext';
import ARText from './ARText';
import type { TextAnnotation } from '@/types/annotations';

/**
 * AnnotationLayer
 * すべてのAR注釈を統合してレンダリングするレイヤーコンポーネント
 *
 * useARAnnotationフックから注釈のリストを取得し、
 * 各注釈のタイプに応じて適切なコンポーネントをレンダリングします
 */
export default function AnnotationLayer() {
  const { annotations } = useARAnnotation();

  return (
    <>
      {annotations.map((annotation) => {
        // 注釈のタイプに応じて適切なコンポーネントをレンダリング
        switch (annotation.type) {
          case 'text':
            return (
              <ARText
                key={annotation.id}
                annotation={annotation as TextAnnotation}
              />
            );
          default:
            // 未知のタイプの場合は何もレンダリングしない
            return null;
        }
      })}
    </>
  );
}
