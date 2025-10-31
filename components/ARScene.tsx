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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // A-Frame と AR.js のスクリプトを動的にロード
    const loadScripts = async () => {
      if (typeof window === "undefined") return;

      // A-Frame のロード (AR.js 2.2.2と確実に互換性のあるバージョン)
      if (!document.querySelector('script[src*="aframe"]')) {
        const aframeScript = document.createElement("script");
        aframeScript.src =
          "https://aframe.io/releases/0.9.2/aframe.min.js";
        document.head.appendChild(aframeScript);

        await new Promise((resolve) => {
          aframeScript.onload = resolve;
        });

        // A-Frameが完全に初期化されるまで待機
        await new Promise((resolve) => {
          const checkAFrame = () => {
            if (typeof (window as any).AFRAME !== "undefined" && typeof (window as any).THREE !== "undefined") {
              resolve(true);
            } else {
              setTimeout(checkAFrame, 50);
            }
          };
          checkAFrame();
        });
      }

      // AR.js のロード
      if (!document.querySelector('script[src*="aframe-ar"]')) {
        const arScript = document.createElement("script");
        arScript.src =
          "https://cdn.jsdelivr.net/npm/ar.js@2.2.2/aframe/build/aframe-ar.min.js";
        document.head.appendChild(arScript);

        await new Promise((resolve) => {
          arScript.onload = resolve;
        });
      }

      setIsLoaded(true);
    };

    loadScripts();
  }, []);

  const renderObject = () => {
    const commonProps = {
      position: "0 0.5 0",
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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>AR環境を読み込み中...</p>
      </div>
    );
  }

  return (
    <div ref={sceneRef} className="w-full h-screen">
      <a-scene
        embedded
        arjs
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
