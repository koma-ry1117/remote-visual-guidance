"use client";

import { useState } from "react";
import ARScene from "@/components/ARScene";
import ColorPicker from "@/components/ColorPicker";
import ObjectSelector from "@/components/ObjectSelector";
import { ARAnnotationProvider } from "@/contexts/ARAnnotationContext";
import AnnotationToolbar from "@/components/tools/AnnotationToolbar";
import WorkflowPanel from "@/components/workflow/WorkflowPanel";
import CaptureButton from "@/components/recording/CaptureButton";
import { sampleWorkflow } from "@/data/sampleWorkflow";

export default function ARPage() {
  const [markerColor, setMarkerColor] = useState("#FF0000");
  const [objectType, setObjectType] = useState<"box" | "sphere" | "cylinder">(
    "box"
  );
  const [showControls, setShowControls] = useState(true);
  const [showWorkflow, setShowWorkflow] = useState(true);

  return (
    <ARAnnotationProvider>
      <div className="relative w-full h-screen">
        <ARScene markerColor={markerColor} objectType={objectType} />

        {/* 作業手順パネル */}
        {showWorkflow && <WorkflowPanel workflow={sampleWorkflow} />}

        {/* 注釈ツールバー */}
        <AnnotationToolbar />

        {/* コントロールパネル */}
        <div
          className={`absolute top-4 left-4 z-10 transition-transform duration-300 ${
            showControls ? "translate-y-0" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="space-y-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800">
                オブジェクト設定
              </h3>
              <button
                onClick={() => setShowWorkflow(!showWorkflow)}
                className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                {showWorkflow ? "手順を非表示" : "手順を表示"}
              </button>
            </div>
            <ColorPicker color={markerColor} onChange={setMarkerColor} />
            <ObjectSelector objectType={objectType} onChange={setObjectType} />
            <div className="pt-2 border-t border-gray-200">
              <CaptureButton />
            </div>
          </div>
        </div>

        {/* トグルボタン */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors text-sm"
        >
          {showControls ? "パネルを非表示" : "パネルを表示"}
        </button>

        {/* 使用方法 */}
        <div className="absolute bottom-4 left-4 z-10 bg-black/70 text-white p-3 rounded-lg text-sm max-w-xs">
          <p className="font-semibold mb-1">使い方:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>HIROマーカーをカメラに向けてください</li>
            <li>画面下部から注釈を追加できます</li>
            <li>右上で作業手順を確認できます</li>
            <li>左上でオブジェクト設定やスクリーンショット撮影ができます</li>
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
    </ARAnnotationProvider>
  );
}
