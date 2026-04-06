import React from 'react';

// Propsの型は必ずinterfaceで定義し、明確な命名にする
interface MyComponentProps {
  /** コンポーネントに表示するタイトル */
  title: string;
  /** クリック時のハンドラ */
  onClick?: () => void;
  /** 補助的な説明文（任意） */
  description?: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onClick,
  description,
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      <button
        type="button"
        onClick={onClick}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
        // a11y: アクセシビリティのためのラベル
        aria-label={`${title}のアクションを実行`}
      >
        アクション
      </button>
    </div>
  );
};
