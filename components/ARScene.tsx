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
      "a-circle": any;
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

    // 塗りつぶし（20%不透明）のプロパティ
    const fillProps = {
      position,
      rotation,
      material: `color: ${markerColor}; opacity: 0.2; transparent: true; side: double`,
    };

    // 枠線（100%不透明）のプロパティ
    const wireframeProps = {
      position,
      rotation,
      material: `color: ${markerColor}; opacity: 1.0; transparent: false; wireframe: true; side: double`,
    };

    switch (objectType) {
      case "circle":
        return (
          <a-entity>
            <a-circle {...fillProps} radius="0.05" />
            <a-circle {...wireframeProps} radius="0.05" />
          </a-entity>
        );
      case "box":
      default:
        // 正方形（平面）を使用
        return (
          <a-entity>
            <a-plane {...fillProps} width="0.1" height="0.1" />
            <a-plane {...wireframeProps} width="0.1" height="0.1" />
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
