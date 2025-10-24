"use client";

interface ObjectSelectorProps {
  objectType: "box" | "sphere" | "cylinder";
  onChange: (type: "box" | "sphere" | "cylinder") => void;
}

export default function ObjectSelector({
  objectType,
  onChange,
}: ObjectSelectorProps) {
  const objectTypes = [
    { value: "box" as const, label: "立方体", icon: "⬜" },
    { value: "sphere" as const, label: "球体", icon: "⚫" },
    { value: "cylinder" as const, label: "円柱", icon: "🔵" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3">オブジェクト選択</h3>
      <div className="grid grid-cols-3 gap-2">
        {objectTypes.map((obj) => (
          <button
            key={obj.value}
            onClick={() => onChange(obj.value)}
            className={`p-3 rounded border-2 transition-all ${
              objectType === obj.value
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            <div className="text-2xl mb-1">{obj.icon}</div>
            <div className="text-xs font-medium">{obj.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
