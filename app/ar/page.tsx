"use client";

import { useState } from "react";
import ARScene from "@/components/ARScene";
import ColorPicker from "@/components/ColorPicker";
import ObjectSelector from "@/components/ObjectSelector";

export default function ARPage() {
  const [markerColor, setMarkerColor] = useState("#FF0000");
  const [objectType, setObjectType] = useState<"box" | "sphere" | "cylinder">(
    "box"
  );
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="relative w-full h-screen">
      <ARScene markerColor={markerColor} objectType={objectType} />

      {/* コントロールパネル */}
      <div
        className={`absolute top-4 left-4 right-4 z-10 transition-transform duration-300 ${
          showControls ? "translate-y-0" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="space-y-3 max-w-md mx-auto">
          <ColorPicker color={markerColor} onChange={setMarkerColor} />
          <ObjectSelector objectType={objectType} onChange={setObjectType} />
        </div>
      </div>

      {/* トグルボタン */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        {showControls ? "コントロールを非表示" : "コントロールを表示"}
      </button>

      {/* 使用方法 */}
      <div className="absolute bottom-20 left-4 right-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm">
        <p className="font-semibold mb-1">使い方:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>HIROマーカーをカメラに向けてください</li>
          <li>マーカー上に3Dオブジェクトが表示されます</li>
          <li>上部のコントロールで色とオブジェクトを変更できます</li>
        </ol>
        <p className="mt-2 text-xs">
          HIROマーカー:{" "}
          <a
            href="https://ar-js-org.github.io/AR.js/data/images/hiro.png"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 underline"
          >
            ダウンロード
          </a>
        </p>
      </div>
    </div>
  );
}
