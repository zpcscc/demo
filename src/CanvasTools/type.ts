export interface DataType {
  categoryData: (string | number)[];
  values: (string | number)[][];
}

export interface RectType {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
  top: number;
  left: number;
}

export interface PosType {
  x: number;
  y: number;
}

export interface ArrowOptType {
  ctx: CanvasRenderingContext2D;
  startPos: PosType;
  endPos: PosType;
  theta?: number;
  headlen?: number;
  width?: number;
  color?: string;
}

export interface PanelOptType {
  color?: string;
  backgroundColor?: string;
  width?: number;
  showArrow?: boolean;
  showBackground?: boolean;
  isDrawingMode?: boolean;
}

export type AnyObject = Record<string, any>;
