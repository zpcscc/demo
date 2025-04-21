import { Space } from 'antd';
import { type FC, useEffect, useRef } from 'react';

const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (containerRef.current && imgRef.current) {
      console.log(111);
    }

    return () => {};
  }, [containerRef.current]);

  return (
    <Space direction='vertical'>
      <div className='root'>
        <div className='container'>
          <div className='target' ref={containerRef}>
            <img ref={imgRef} src='https://zpcscc.top/img/logo.png' />
          </div>
        </div>
      </div>
    </Space>
  );
};

export default App;
