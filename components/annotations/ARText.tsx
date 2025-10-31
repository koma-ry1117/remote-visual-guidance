'use client';

import React from 'react';
import type { TextAnnotation } from '@/types/annotations';

/**
 * ARTextコンポーネントのProps
 */
interface ARTextProps {
  annotation: TextAnnotation;
}

/**
 * ARText
 * AR空間にテキストを表示するコンポーネント
 */
export default function ARText({ annotation }: ARTextProps) {
  const {
    position,
    rotation,
    color = '#ff0000',
    visible = true,
    text,
    fontSize = 0.5,
  } = annotation;

  // 表示/非表示の制御
  if (!visible) {
    return null;
  }

  // A-Frameのposition文字列を生成
  const positionStr = `${position.x} ${position.y} ${position.z}`;

  // A-Frameのrotation文字列を生成
  const rotationStr = rotation
    ? `${rotation.x} ${rotation.y} ${rotation.z}`
    : '0 0 0';

  return (
    <a-text
      value={text}
      color={color}
      position={positionStr}
      rotation={rotationStr}
      scale={`${fontSize} ${fontSize} ${fontSize}`}
      align="center"
      anchor="center"
      baseline="center"
    />
  );
}
