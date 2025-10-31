"use client";

import { useRef } from "react";
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

export default function ARScene({
  markerColor = "#FF0000",
  objectType = "box",
  showAnnotations = true,
}: ARSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const renderObject = () => {
    const position = "0 0.05 0";
    const rotation = "0 0 0";

    const commonProps = {
      position,
      rotation,
      material: `color: ${markerColor}; side: double`,
    };

    switch (objectType) {
      case "circle":
        // リング形状で枠線のみを描画
        return (
          <a-ring
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
          <a-entity position={position} rotation={rotation}>
            {/* 上辺 */}
            <a-box
              position={`0 ${halfSize} 0`}
              width={size}
              height={lineThickness}
              depth={lineThickness}
              material={`color: ${markerColor}`}
            />
            {/* 下辺 */}
            <a-box
              position={`0 ${-halfSize} 0`}
              width={size}
              height={lineThickness}
              depth={lineThickness}
              material={`color: ${markerColor}`}
            />
            {/* 左辺 */}
            <a-box
              position={`${-halfSize} 0 0`}
              width={lineThickness}
              height={size}
              depth={lineThickness}
              material={`color: ${markerColor}`}
            />
            {/* 右辺 */}
            <a-box
              position={`${halfSize} 0 0`}
              width={lineThickness}
              height={size}
              depth={lineThickness}
              material={`color: ${markerColor}`}
            />
          </a-entity>
        );
    }
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
          <a-entity>{renderObject()}</a-entity>
          {showAnnotations && <AnnotationLayer />}
        </a-marker>
        <a-entity camera look-controls="enabled: false" wasd-controls="enabled: false"></a-entity>
      </a-scene>
    </div>
  );
}
