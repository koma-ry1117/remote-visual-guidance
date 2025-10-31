/**
 * AR注釈システムの型定義
 * Remote Visual Guidanceプロジェクトで使用される注釈の型を定義します
 */

/**
 * 3D空間の座標を表す型
 */
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

/**
 * 3D空間の回転を表す型（度数法）
 */
export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

/**
 * サポートされる注釈のタイプ
 */
export type AnnotationType = 'arrow' | 'text';

/**
 * すべての注釈に共通する基本プロパティ
 */
export interface BaseAnnotation {
  /** 注釈の一意識別子 */
  id: string;
  /** 注釈のタイプ */
  type: AnnotationType;
  /** 3D空間での位置 */
  position: Position3D;
  /** 3D空間での回転（オプション） */
  rotation?: Rotation3D;
  /** 注釈の色（CSS色文字列、デフォルト: '#ff0000'） */
  color?: string;
  /** 注釈の表示/非表示状態 */
  visible?: boolean;
}

/**
 * 矢印注釈の型定義
 * 特定の方向を指し示すために使用
 */
export interface ArrowAnnotation extends BaseAnnotation {
  type: 'arrow';
  /** 矢印の方向ベクトル */
  direction: Position3D;
  /** 矢印の長さ（デフォルト: 1.0） */
  length?: number;
}

/**
 * テキスト注釈の型定義
 * 3D空間にテキストを表示するために使用
 */
export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  /** 表示するテキスト内容 */
  text: string;
  /** フォントサイズ（デフォルト: 0.5） */
  fontSize?: number;
}

/**
 * すべての注釈型のUnion型
 */
export type Annotation = ArrowAnnotation | TextAnnotation;
