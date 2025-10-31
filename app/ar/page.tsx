"use client";

import { useState } from "react";
import Script from "next/script";
import ARScene from "@/components/ARScene";
import DemoScene from "@/components/DemoScene";
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
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [arjsLoaded, setArjsLoaded] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  return (
    <>
      {/* A-Frame スクリプトを先にロード */}
      <Script
        src="https://aframe.io/releases/0.9.2/aframe.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("A-Frame loaded");
          setAframeLoaded(true);
        }}
      />
      {/* AR.js スクリプトをA-Frameのロード後にロード（ARモードのみ） */}
      {!demoMode && aframeLoaded && (
        <Script
          src="https://cdn.jsdelivr.net/npm/ar.js@2.2.2/aframe/build/aframe-ar.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("AR.js loaded");
            setArjsLoaded(true);
          }}
        />
      )}

      <ARAnnotationProvider>
        <div className="fixed inset-0 w-full h-screen overflow-hidden">
          {demoMode ? (
            aframeLoaded ? (
              <DemoScene markerColor={markerColor} objectType={objectType} />
            ) : (
              <div className="flex items-center justify-center h-screen">
                <p>3D環境を読み込み中...</p>
              </div>
            )
          ) : arjsLoaded ? (
            <ARScene markerColor={markerColor} objectType={objectType} />
          ) : (
            <div className="flex items-center justify-center h-screen">
              <p>AR環境を読み込み中...</p>
            </div>
          )}

          {/* 作業手順パネル */}
          {showWorkflow && <WorkflowPanel workflow={sampleWorkflow} />}

          {/* 注釈ツールバー */}
          <AnnotationToolbar />

          {/* コントロールパネル */}
          <div
            className={`fixed top-4 left-4 z-50 transition-transform duration-300 max-h-[calc(100vh-8rem)] w-72 ${
              showControls ? "translate-y-0" : "-translate-y-full opacity-0"
            }`}
          >
            <div className="space-y-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-h-full overflow-y-auto w-full">
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

              {/* モード切り替え */}
              <div className="pb-2 border-b border-gray-200">
                <p className="text-xs text-gray-600 mb-1">表示モード:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDemoMode(false)}
                    className={`flex-1 px-3 py-1.5 text-xs rounded ${
                      !demoMode
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    ARモード
                  </button>
                  <button
                    onClick={() => setDemoMode(true)}
                    className={`flex-1 px-3 py-1.5 text-xs rounded ${
                      demoMode
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    デモモード
                  </button>
                </div>
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
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors text-sm"
          >
            {showControls ? "パネルを非表示" : "パネルを表示"}
          </button>

          {/* 使用方法 */}
          <div className="fixed bottom-4 left-4 z-40 bg-black/70 text-white p-3 rounded-lg text-sm max-w-xs max-h-64 overflow-y-auto">
            <p className="font-semibold mb-1">使い方:</p>
            {demoMode ? (
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>左クリック: マウス位置に新しい図形を追加</li>
                <li>右クリック: 図形をクリックして削除</li>
                <li>左上で図形の種類と色を変更できます</li>
                <li>視点は固定（カメラ移動で視界を変更）</li>
              </ol>
            ) : (
              <>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>HIROマーカーをカメラに向けてください</li>
                  <li>画面下部から注釈を追加できます</li>
                  <li>右側で作業手順を確認できます</li>
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
              </>
            )}
          </div>
        </div>
      </ARAnnotationProvider>
    </>
  );
}
