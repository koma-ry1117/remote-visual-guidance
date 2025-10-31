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
      "a-sphere": any;
      "a-cylinder": any;
    }
  }
}

interface ARSceneProps {
  markerColor?: string;
  objectType?: "box" | "sphere" | "cylinder";
  showAnnotations?: boolean;
}

export default function ARScene({
  markerColor = "#FF0000",
  objectType = "box",
  showAnnotations = true,
}: ARSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const renderObject = () => {
    const commonProps = {
      position: "0 0.05 0",
      material: `color: ${markerColor}`,
    };

    switch (objectType) {
      case "sphere":
        return <a-sphere {...commonProps} radius="0.05" />;
      case "cylinder":
        return <a-cylinder {...commonProps} radius="0.05" height="0.1" />;
      case "box":
      default:
        return <a-box {...commonProps} width="0.1" height="0.1" depth="0.1" />;
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
