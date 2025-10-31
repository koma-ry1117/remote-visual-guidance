'use client';

import React from 'react';
import type { ArrowAnnotation } from '@/types/annotations';

/**
 * ARArrowコンポーネントのProps
 */
interface ARArrowProps {
  annotation: ArrowAnnotation;
}

/**
 * ARArrow
 * AR空間に矢印を表示するコンポーネント
 *
 * 矢印は円柱（軸）と円錐（先端）で構成されます
 */
export default function ARArrow({ annotation }: ARArrowProps) {
  const {
    position,
    rotation,
    color = '#ff0000',
    visible = true,
    length = 1.0,
    direction,
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

  // 矢印の軸の長さ（全体の80%）
  const shaftLength = length * 0.8;
  // 矢印の先端の長さ（全体の20%）
  const headLength = length * 0.2;

  // 矢印の太さ
  const shaftRadius = 0.02;
  const headRadius = 0.05;

  // 方向ベクトルから回転角度を計算
  // デフォルトはY軸方向なので、directionベクトルに合わせて回転させる
  const directionLength = Math.sqrt(
    direction.x * direction.x +
      direction.y * direction.y +
      direction.z * direction.z
  );

  const normalizedDir = {
    x: direction.x / directionLength,
    y: direction.y / directionLength,
    z: direction.z / directionLength,
  };

  // Y軸方向 (0, 1, 0) から normalizedDir への回転を計算
  // 外積で回転軸を求める
  const rotationAxis = {
    x: -normalizedDir.z,
    y: 0,
    z: normalizedDir.x,
  };

  // 内積で回転角度を求める
  const dotProduct = normalizedDir.y; // Y軸との内積
  const angle = (Math.acos(dotProduct) * 180) / Math.PI;

  const rotationAxisLength = Math.sqrt(
    rotationAxis.x * rotationAxis.x + rotationAxis.z * rotationAxis.z
  );

  let arrowRotation = '0 0 0';
  if (rotationAxisLength > 0.001) {
    // 回転軸を正規化
    const axisX = rotationAxis.x / rotationAxisLength;
    const axisZ = rotationAxis.z / rotationAxisLength;
    // Rodriguesの回転公式を使用（簡易版）
    arrowRotation = `${axisX * angle} 0 ${axisZ * angle}`;
  }

  return (
    <a-entity position={positionStr} rotation={rotationStr}>
      {/* 矢印の軸（円柱） */}
      <a-cylinder
        radius={shaftRadius}
        height={shaftLength}
        color={color}
        position={`0 ${shaftLength / 2} 0`}
        rotation={arrowRotation}
      />

      {/* 矢印の先端（円錐） */}
      <a-cone
        radius-bottom={headRadius}
        radius-top="0"
        height={headLength}
        color={color}
        position={`0 ${shaftLength + headLength / 2} 0`}
        rotation={arrowRotation}
      />
    </a-entity>
  );
}
