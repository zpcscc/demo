import { useEffect, useRef, useState, type FC } from 'react';
import { GoBangContainer } from './Styled';
import { aiMove, checkForbidden, checkWin, drawPiece, initBoard } from './utils';

const boardSize = 15;
let timerInterval: any = null;

const btn =
  'py-0.8rem px-1.2rem b-none b-rd-6px font-600  cursor-pointer u-center transition-all duration-300 ease-in-out';
const btnSecondary = 'bg-#ecf0f1 text-#34495e hover:bg-#dfe6e9 hover:translate-y--2px';
const btnSuccess = 'bg-#27ae60 text-white hover:bg-#219653 hover:translate-y--2px';

const GoBang: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPlayerText, setCurrentPlayerText] = useState<string>('黑方');
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [cellSize, setCellSize] = useState<number>(0);
  const [board, setBoard] = useState<number[][]>([]); // 棋盘状态
  const [gameActive, setGameActive] = useState<boolean>(false); // 游戏是否进行中
  const [gameMode, setGameMode] = useState<string>('pve'); // 'pvp' 或 'pve'
  const [gameRule, setGameRule] = useState<string>('standard'); // 'standard' 或 'pro'
  const [aiDifficulty, setAIDifficulty] = useState<string>('medium'); // 游戏难度 'easy', 'medium', 'hard'
  const [moveCount, setMoveCount] = useState<number>(0); // 游戏步数
  const [gameStartTime, setGameStartTime] = useState<number>(0); // 游戏开始时间
  const [gameTime, setGameTime] = useState<string>('00:00'); // 游戏时间
  const [messageText, setMessageText] = useState<string>(''); // 消息文本
  const [messageClass, setMessageClass] = useState<string>(
    'p-1rem b-rd-6px mt-1rem text-center font-600 hidden',
  ); // 消息类名
  const [gameStatusText, setGameStatusText] = useState<string>('准备开始'); // 游戏状态文本
  const [gameStatusClass, setGameStatusClass] = useState<string>('text-#f39c12'); // 游戏状态文本

  let currentPlayer: number = 1; // 当前玩家 1: 黑棋, 2: 白棋

  // 更新游戏时间
  const updateGameTime = () => {
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    setGameTime(`${minutes}:${seconds}`);
  };

  // 开始新游戏
  const startNewGame = () => {
    // 重置游戏状态
    setBoard(
      Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0)),
    );
    currentPlayer = 1;
    setGameActive(true);
    setMoveCount(0);
    setGameStartTime(Date.now());

    // 更新UI
    setCurrentPlayerText('黑方');
    setGameStatusText('游戏中');
    setGameStatusClass('text-#27ae60');
    setMessageText('');
    setMessageClass('p-1rem b-rd-6px mt-1rem text-center font-600 hidden');

    // 启动计时器
    if (timerInterval) clearInterval(timerInterval);
    updateGameTime();
    timerInterval = setInterval(updateGameTime, 1000);

    // 初始化棋盘
    if (ctx && canvasRef.current) {
      initBoard(ctx, canvasRef.current, boardSize, cellSize);
    }

    // 如果是人机对战且AI先手
    if (gameMode === 'pve' && currentPlayer === 2) {
      setTimeout(() => {
        aiMove({
          gameActive,
          aiDifficulty,
          currentPlayer,
          boardSize,
          board,
          cellSize,
          handleCanvasClick,
        });
      }, 500);
    }
  };

  // 结束游戏
  const endGame = (message: string) => {
    setGameActive(false);
    setGameStatusText(message);

    if (timerInterval) {
      clearInterval(timerInterval as number);
      timerInterval = null;
    }

    // 显示消息
    setMessageClass(
      message.includes(' 胜利')
        ? 'p-1rem b-rd-6px mt-1rem text-center font-600 hidden bg-#27ae6019 text-#27ae60 block'
        : 'p-1rem b-rd-6px mt-1rem text-center font-600 hidden bg-#f1c40f19 text-#f1c40f block',
    );
    setMessageText(message);
  };

  // 重置游戏
  const resetGame = () => {
    if (confirm('确定要重新开始游戏吗？当前进度将丢失。')) {
      startNewGame();
    }
  };

  // 处理画布点击事件
  const handleCanvasClick = (event: any) => {
    if (!gameActive) return;
    // 计算点击的格子坐标
    const offsetX = event.offsetX ?? event.nativeEvent.offsetX;
    const offsetY = event.offsetY ?? event.nativeEvent.offsetY;
    const x = Math.floor(offsetX / cellSize);
    const y = Math.floor(offsetY / cellSize);

    // 检查是否有效位置
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) return;

    // 检查禁手
    if (checkForbidden(x, y, boardSize, board, gameRule, currentPlayer)) {
      endGame('黑方禁手! 白方胜利!');
      setMessageClass(
        'p-1rem b-rd-6px mt-1rem text-center font-600 hidden bg-#e74c3c19 text-#e74c3c block',
      );
      setMessageText('黑方触犯禁手规则!');
      return;
    }

    // 放置棋子
    placePiece(x, y);
  };

  // 处理落子
  const placePiece = (x: number, y: number) => {
    if (!gameActive || board[x][y] !== 0) return false;

    board[x][y] = currentPlayer;
    if (ctx) {
      drawPiece(x, y, currentPlayer, ctx, cellSize);
    }
    setMoveCount((prev) => prev + 1);

    // 检查胜负
    if (checkWin(x, y, boardSize, board)) {
      endGame(currentPlayer === 1 ? '黑方胜利!' : '白方胜利!');
      return true;
    }

    // 检查平局
    if (moveCount === boardSize * boardSize) {
      endGame('平局!');
      return true;
    }

    // 切换玩家
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayerText(currentPlayer === 1 ? '黑方' : '白方');

    // 如果是人机对战且游戏未结束，AI走棋
    if (gameActive && gameMode === 'pve' && currentPlayer === 2) {
      setTimeout(() => {
        aiMove({
          gameActive,
          aiDifficulty,
          currentPlayer,
          boardSize,
          board,
          cellSize,
          handleCanvasClick,
        });
      }, 100);
    }

    return true;
  };

  useEffect(() => {
    if (canvasRef.current) {
      // 游戏状态变量
      setCtx(canvasRef.current.getContext('2d'));
      setCellSize(canvasRef.current.width / boardSize);
      setBoard(
        Array(boardSize)
          .fill(0)
          .map(() => Array(boardSize).fill(0)),
      );

      // 初始化
      if (ctx && canvasRef.current) {
        initBoard(ctx, canvasRef.current, boardSize, cellSize);
      }

      // 显示欢迎消息
      setTimeout(() => {
        setMessageClass(
          'p-1rem b-rd-6px mt-1rem text-center font-600 hidden bg-#27ae6019 text-#27ae60 block animate-fade',
        );
        setMessageText('欢迎来到五子棋大师! 点击"新游戏"开始对弈。');
      }, 1000);
    }

    return () => {};
  }, [canvasRef.current]);

  return (
    <GoBangContainer className='max-w-1200px my-0 mx-auto p-2rem grid gap-2rem grid-cols-[1fr_300px]'>
      <div className='bg-white b-rd-8px shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-2rem relative overflow-hidden'>
        <div className='text-size-1.5rem mb-1.5rem text-#2c3e50 flex u-center-between b-b-1px b-b-solid b-b-#eee pb-0.5rem'>
          <span className={`${gameStatusClass} font-700`}>{gameStatusText}</span>
        </div>
        <canvas
          ref={canvasRef}
          className='bg-#f8f1e5 b-1px b-solid b-#ddd block my-0 mx-auto shadow-[0_4px_8px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
          width='600'
          height='600'
          onClick={handleCanvasClick}
        />
        <div className={messageClass}>{messageText}</div>
      </div>

      <div className='bg-white b-rd-8px shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-2rem flex flex-col'>
        <div className='mb-1.5rem'>
          <div className='text-1.1rem mb-1rem text-#2c3e50 u-center-start'>
            <i className='fas fa-cog  mr-0.5rem text-#3498db' /> 游戏设置
          </div>
          <div className='flex flex-col gap-0.8rem'>
            <button
              className={`${btn} bg-#3498db text-white hover:bg-#2980b9 hover:translate-y--2px`}
              onClick={startNewGame}
            >
              <i className='fas fa-plus-circle mr-0.5rem' /> 新游戏
            </button>
            <button className={`${btn} ${btnSecondary}`} onClick={resetGame}>
              <i className='fas fa-redo mr-0.5rem' /> 重新开始
            </button>
          </div>
        </div>

        <div className='mb-1.5rem'>
          <div className='text-1.1rem mb-1rem text-#2c3e50 u-center-start'>
            <i className='fas fa-user-friends text-#3498db' /> 游戏模式
          </div>
          <div className='flex flex-col gap-0.8rem'>
            <label className='u-center-start p-0.5rem b-rd-6px transition-all duration-300 ease-in-out cursor-pointer hover:bg-#3498db19'>
              <input
                className='mr-0.8rem'
                type='radio'
                value='pve'
                checked={gameMode === 'pve'}
                onChange={() => setGameMode('pve')}
              />
              人机对战
            </label>
            <label className='u-center-start p-0.5rem b-rd-6px transition-all duration-300 ease-in-out cursor-pointer hover:bg-#3498db19'>
              <input
                className='mr-0.8rem'
                type='radio'
                value='pvp'
                checked={gameMode === 'pvp'}
                onChange={() => setGameMode('pvp')}
              />
              双人对战
            </label>
          </div>
        </div>

        <div className='mb-1.5rem'>
          <div className='text-1.1rem mb-1rem text-#2c3e50 u-center-start'>
            <i className='fas fa-chess text-#3498db' /> 规则设置
          </div>
          <div className='flex flex-col gap-0.8rem'>
            <label className='u-center-start p-0.5rem b-rd-6px transition-all duration-300 ease-in-out cursor-pointer hover:bg-#3498db19'>
              <input
                className='mr-0.8rem'
                type='radio'
                value='standard'
                checked={gameRule === 'standard'}
                onChange={() => setGameRule('standard')}
              />
              标准规则 (无禁手)
            </label>
            <label className='u-center-start p-0.5rem b-rd-6px transition-all duration-300 ease-in-out cursor-pointer hover:bg-#3498db19'>
              <input
                className='mr-0.8rem'
                type='radio'
                value='pro'
                checked={gameRule === 'pro'}
                onChange={() => setGameRule('pro')}
              />
              专业规则 (有禁手)
            </label>
          </div>
        </div>

        <div className='mb-1.5rem'>
          <div className='text-1.1rem mb-1rem text-#2c3e50 u-center-start'>
            <i className='fas fa-robot text-#3498db' /> AI难度
          </div>
          <div className='flex flex-col gap-0.8rem'>
            <button
              className={`${btn} ${aiDifficulty === 'easy' ? btnSuccess : btnSecondary}`}
              onClick={() => setAIDifficulty('easy')}
            >
              <i className='fas fa-smile mr-0.5rem' /> 简单
            </button>
            <button
              className={`${btn} ${aiDifficulty === 'medium' ? btnSuccess : btnSecondary}`}
              onClick={() => setAIDifficulty('medium')}
            >
              <i className='fas fa-meh mr-0.5rem' /> 中等
            </button>
            <button
              className={`${btn} ${aiDifficulty === 'hard' ? btnSuccess : btnSecondary}`}
              onClick={() => setAIDifficulty('hard')}
            >
              <i className='fas fa-angry mr-0.5rem' /> 困难
            </button>
          </div>
        </div>

        <div className='bg-white b-rd-8px shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-1.5rem mt-1.5rem'>
          <div className='u-center-between mb-0.8rem'>
            <span className='font-600 text-#2c3e50'>当前玩家:</span>
            <span className='text-#34495e'>{currentPlayerText}</span>
          </div>
          <div className='u-center-between mb-0.8rem'>
            <span className='font-600 text-#2c3e50'>已走步数:</span>
            <span className='text-#34495e'>{moveCount}</span>
          </div>
          <div className='u-center-between mb-0.8rem'>
            <span className='font-600 text-#2c3e50'>游戏时间:</span>
            <span className='text-#34495e'>{gameTime}</span>
          </div>
        </div>
      </div>
    </GoBangContainer>
  );
};

export default GoBang;
