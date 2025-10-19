import React from 'react';
import keysData from '../data/keys.json';

export default function FourKeys() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Four Keys</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {keysData.map((key) => (
          <article key={key.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h2 className="font-semibold text-lg mb-2">{key.name}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              {key.definition || key.def || key.description}
            </p>

            {Array.isArray(key.practices) && key.practices.length > 0 && (
              <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 mb-2">
                {key.practices.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}

            {key.example && (
              <div className="text-xs italic text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Example:</span> {" "}{key.example}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}