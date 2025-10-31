"use client";

import { useEffect, useRef, useState } from "react";
import AnnotationLayer from "./annotations/AnnotationLayer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": any;
      "a-marker": any;
      "a-entity": any;
      "a-box": any;
      "a-ring": any;
    }
  }
}

interface ARSceneProps {
  markerColor?: string;
  objectType?: "box" | "circle";
  showAnnotations?: boolean;
}

interface SceneObject {
  id: string;
  type: "box" | "circle";
  position: { x: number; y: number; z: number };
  color: string;
  createdAt: number;
}

export default function ARScene({
  markerColor = "#FF0000",
  objectType = "box",
  showAnnotations = true,
}: ARSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [previewObject, setPreviewObject] = useState<SceneObject | null>(null);

  // パーティクルの自動削除（3秒後にフェードアウト）
  useEffect(() => {
    const fadeOutDuration = 3000; // 3秒
    const interval = setInterval(() => {
      const now = Date.now();
      setObjects((prev) =>
        prev.filter((obj) => now - obj.createdAt < fadeOutDuration)
      );
    }, 100); // 100msごとにチェック

    return () => clearInterval(interval);
  }, []);

  // クリックイベントハンドラー
  useEffect(() => {
    let mounted = true;
    let cleanupFn: (() => void) | undefined;

    const handleClick = (event: MouseEvent) => {
      console.log("Click detected in AR mode");

      const scene = sceneRef.current?.querySelector("a-scene");
      if (!scene) return;

      const canvas = sceneRef.current?.querySelector("canvas");
      if (!canvas) return;

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

      // レイキャスターを使用してマーカーとの交点を取得
      const raycaster = new (window as any).THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // マーカーエンティティを取得
      const marker = scene.querySelector("a-marker");
      if (!marker || !(marker as any).object3D) return;

      // マーカー内のすべてのオブジェクトに対してレイキャスト
      const intersects = raycaster.intersectObjects((marker as any).object3D.children, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = intersect.point;

        // マーカーのローカル座標に変換
        const markerObject3D = (marker as any).object3D;
        const localPoint = markerObject3D.worldToLocal(point.clone());

        const now = Date.now();
        const newObject: SceneObject = {
          id: `particle-${now}`,
          type: objectType,
          position: { x: localPoint.x, y: localPoint.y, z: localPoint.z },
          color: markerColor,
          createdAt: now,
        };

        console.log("Adding particle at", localPoint);
        setObjects((prev) => [...prev, newObject]);
      }
    };

    const setupClickHandler = () => {
      if (!mounted) return;

      const canvas = sceneRef.current?.querySelector("canvas");
      if (!canvas) {
        console.log("Canvas not found, retrying...");
        setTimeout(setupClickHandler, 100);
        return;
      }

      console.log("Setting up click handler for AR mode");
      canvas.addEventListener("click", handleClick);

      cleanupFn = () => {
        console.log("Cleaning up click handler");
        canvas.removeEventListener("click", handleClick);
      };
    };

    setupClickHandler();

    return () => {
      mounted = false;
      if (cleanupFn) cleanupFn();
    };
  }, [objectType, markerColor]);

  const renderObject = (obj: SceneObject) => {
    const positionStr = `${obj.position.x} ${obj.position.y} ${obj.position.z}`;

    const isPreview = obj.id === "preview";

    // パーティクルのフェードアウト計算（プレビューは固定不透明度）
    const fadeOutDuration = 3000; // 3秒
    let opacity = 1;

    if (isPreview) {
      opacity = 0.5; // プレビューは半透明
    } else {
      const elapsedTime = Date.now() - obj.createdAt;
      opacity = Math.max(0, 1 - elapsedTime / fadeOutDuration);
    }

    // マーカーを壁として扱うため、円を90度回転（X軸で回転）
    const rotation = "-90 0 0";

    const commonProps = {
      position: positionStr,
      rotation,
      material: `color: ${obj.color}; opacity: ${opacity}; transparent: true; side: double`,
      "data-object-id": obj.id,
    };

    // パーティクル風の円形リング
    return (
      <a-ring
        key={obj.id}
        {...commonProps}
        radius-inner="0.04"
        radius-outer="0.05"
        animation={!isPreview ? `property: components.material.material.opacity; from: 1; to: 0; dur: ${fadeOutDuration}; easing: linear` : undefined}
      />
    );
  };

  return (
    <div ref={sceneRef} className="w-full h-screen">
      <a-scene
        embedded
        arjs="sourceType: webcam; trackingMethod: best; debugUIEnabled: false; sourceWidth: 1280; sourceHeight: 960;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
        device-orientation-permission-ui="enabled: false"
      >
        <a-marker preset="hiro">
          {/* クリック検出用の透明な平面 */}
          <a-plane
            position="0 0 0"
            rotation="0 0 0"
            width="2"
            height="2"
            material="color: #FFFFFF; opacity: 0; transparent: true"
            visible="true"
          ></a-plane>

          {/* パーティクルオブジェクト（複数） */}
          {objects.map((obj) => renderObject(obj))}

          {/* プレビューオブジェクト */}
          {previewObject && renderObject(previewObject)}

          {showAnnotations && <AnnotationLayer />}
        </a-marker>
        <a-entity camera look-controls="enabled: false" wasd-controls="enabled: false"></a-entity>
      </a-scene>
    </div>
  );
}
