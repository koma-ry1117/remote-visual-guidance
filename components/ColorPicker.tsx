"use client";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const presetColors = [
    { name: "赤", value: "#FF0000" },
    { name: "青", value: "#0000FF" },
    { name: "緑", value: "#00FF00" },
    { name: "黄", value: "#FFFF00" },
    { name: "紫", value: "#FF00FF" },
    { name: "橙", value: "#FFA500" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3">マーカー色選択</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor.value}
            onClick={() => onChange(presetColor.value)}
            className={`p-3 rounded border-2 ${
              color === presetColor.value
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: presetColor.value }}
            title={presetColor.name}
          >
            <span className="text-white text-xs font-bold drop-shadow">
              {presetColor.name}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="colorPicker" className="text-sm font-medium">
          カスタム色:
        </label>
        <input
          id="colorPicker"
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded border border-gray-300 cursor-pointer"
        />
      </div>
    </div>
  );
}
