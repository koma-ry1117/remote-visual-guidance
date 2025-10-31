'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Annotation, Position3D, Rotation3D } from '@/types/annotations';

/**
 * 注釈の更新可能なプロパティ
 */
type AnnotationUpdates = {
  position?: Position3D;
  rotation?: Rotation3D;
  color?: string;
  visible?: boolean;
  // TextAnnotation固有
  text?: string;
  fontSize?: number;
};

/**
 * ARAnnotationContextの型定義
 */
interface ARAnnotationContextType {
  /** すべての注釈のリスト */
  annotations: Annotation[];
  /** 注釈を追加 */
  addAnnotation: (annotation: Annotation) => void;
  /** 注釈を更新 */
  updateAnnotation: (id: string, updates: AnnotationUpdates) => void;
  /** 注釈を削除 */
  removeAnnotation: (id: string) => void;
  /** 注釈の表示/非表示を切り替え */
  toggleAnnotationVisibility: (id: string) => void;
  /** すべての注釈をクリア */
  clearAnnotations: () => void;
}

/**
 * ARAnnotationContext
 * AR注釈の状態管理を提供するContext
 */
const ARAnnotationContext = createContext<ARAnnotationContextType | undefined>(
  undefined
);

/**
 * ARAnnotationProviderのProps
 */
interface ARAnnotationProviderProps {
  children: ReactNode;
}

/**
 * ARAnnotationProvider
 * AR注釈の状態管理を提供するProvider
 */
export function ARAnnotationProvider({ children }: ARAnnotationProviderProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  /**
   * 注釈を追加
   */
  const addAnnotation = (annotation: Annotation) => {
    setAnnotations((prev) => [...prev, annotation]);
  };

  /**
   * 注釈を更新
   */
  const updateAnnotation = (id: string, updates: AnnotationUpdates) => {
    setAnnotations((prev) =>
      prev.map((annotation) =>
        annotation.id === id
          ? { ...annotation, ...updates }
          : annotation
      )
    );
  };

  /**
   * 注釈を削除
   */
  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((annotation) => annotation.id !== id));
  };

  /**
   * 注釈の表示/非表示を切り替え
   */
  const toggleAnnotationVisibility = (id: string) => {
    setAnnotations((prev) =>
      prev.map((annotation) =>
        annotation.id === id
          ? { ...annotation, visible: !annotation.visible }
          : annotation
      )
    );
  };

  /**
   * すべての注釈をクリア
   */
  const clearAnnotations = () => {
    setAnnotations([]);
  };

  const value: ARAnnotationContextType = {
    annotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    toggleAnnotationVisibility,
    clearAnnotations,
  };

  return (
    <ARAnnotationContext.Provider value={value}>
      {children}
    </ARAnnotationContext.Provider>
  );
}

/**
 * useARAnnotation
 * ARAnnotationContextを使用するカスタムフック
 *
 * @throws {Error} ARAnnotationProvider外で使用された場合
 */
export function useARAnnotation(): ARAnnotationContextType {
  const context = useContext(ARAnnotationContext);

  if (context === undefined) {
    throw new Error(
      'useARAnnotation must be used within an ARAnnotationProvider'
    );
  }

  return context;
}
