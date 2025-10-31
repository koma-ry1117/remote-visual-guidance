"use client";

import { useEffect, useRef, useState } from "react";
import AnnotationLayer from "./annotations/AnnotationLayer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": any;
      "a-entity": any;
      "a-box": any;
      "a-sphere": any;
      "a-cylinder": any;
      "a-plane": any;
      "a-sky": any;
    }
  }
}

interface DemoSceneProps {
  markerColor?: string;
  objectType?: "box" | "sphere" | "cylinder";
  showAnnotations?: boolean;
}

interface SceneObject {
  id: string;
  type: "box" | "sphere" | "cylinder";
  position: { x: number; y: number; z: number };
  color: string;
}

export default function DemoScene({
  markerColor = "#FF0000",
  objectType = "box",
  showAnnotations = true,
}: DemoSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<SceneObject[]>([
    // デフォルトオブジェクト
    {
      id: "default-1",
      type: "box",
      position: { x: 0, y: 1, z: -3 },
      color: "#FF0000",
    },
  ]);

  // クリックイベントハンドラー
  useEffect(() => {
    let mounted = true;
    let cleanupFn: (() => void) | undefined;

    const handleClick = (event: MouseEvent) => {
      console.log("Click detected", event.button);
      if (event.button === 0) {
        // 左クリック: オブジェクトを追加
        const canvas = sceneRef.current?.querySelector("canvas");
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // 3D空間での位置を計算（カメラの前方に配置）
        const distance = 3;
        const newObject: SceneObject = {
          id: `object-${Date.now()}`,
          type: objectType,
          position: {
            x: x * distance * 0.5,
            y: y * distance * 0.5 + 1,
            z: -distance,
          },
          color: markerColor,
        };

        console.log("Adding object", newObject);
        setObjects((prev) => [...prev, newObject]);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault(); // 右クリックメニューを無効化
      console.log("Right click detected");

      const scene = sceneRef.current?.querySelector("a-scene");
      if (!scene) return;

      // レイキャスティングでオブジェクトを検出
      if (typeof window !== "undefined" && (window as any).AFRAME) {
        const camera = (scene as any).camera;
        if (!camera) {
          console.log("Camera not ready");
          return;
        }

        const canvas = sceneRef.current?.querySelector("canvas");
        if (!canvas) return;

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
      canvas.addEventListener("click", handleClick);
      canvas.addEventListener("contextmenu", handleContextMenu);

      cleanupFn = () => {
        console.log("Cleaning up click handlers");
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("contextmenu", handleContextMenu);
      };
    };

    setupClickHandlers();

    return () => {
      mounted = false;
      if (cleanupFn) cleanupFn();
    };
  }, [objectType, markerColor, setObjects]);

  const renderObject = (obj: SceneObject) => {
    const positionStr = `${obj.position.x} ${obj.position.y} ${obj.position.z}`;
    const commonProps = {
      position: positionStr,
      material: `color: ${obj.color}`,
      "data-object-id": obj.id,
    };

    switch (obj.type) {
      case "sphere":
        return <a-sphere key={obj.id} {...commonProps} radius="0.5" />;
      case "cylinder":
        return <a-cylinder key={obj.id} {...commonProps} radius="0.5" height="1" />;
      case "box":
      default:
        return <a-box key={obj.id} {...commonProps} />;
    }
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

        {/* 注釈 */}
        {showAnnotations && <AnnotationLayer />}
      </a-scene>
    </div>
  );
}
