"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          WebAR Marker App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AR.js + A-Frame + Next.js で構築されたWebARアプリケーション
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            技術スタック
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="w-32 font-medium">フレームワーク:</span>
              <span>Next.js 14.x (App Router)</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">React:</span>
              <span>18.x</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">AR基盤:</span>
              <span>AR.js 3.4.6</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">3D描画:</span>
              <span>A-Frame 1.4.2 + Three.js 0.164.0</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">UI:</span>
              <span>Tailwind CSS 4.x</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">機能</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>マーカーベースのAR表示</li>
            <li>リアルタイムでの色変更</li>
            <li>複数の3Dオブジェクト選択（立方体、球体、円柱）</li>
            <li>レスポンシブUI</li>
          </ul>
        </div>

        <Link href="/ar">
          <button className="w-full bg-blue-600 text-white text-xl font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
            ARアプリを起動
          </button>
        </Link>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">注意事項</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• カメラへのアクセス許可が必要です</li>
            <li>• HTTPS環境での動作を推奨します</li>
            <li>
              • HIROマーカーを印刷するか、画面に表示してご使用ください
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
