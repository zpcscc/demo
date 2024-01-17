export type DataType = {
  categoryData: (string | number)[];
  values: (string | number)[][];
};

export type RectType = {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
  top: number;
  left: number;
};

export type PosType = {
  x: number;
  y: number;
};

export type ArrowOptType = {
  ctx: CanvasRenderingContext2D;
  startPos: PosType;
  endPos: PosType;
  theta?: number;
  headlen?: number;
  width?: number;
  color?: string;
};

export type PanelOptType = {
  color?: string;
  backgroundColor?: string;
  width?: number;
  showArrow?: boolean;
  showBackground?: boolean;
  isDrawingMode?: boolean;
};
