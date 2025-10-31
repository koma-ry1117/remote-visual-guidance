'use client';

import React from 'react';
import { useARAnnotation } from '@/contexts/ARAnnotationContext';
import ARArrow from './ARArrow';
import ARText from './ARText';
import type { ArrowAnnotation, TextAnnotation } from '@/types/annotations';

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
          case 'arrow':
            return (
              <ARArrow
                key={annotation.id}
                annotation={annotation as ArrowAnnotation}
              />
            );
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
