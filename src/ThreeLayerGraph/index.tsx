/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-eval */
import $ from 'jquery';
import { useEffect, type FC } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { PanelOptType, PointType } from './type';

// 三层关系图谱
const ThreeLayerGraph: FC = () => {
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let sceneLine: THREE.Scene;
  let renderer: any;
  let webGLRenderer: any;
  let isCreateLine: any;
  let controls: any;
  // 平面所有子元素的中心点定位
  const points_list: PointType[] = [];
  // 角度转弧度
  const DEG2RAD = (1 / 180) * Math.PI;
  // 连接线的材质
  const materialOption = {
    color: 0x66ccff,
    linewidth: 5,
    dashed: true
  };
  // 实线材质
  const material = new LineMaterial({
    ...materialOption,
    linewidth: 3,
    dashed: false
  });
  // 虚线材质
  const materialDashed = new LineMaterial({
    ...materialOption,
    dashed: true
  });
  // 平面的一些配置
  const planeOption = {
    width: 200,
    height: 100,
    // 相邻两个平面的间隔大小
    interval: 40
  };

  // 创建页面内的子元素
  const createElement = (z: number, id: string) => {
    const element = document.createElement('div');
    element.className = 'node';
    element.style.width = '10px';
    element.style.height = '10px';
    element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
    element.style.borderRadius = '50%';
    element.style.margin = '10px auto';
    // 自定义数据，表示所在平面z轴的数据
    element.dataset.z = String(z);
    // 节点id
    element.dataset.id = id;
    return element;
  };

  // 创建一个平面
  const createPlane = ({ position, background, id }: PanelOptType) => {
    // 新建平面容器
    const element = document.createElement('div');
    // 容器内的子平面。为了更好的自定义样式，避免收到平面容器样式的影响；
    const elementChildren = document.createElement('div');
    element.className = 'plane';
    element.style.width = `${planeOption.width}px`;
    element.style.height = `${planeOption.height}px`;
    element.style.opacity = '0.7';
    element.style.background = background;
    element.style.border = '10px #66ccff solid';
    // 平面id
    element.dataset.id = String(id);
    elementChildren.style.width = '100%';
    elementChildren.style.height = '100%';
    elementChildren.style.display = 'grid';
    elementChildren.style.gridTemplateColumns = 'repeat(4,1fr)';
    for (let i = 1; i <= 12; i++) {
      // 在平面内增加子元素{
      elementChildren.append(createElement(position.z, `${id}-${i}`));
    }
    // 将子平面添加到平面的容器中。
    element.append(elementChildren);
    // 配置当前元素在3d环境下的属性
    const object = new CSS3DObject(element);
    object.position.x = position.x;
    object.position.y = position.y;
    object.position.z = position.z;
    return object;
  };

  // 创建连接线
  const createLine = (startPoint: PointType, endPoint: PointType) => {
    // 判断起点与终点是否在同一平面
    const isSamePlane = startPoint.z === endPoint.z;
    const { interval } = planeOption || {};
    const absolute = Math.max(startPoint.z, endPoint.z) - Math.min(startPoint.z, endPoint.z);

    // 贝塞尔曲线中间的控制点; 默认视为在同一平面内，使控制点与起点终点相同，这样可以画出直线；
    let controlPoint1 = startPoint;
    let controlPoint2 = endPoint;

    // 不在同一平面，且中间相隔了至少一个平面。则需要计算控制点的位置，画出曲线，绕开平面。避免穿模
    if (!isSamePlane && absolute > interval) {
      // 获取空间中两点的中心点
      const centerPoint = {
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2,
        z: (startPoint.z + endPoint.z) / 2
      };
      // 获取空间中两点三分之一点
      const oneThird = {
        x: (2 * startPoint.x + endPoint.x) / 3,
        y: (2 * startPoint.y + endPoint.y) / 3,
        z: (2 * startPoint.z + endPoint.z) / 3
      };
      // 获取空间中两点三分之二点
      const twoThird = {
        x: (startPoint.x + 2 * endPoint.x) / 3,
        y: (startPoint.y + 2 * endPoint.y) / 3,
        z: (startPoint.z + 2 * endPoint.z) / 3
      };

      // 计算x与y的偏移距离
      const getOffsetDistance = () => {
        const { x, y } = centerPoint;
        const x_abs = planeOption.width / 2 - Math.abs(x);
        const y_abs = planeOption.height / 2 - Math.abs(y);
        // 绝对值越小，则越靠近边
        if (x_abs > y_abs) {
          return { x: 0, y: y_abs * 2.5 };
        }
        return { x: x_abs * 2.5, y: 0 };
      };

      // 偏转方向的运算符
      const operator = {
        // X轴的偏移方向
        x: centerPoint.x > 0 ? '+' : '-',
        // Y轴的偏移方向
        y: centerPoint.y > 0 ? '+' : '-'
      };

      const offsetDistance = getOffsetDistance();

      // 设置贝塞尔曲线的两个控制点
      controlPoint1 = {
        x: eval(`${oneThird.x} ${operator.x} ${offsetDistance.x}`),
        y: eval(`${oneThird.y} ${operator.y} ${offsetDistance.y}`),
        z: oneThird.z
      };
      controlPoint2 = {
        x: eval(`${twoThird.x} ${operator.x} ${offsetDistance.x}`),
        y: eval(`${twoThird.y} ${operator.y} ${offsetDistance.y}`),
        z: twoThird.z
      };
    }
    // 生成贝塞尔曲线
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z),
      new THREE.Vector3(controlPoint1.x, controlPoint1.y, controlPoint1.z),
      new THREE.Vector3(controlPoint2.x, controlPoint2.y, controlPoint2.z),
      new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z)
    );
    const points = curve.getPoints(200);
    // 使用CatmullRom算法将贝塞尔曲线的点连接成一条平滑的曲线
    const spline = new THREE.CatmullRomCurve3(points);
    const divisions = Math.round(points.length);
    const point = new THREE.Vector3();
    const positions: number[] = [];
    for (let i = 0, l = divisions; i < l; i++) {
      const t = i / l;
      spline.getPoint(t, point);
      positions.push(point.x, point.y, point.z);
    }
    // 将生成的点，放入几何模型中，用于渲染
    const geometry = new LineGeometry().setPositions(positions);
    // 若起点，终点，在同一个平面，则用实线;不在同一个平面，则用虚线
    // 将几何模型与材质，组合成一条曲线
    const line = new Line2(geometry, isSamePlane ? material : materialDashed);
    // 必须计算直线距离，虚线才能生效
    line.computeLineDistances();
    sceneLine.add(line);

    // 画箭头
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const startPos = points.at(-2)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const endPos = points.at(-1)!;
    const direction = new THREE.Vector3(
      endPos.x - startPos.x,
      endPos.y - startPos.y,
      endPos.z - startPos.z
    ).normalize();
    const length = 1;
    const hex = 0x66ccff;
    const arrowHelper = new THREE.ArrowHelper(direction, startPos, length, hex, 3, 3);
    sceneLine.add(arrowHelper);
  };

  // 初始化
  const init = () => {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 400);
    camera.lookAt(0, 0, 0);

    // 场景通用配置
    const sceneOption = {
      rotation: {
        x: -(70 * DEG2RAD),
        y: 0 * DEG2RAD,
        z: 40 * DEG2RAD
      },
      background: new THREE.Color(0xf0f0f0)
    };

    // 初始化三层图谱的场景
    scene = new THREE.Scene();
    scene.background = sceneOption.background;
    scene.rotation.x = sceneOption.rotation.x;
    scene.rotation.y = sceneOption.rotation.y;
    scene.rotation.z = sceneOption.rotation.z;

    // 初始化连接线的场景
    sceneLine = new THREE.Scene();
    sceneLine.background = 'transparent' as any;
    sceneLine.rotation.x = sceneOption.rotation.x;
    sceneLine.rotation.y = sceneOption.rotation.y;
    sceneLine.rotation.z = sceneOption.rotation.z;

    // 往场景中，添加平面。通常情况下，这几个平面是平行的。x，y都为0。z轴定义层级
    scene.add(createPlane({ position: { x: 0, y: 0, z: 40 }, background: 'red', id: 1 }));
    scene.add(createPlane({ position: { x: 0, y: 0, z: 0 }, background: 'green', id: 2 }));
    scene.add(createPlane({ position: { x: 0, y: 0, z: -40 }, background: 'blue', id: 3 }));

    // 初始化三层平面用到的渲染器
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '50%';
    renderer.domElement.style.left = '50%';
    renderer.domElement.style.transform = 'translate(-50%, -50%)';
    document.querySelector('#container')?.append(renderer.domElement as Node);
    controls = new TrackballControls(camera, renderer.domElement);

    // 初始化连接线用到的渲染亲
    webGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    webGLRenderer.setClearColor(0x000000, 0);
    webGLRenderer.setPixelRatio(window.devicePixelRatio);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.useLegacyLights = false;
    webGLRenderer.domElement.style.position = 'absolute';
    webGLRenderer.domElement.style.top = '50%';
    webGLRenderer.domElement.style.left = '50%';
    webGLRenderer.domElement.style.transform = 'translate(-50%, -50%)';
    webGLRenderer.domElement.style.zIndex = 1;
    webGLRenderer.domElement.style.pointerEvents = 'none';
    document.querySelector('#container')?.append(webGLRenderer.domElement);
  };

  // 3d场景动画循环运行刷新
  const animate = () => {
    // 判断是否创建了连接线
    if (!isCreateLine) {
      // 未创建，则判断是否能查询到元素
      const nodes = document.querySelectorAll('.node');
      if (nodes.length > 0) {
        nodes.forEach((node) => {
          const { offsetLeft, offsetTop, dataset, offsetWidth, offsetHeight } = (node ||
            {}) as HTMLDivElement;
          const z = Number(dataset.z);
          const { width, height } = planeOption || {};
          const node_point = {
            x: -width / 2 + offsetLeft + offsetWidth / 2,
            y: height / 2 - offsetTop - offsetHeight / 2,
            z
          };
          points_list.push(node_point);
        });
        const getIndex = () => Math.floor(Math.random() * points_list.length);
        for (let i = 1; i <= 20; i++) {
          const startPoint = points_list[getIndex()];
          const endPoint = points_list[getIndex()];
          // 随机生成关系，并创建连接线。传入起点与终点的空间坐标
          createLine(startPoint, endPoint);
        }
        isCreateLine = true;
      }
    }

    controls?.update();
    renderer.render(scene, camera);
    webGLRenderer.render(sceneLine, camera);
    material.resolution.set(window.innerWidth, window.innerHeight);
    materialDashed.resolution.set(window.innerWidth, window.innerHeight);
    requestAnimationFrame(animate);
  };

  // 添加事件监听
  const addEventListener = () => {
    let plane_id;
    let node_id;

    // 添加事件监听前，先清除上次的监听。
    $('.plane').off();
    $('.node').off();
    $(document.body).off('pointerup');

    // 这里有个问题。对于controls监听的容器内部的节点。只有pointerdown事件可以被监听到。其他事件都不生效；
    // 所以这里用 body 的事件来进行监听。用pointerdown + pointerup来模拟 click 事件。

    $('.plane').on('pointerdown', function () {
      const { dataset } = this;
      const { id } = dataset || {};
      plane_id = id;
    });
    $('.node').on('pointerdown', function () {
      const { dataset } = this;
      const { id } = dataset || {};
      node_id = id;
    });

    // 后续跳转页面与其他事件，请在这里的触发操作里写；
    $(document.body).on('pointerup', () => {
      // 只要有节点，优先只触发节点的事件
      if (node_id) {
        console.log(`触发了节点-${node_id}`);
      } else if (plane_id) {
        console.log(`触发了平面-${plane_id}`);
      }

      // 每次鼠标抬起，都清空下id缓存;
      plane_id = undefined;
      node_id = undefined;
    });

    // 监听窗口变化。变换后，及时刷新画布
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  useEffect(() => {
    init();
    animate();
    addEventListener();
  });

  return (
    <div
      id='container'
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '500px',
        border: '1px solid #ccc'
      }}
    />
  );
};

export default ThreeLayerGraph;
