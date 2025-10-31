"use client";

import { useEffect, useRef, useState } from "react";
import AnnotationLayer from "./annotations/AnnotationLayer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": any;
      "a-entity": any;
      "a-box": any;
      "a-ring": any;
      "a-plane": any;
      "a-sky": any;
    }
  }
}

interface DemoSceneProps {
  markerColor?: string;
  objectType?: "box" | "circle";
  showAnnotations?: boolean;
}

interface SceneObject {
  id: string;
  type: "box" | "circle";
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  color: string;
}

export default function DemoScene({
  markerColor = "#FF0000",
  objectType = "box",
  showAnnotations = true,
}: DemoSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [previewObject, setPreviewObject] = useState<SceneObject | null>(null);
  const [draggingObjectId, setDraggingObjectId] = useState<string | null>(null);

  // マウス移動でプレビューと図形の移動
  useEffect(() => {
    let mounted = true;
    let cleanupFn: (() => void) | undefined;

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = sceneRef.current?.querySelector("canvas");
      if (!canvas) return;

      const scene = sceneRef.current?.querySelector("a-scene");
      if (!scene) return;

      // THREE.jsとA-Frameが利用可能か確認
      if (typeof window === "undefined" || !(window as any).AFRAME || !(window as any).THREE) {
        return;
      }

      const camera = (scene as any).camera;
      if (!camera) return;

      // マウス座標を正規化デバイス座標に変換
      const rect = canvas.getBoundingClientRect();
      const mouse = new (window as any).THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // レイキャスターを使用してカメラからマウス方向へのレイを計算
      const raycaster = new (window as any).THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // カメラ位置から一定距離（1.5メートル）の点を取得
      const distance = 1.5;
      const direction = raycaster.ray.direction;
      const origin = raycaster.ray.origin;

      const position = {
        x: origin.x + direction.x * distance,
        y: origin.y + direction.y * distance,
        z: origin.z + direction.z * distance,
      };

      // カメラの向きを取得して回転を計算（正方形をカメラに向ける）
      const cameraRotation = camera.rotation;
      const rotation = {
        x: cameraRotation.x * (180 / Math.PI),
        y: cameraRotation.y * (180 / Math.PI),
        z: cameraRotation.z * (180 / Math.PI),
      };

      // ドラッグ中の場合は図形を移動
      if (draggingObjectId) {
        setObjects((prev) =>
          prev.map((obj) =>
            obj.id === draggingObjectId
              ? { ...obj, position, rotation }
              : obj
          )
        );
      } else {
        // ドラッグ中でない場合はプレビューを表示
        setPreviewObject({
          id: "preview",
          type: objectType,
          position,
          rotation,
          color: markerColor,
        });
      }
    };

    const setupMouseMove = () => {
      if (!mounted) return;

      const canvas = sceneRef.current?.querySelector("canvas");
      if (!canvas) {
        setTimeout(setupMouseMove, 100);
        return;
      }

      canvas.addEventListener("mousemove", handleMouseMove);
      cleanupFn = () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
      };
    };

    setupMouseMove();

    return () => {
      mounted = false;
      if (cleanupFn) cleanupFn();
    };
  }, [objectType, markerColor, draggingObjectId]);

  // クリックイベントハンドラー
  useEffect(() => {
    let mounted = true;
    let cleanupFn: (() => void) | undefined;

    const handleMouseDown = (event: MouseEvent) => {
      console.log("Mouse down event detected", event.button);
      if (event.button === 0) {
        // 左クリック: プレビュー位置にオブジェクトを固定
        // previewObjectの現在の状態を直接参照
        setPreviewObject((currentPreview) => {
          if (currentPreview && currentPreview.id === "preview") {
            const newObject: SceneObject = {
              ...currentPreview,
              id: `object-${Date.now()}`,
            };
            console.log("Adding object", newObject);
            setObjects((prev) => [...prev, newObject]);
            setDraggingObjectId(newObject.id);
          }
          return currentPreview;
        });
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      console.log("Mouse up event detected");
      if (event.button === 0) {
        // ドラッグ終了
        setDraggingObjectId(null);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault(); // 右クリックメニューを無効化
      console.log("Right click detected");

      const scene = sceneRef.current?.querySelector("a-scene");
      if (!scene) {
        console.log("Scene not found");
        return;
      }

      // レイキャスティングでオブジェクトを検出
      if (typeof window !== "undefined" && (window as any).AFRAME) {
        const camera = (scene as any).camera;
        if (!camera) {
          console.log("Camera not ready");
          return;
        }

        const canvas = sceneRef.current?.querySelector("canvas");
        if (!canvas) {
          console.log("Canvas not found");
          return;
        }

        const raycaster = new (window as any).THREE.Raycaster();
        const mouse = new (window as any).THREE.Vector2();

        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // すべてのオブジェクトに対してレイキャスト
        const allObjects = Array.from(
          scene.querySelectorAll("[data-object-id]")
        );
        console.log("Found objects for raycasting:", allObjects.length);
        const intersects: any[] = [];

        allObjects.forEach((obj: any) => {
          if (obj.object3D) {
            const results = raycaster.intersectObject(obj.object3D, true);
            if (results.length > 0) {
              intersects.push({
                distance: results[0].distance,
                objectId: obj.getAttribute("data-object-id"),
              });
            }
          }
        });

        // 最も近いオブジェクトを削除
        if (intersects.length > 0) {
          intersects.sort((a, b) => a.distance - b.distance);
          const objectIdToRemove = intersects[0].objectId;
          console.log("Removing object", objectIdToRemove);
          setObjects((prev) => prev.filter((obj) => obj.id !== objectIdToRemove));
        } else {
          console.log("No object found under cursor");
        }
      }
    };

    const setupClickHandlers = () => {
      if (!mounted) return;

      const canvas = sceneRef.current?.querySelector("canvas");
      if (!canvas) {
        console.log("Canvas not found, retrying...");
        setTimeout(setupClickHandlers, 100);
        return;
      }

      console.log("Setting up click handlers");
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("contextmenu", handleContextMenu);

      cleanupFn = () => {
        console.log("Cleaning up click handlers");
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("contextmenu", handleContextMenu);
      };
    };

    setupClickHandlers();

    return () => {
      mounted = false;
      if (cleanupFn) cleanupFn();
    };
  }, []); // 依存配列を空にして、マウント時のみ設定

  const renderObject = (obj: SceneObject) => {
    const positionStr = `${obj.position.x} ${obj.position.y} ${obj.position.z}`;
    const rotationStr = obj.rotation
      ? `${obj.rotation.x} ${obj.rotation.y} ${obj.rotation.z}`
      : "0 0 0";

    const commonProps = {
      position: positionStr,
      rotation: rotationStr,
      material: `color: ${obj.color}; side: double`,
      "data-object-id": obj.id,
    };

    const renderShape = () => {
      switch (obj.type) {
        case "circle":
          // リング形状で枠線のみを描画
          return (
            <a-ring
              key={obj.id}
              {...commonProps}
              radius-inner="0.045"
              radius-outer="0.05"
            />
          );
        case "box":
        default:
          // 正方形の枠線を4本の細い直方体で描画
          const lineThickness = 0.002;
          const size = 0.1;
          const halfSize = size / 2;

          return (
            <a-entity key={obj.id} position={positionStr} rotation={rotationStr}>
              {/* 上辺 */}
              <a-box
                position={`0 ${halfSize} 0`}
                width={size}
                height={lineThickness}
                depth={lineThickness}
                material={`color: ${obj.color}`}
                data-object-id={obj.id}
              />
              {/* 下辺 */}
              <a-box
                position={`0 ${-halfSize} 0`}
                width={size}
                height={lineThickness}
                depth={lineThickness}
                material={`color: ${obj.color}`}
              />
              {/* 左辺 */}
              <a-box
                position={`${-halfSize} 0 0`}
                width={lineThickness}
                height={size}
                depth={lineThickness}
                material={`color: ${obj.color}`}
              />
              {/* 右辺 */}
              <a-box
                position={`${halfSize} 0 0`}
                width={lineThickness}
                height={size}
                depth={lineThickness}
                material={`color: ${obj.color}`}
              />
            </a-entity>
          );
      }
    };

    return renderShape();
  };

  return (
    <div ref={sceneRef} className="w-full h-screen">
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
      >
        {/* カメラ（固定） */}
        <a-entity
          camera="active: true"
          look-controls="enabled: false"
          wasd-controls="enabled: false"
          position="0 1.6 0"
        ></a-entity>

        {/* ライト */}
        <a-entity light="type: ambient; color: #FFF; intensity: 0.5"></a-entity>
        <a-entity light="type: directional; color: #FFF; intensity: 0.8" position="1 2 1"></a-entity>

        {/* 背景 */}
        <a-sky color="#87CEEB"></a-sky>

        {/* 床 */}
        <a-plane
          position="0 0 0"
          rotation="-90 0 0"
          width="10"
          height="10"
          color="#7BC8A4"
        ></a-plane>

        {/* 3Dオブジェクト（複数） */}
        {objects.map((obj) => renderObject(obj))}

        {/* プレビューオブジェクト */}
        {previewObject && !draggingObjectId && renderObject(previewObject)}

        {/* 注釈 */}
        {showAnnotations && <AnnotationLayer />}
      </a-scene>
    </div>
  );
}
