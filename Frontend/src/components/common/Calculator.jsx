import React, { useState } from 'react';
import { Calculator as CalculatorIcon, X, Clock, Trash2 } from 'lucide-react';

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num) => {
    setDisplay(display === '0' ? String(num) : display + num);
  };

  const handleOperator = (op) => {
    setDisplay(display + ' ' + op + ' ');
  };

  const handleEqual = () => {
    try {
      // Replace × with *, ÷ with /
      const expression = display.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(expression);
      setHistory([{ expression, result }, ...history.slice(0, 9)]);
      setDisplay(String(result));
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <CalculatorIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Calculator</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Clock className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {showHistory ? (
            <div className="p-2">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">History</h4>
                <button
                  onClick={clearHistory}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No history</p>
                ) : (
                  history.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => setDisplay(String(item.result))}
                    >
                      <div className="text-gray-500">{item.expression}</div>
                      <div className="font-medium">{item.result}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="p-2">
                <input
                  type="text"
                  className="w-full p-2 text-right text-lg font-mono bg-gray-50 dark:bg-gray-700 rounded"
                  value={display}
                  readOnly
                />
              </div>

              <div className="p-2 grid grid-cols-4 gap-1">
                {/* First row */}
                <button onClick={handleClear} className="calc-btn col-span-2 bg-red-100 hover:bg-red-200 text-red-600">C</button>
                <button onClick={() => handleOperator('÷')} className="calc-btn bg-gray-100">÷</button>
                <button onClick={() => handleOperator('×')} className="calc-btn bg-gray-100">×</button>

                {/* Number pad */}
                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumber(num)}
                    className="calc-btn"
                  >
                    {num}
                  </button>
                ))}

                {/* Operators */}
                <button onClick={() => handleOperator('-')} className="calc-btn bg-gray-100">-</button>
                <button onClick={() => handleNumber('0')} className="calc-btn">0</button>
                <button onClick={() => handleNumber('.')} className="calc-btn">.</button>
                <button onClick={() => handleOperator('+')} className="calc-btn bg-gray-100">+</button>

                {/* Equal button */}
                <button
                  onClick={handleEqual}
                  className="calc-btn col-span-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                >
                  =
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;
