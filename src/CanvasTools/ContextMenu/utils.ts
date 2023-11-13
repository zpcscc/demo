/**
 * @name 计算面板定位，确保显示在可视范围内
 * @param left 鼠标点击时的left值
 * @param top 鼠标点击时的top值
 * @param domHeight 面板的高度
 * @returns
 */
export const calculationPosition = (
  left: number,
  top: number,
  domHeight?: number,
): { left: number; top: number } => {
  if (!left || !top) return { left, top };
  const newPosition = { left, top };
  if (!domHeight) return newPosition;
  // 若点击位置太低，面板下方会超出可视区域，则将面板位置向上方移动
  if (top + domHeight > document.body.offsetHeight) {
    newPosition.top = top - domHeight;
  }
  // 若点击位置太靠右，面板右方超出可视区域，则将面板左移。160为面板固定宽度。
  if (left + 160 > document.body.offsetWidth) {
    newPosition.left = left - 160;
  }
  return newPosition;
};
