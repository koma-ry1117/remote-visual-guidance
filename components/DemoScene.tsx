"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    // A-Frameカスタムコンポーネント: マウスドラッグ方向を反転
    if (typeof window !== "undefined" && (window as any).AFRAME) {
      const AFRAME = (window as any).AFRAME;

      if (!AFRAME.components["reversed-look-controls"]) {
        AFRAME.registerComponent("reversed-look-controls", {
          dependencies: ["position", "rotation"],

          init: function () {
            this.previousMouseEvent = null;
            this.mouseDown = false;
            this.pitchObject = new AFRAME.THREE.Object3D();
            this.yawObject = new AFRAME.THREE.Object3D();
            this.yawObject.add(this.pitchObject);

            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);

            this.el.sceneEl.addEventListener("mousedown", this.onMouseDown);
            document.addEventListener("mousemove", this.onMouseMove);
            document.addEventListener("mouseup", this.onMouseUp);
          },

          onMouseDown: function () {
            this.mouseDown = true;
          },

          onMouseUp: function () {
            this.mouseDown = false;
          },

          onMouseMove: function (event: any) {
            if (!this.mouseDown) return;

            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            // 方向を反転（マイナスを付ける）
            this.yawObject.rotation.y -= movementX * 0.002;
            this.pitchObject.rotation.x -= movementY * 0.002;

            // ピッチの制限（上下の回転を制限）
            this.pitchObject.rotation.x = Math.max(
              -Math.PI / 2,
              Math.min(Math.PI / 2, this.pitchObject.rotation.x)
            );
          },

          tick: function () {
            const el = this.el;
            el.object3D.rotation.y = this.yawObject.rotation.y;
            el.object3D.rotation.x = this.pitchObject.rotation.x;
          },

          remove: function () {
            this.el.sceneEl.removeEventListener("mousedown", this.onMouseDown);
            document.removeEventListener("mousemove", this.onMouseMove);
            document.removeEventListener("mouseup", this.onMouseUp);
          },
        });
      }
    }
  }, []);

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
        {/* カメラ（反転コントロール） */}
        <a-entity camera reversed-look-controls wasd-controls position="0 1.6 0"></a-entity>

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
