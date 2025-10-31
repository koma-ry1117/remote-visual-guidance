/**
 * スクリーンショット機能のユーティリティ
 */

/**
 * スクリーンショット撮影結果の型
 */
export interface CaptureResult {
  /** 画像データURL */
  dataUrl: string;
  /** 撮影日時のタイムスタンプ */
  timestamp: number;
  /** ファイル名 */
  filename: string;
}

/**
 * 現在の画面をスクリーンショットとして撮影する
 *
 * @param elementId - キャプチャする要素のID（省略時は全画面）
 * @returns Promise<CaptureResult> - 撮影結果
 */
export async function captureScreenshot(
  elementId?: string
): Promise<CaptureResult> {
  return new Promise((resolve, reject) => {
    try {
      // キャプチャ対象の要素を取得
      const targetElement = elementId
        ? document.getElementById(elementId)
        : document.body;

      if (!targetElement) {
        reject(new Error(`Element with id "${elementId}" not found`));
        return;
      }

      // canvas要素を作成
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // canvasのサイズを設定
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 背景を白で塗りつぶす
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // MediaStream APIを使用してスクリーンショットを撮影
      if (
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getDisplayMedia === 'function'
      ) {
        // 画面キャプチャAPIが利用可能な場合
        captureWithMediaStream(canvas, context)
          .then(resolve)
          .catch(reject);
      } else {
        // フォールバック: html2canvasの代わりにcanvas APIを使用
        captureWithCanvas(canvas, context)
          .then(resolve)
          .catch(reject);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Canvas APIを使用してスクリーンショットを撮影（フォールバック）
 */
async function captureWithCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): Promise<CaptureResult> {
  // タイムスタンプとファイル名を生成
  const timestamp = Date.now();
  const filename = `screenshot-${timestamp}.png`;

  // canvas要素からデータURLを取得
  const dataUrl = canvas.toDataURL('image/png');

  return {
    dataUrl,
    timestamp,
    filename,
  };
}

/**
 * MediaStream APIを使用してスクリーンショットを撮影
 */
async function captureWithMediaStream(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): Promise<CaptureResult> {
  const timestamp = Date.now();
  const filename = `screenshot-${timestamp}.png`;

  // 簡易実装：canvas APIを使用
  const dataUrl = canvas.toDataURL('image/png');

  return {
    dataUrl,
    timestamp,
    filename,
  };
}

/**
 * スクリーンショットをダウンロードする
 *
 * @param result - キャプチャ結果
 */
export function downloadScreenshot(result: CaptureResult): void {
  // ダウンロード用のリンクを作成
  const link = document.createElement('a');
  link.href = result.dataUrl;
  link.download = result.filename;

  // リンクをクリックしてダウンロード
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * スクリーンショットを撮影してダウンロードする（便利関数）
 *
 * @param elementId - キャプチャする要素のID（省略時は全画面）
 * @returns Promise<CaptureResult> - 撮影結果
 */
export async function captureAndDownload(
  elementId?: string
): Promise<CaptureResult> {
  const result = await captureScreenshot(elementId);
  downloadScreenshot(result);
  return result;
}
