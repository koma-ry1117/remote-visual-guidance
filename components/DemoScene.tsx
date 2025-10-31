"use client";

import { useRef } from "react";
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

export default function DemoScene({
  markerColor = "#FF0000",
  objectType = "box",
  showAnnotations = true,
}: DemoSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const renderObject = () => {
    const commonProps = {
      position: "0 1 -3",
      material: `color: ${markerColor}`,
    };

    switch (objectType) {
      case "sphere":
        return <a-sphere {...commonProps} radius="0.5" />;
      case "cylinder":
        return <a-cylinder {...commonProps} radius="0.5" height="1" />;
      case "box":
      default:
        return <a-box {...commonProps} />;
    }
  };

  return (
    <div ref={sceneRef} className="w-full h-screen">
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
      >
        {/* カメラ */}
        <a-entity camera look-controls wasd-controls position="0 1.6 0"></a-entity>

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

        {/* 3Dオブジェクト */}
        <a-entity position="0 0 -3">
          {renderObject()}
          {showAnnotations && <AnnotationLayer />}
        </a-entity>
      </a-scene>
    </div>
  );
}
