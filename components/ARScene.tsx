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
      material: `color: ${markerColor}; transparent: true; side: double`,
    };

    // ARモードでは常に表示（フェードアウトなし）
    return (
      <a-ring
        {...commonProps}
        radius-inner="0.04"
        radius-outer="0.05"
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
          <a-entity>{renderObject()}</a-entity>
          {showAnnotations && <AnnotationLayer />}
        </a-marker>
        <a-entity camera look-controls="enabled: false" wasd-controls="enabled: false"></a-entity>
      </a-scene>
    </div>
  );
}
