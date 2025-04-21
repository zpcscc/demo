import type { EmptyCellsType } from './type';

// 初始化棋盘
export const initBoard = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  boardSize: number,
  cellSize: number,
) => {
  ctx.fillStyle = '#f8f1e5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制网格线
  ctx.strokeStyle = '#34495e';
  ctx.lineWidth = 1;

  for (let i = 0; i < boardSize; i++) {
    // 横线
    ctx.beginPath();
    ctx.moveTo(cellSize / 2, i * cellSize + cellSize / 2);
    ctx.lineTo(canvas.width - cellSize / 2, i * cellSize + cellSize / 2);
    ctx.stroke();

    // 竖线
    ctx.beginPath();
    ctx.moveTo(i * cellSize + cellSize / 2, cellSize / 2);
    ctx.lineTo(i * cellSize + cellSize / 2, canvas.height - cellSize / 2);
    ctx.stroke();
  }

  // 绘制五个星位点
  const starPoints = [3, 7, 11];
  ctx.fillStyle = '#34495e';

  for (const i of starPoints) {
    for (const j of starPoints) {
      ctx.beginPath();
      ctx.arc(
        i * cellSize + cellSize / 2,
        j * cellSize + cellSize / 2,
        cellSize / 8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
};

// 绘制棋子
export const drawPiece = (
  x: number,
  y: number,
  player: number,
  ctx: CanvasRenderingContext2D,
  cellSize: number,
) => {
  const centerX = x * cellSize + cellSize / 2;
  const centerY = y * cellSize + cellSize / 2;
  const radius = cellSize / 2 - 2;

  // 棋子阴影
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;

  // 棋子渐变
  const gradient = ctx.createRadialGradient(
    centerX - radius / 3,
    centerY - radius / 3,
    radius / 4,
    centerX,
    centerY,
    radius,
  );

  if (player === 1) {
    // 黑棋
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#000000');
  } else {
    // 白棋
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#bdc3c7');
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // 清除阴影
  ctx.shadowColor = 'transparent';

  // 棋子高光
  if (player === 1) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 4, 0, Math.PI * 2);
    ctx.fill();
  }
};

// 中等AI策略
export const getMediumAIMove = (boardSize: number, board: number[][]) => {
  // 简化版: 优先选择靠近已有棋子的位置
  const emptyCells: EmptyCellsType[] = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        // 检查周围是否有棋子
        let score = 0;

        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;

            const ni = i + di;
            const nj = j + dj;

            if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize && board[ni][nj] !== 0) {
              score++;
            }
          }
        }

        emptyCells.push({ x: i, y: j, score });
      }
    }
  }

  // 按分数排序
  emptyCells.sort((a, b) => b.score - a.score);

  // 从高分中随机选择一个
  const maxScore = emptyCells[0].score;
  const candidates = emptyCells.filter((cell) => cell.score === maxScore);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

// 困难AI策略
export const getHardAIMove = (boardSize: number, board: number[][]) => {
  // 简化版: 尝试连四或阻止对手连四
  const emptyCells: EmptyCellsType[] = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        // 评估这个位置的价值
        let score = evaluatePosition(i, j, 2, boardSize, board); // AI是白棋(2)
        score += evaluatePosition(i, j, 1, boardSize, board) * 0.8; // 也要考虑黑棋的威胁

        emptyCells.push({ x: i, y: j, score });
      }
    }
  }

  // 按分数排序
  emptyCells.sort((a, b) => b.score - a.score);

  // 从高分中随机选择一个
  const maxScore = emptyCells[0].score;
  const candidates = emptyCells.filter((cell) => cell.score === maxScore);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

// AI走棋
export const aiMove = (params: {
  gameActive: boolean;
  aiDifficulty: string;
  currentPlayer: number;
  boardSize: number;
  board: number[][];
  cellSize: number;
  handleCanvasClick: (event: { offsetX: number; offsetY: number }) => void;
}) => {
  const { gameActive, aiDifficulty, currentPlayer, boardSize, board, cellSize, handleCanvasClick } =
    params;
  if (!gameActive || currentPlayer !== 2) return;

  // 简化版AI: 随机选择空位
  const emptyCells: { x: number; y: number }[] = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }

  if (emptyCells.length > 0) {
    // 根据难度调整AI策略
    let selectedCell;

    if (aiDifficulty === 'easy') {
      // 简单AI: 完全随机
      selectedCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (aiDifficulty === 'medium') {
      // 中等AI: 有一定策略
      selectedCell = getMediumAIMove(boardSize, board);
    } else {
      // 困难AI: 更智能的策略
      selectedCell = getHardAIMove(boardSize, board);
    }

    // 模拟点击
    setTimeout(() => {
      const event = {
        offsetX: selectedCell.x * cellSize + cellSize / 2,
        offsetY: selectedCell.y * cellSize + cellSize / 2,
      };
      handleCanvasClick(event);
    }, 300);
  }
};

// 评估位置价值
export const evaluatePosition = (
  x: number,
  y: number,
  player: number,
  boardSize: number,
  board: number[][],
) => {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  let totalScore = 0;

  for (const [dx, dy] of directions) {
    let score = 0;
    let count = 1; // 当前位置假设已经下子
    let openEnds = 0;

    // 正向检查
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;

      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize) {
        break;
      }

      if (board[nx][ny] === player) {
        count++;
      } else if (board[nx][ny] === 0) {
        openEnds++;
        break;
      } else {
        break;
      }
    }

    // 反向检查
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;

      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize) {
        break;
      }

      if (board[nx][ny] === player) {
        count++;
      } else if (board[nx][ny] === 0) {
        openEnds++;
        break;
      } else {
        break;
      }
    }

    // 根据连子数和开放端评估分数
    if (count >= 5) {
      score += 100000; // 五连
    } else {
      switch (count) {
        case 4: {
          if (openEnds === 2) {
            score += 10000; // 活四
          } else if (openEnds === 1) {
            score += 1000; // 冲四
          }

          break;
        }
        case 3: {
          if (openEnds === 2) {
            score += 500; // 活三
          } else if (openEnds === 1) {
            score += 100; // 眠三
          }

          break;
        }
        case 2: {
          if (openEnds === 2) {
            score += 50; // 活二
          } else if (openEnds === 1) {
            score += 10; // 眠二
          }

          break;
        }
        // No default
      }
    }

    totalScore += score;
  }

  return totalScore;
};

// 检查胜利条件
export const checkWin = (x: number, y: number, boardSize: number, board: number[][]) => {
  const directions = [
    [1, 0], // 水平
    [0, 1], // 垂直
    [1, 1], // 对角线
    [1, -1], // 反对角线
  ];

  const player = board[x][y];

  for (const [dx, dy] of directions) {
    let count = 1;

    // 正向检查
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;

      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize || board[nx][ny] !== player) {
        break;
      }

      count++;
    }

    // 反向检查
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;

      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize || board[nx][ny] !== player) {
        break;
      }

      count++;
    }

    if (count >= 5) {
      return true;
    }
  }

  return false;
};

// 检查禁手 (专业规则)
export const checkForbidden = (
  x: number,
  y: number,
  boardSize: number,
  board: number[][],
  gameRule: string,
  currentPlayer: number,
) => {
  if (gameRule !== 'pro' || currentPlayer !== 1) return false;

  // 这里实现禁手规则检查
  // 简化版: 只检查长连禁手
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (const [dx, dy] of directions) {
    let count = 1;

    // 正向检查
    for (let i = 1; i < 6; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;

      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize || board[nx][ny] !== 1) {
        break;
      }

      count++;
    }

    // 反向检查
    for (let i = 1; i < 6; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;

      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize || board[nx][ny] !== 1) {
        break;
      }

      count++;
    }

    if (count > 5) {
      return true; // 长连禁手
    }
  }

  return false;
};
