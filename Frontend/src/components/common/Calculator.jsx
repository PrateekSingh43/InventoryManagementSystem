import React, { useState, useRef, useEffect } from 'react';
import { Calculator as CalculatorIcon, History, Trash2 } from 'lucide-react';

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const calculatorRef = useRef(null);

  const clearHistory = () => {
    setHistory([]);
  };

  // Group history by date
  const groupedHistory = history.reduce((groups, item) => {
    const date = new Date().toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Updated button layout
  const buttons = [
    { label: 'C', type: 'clear', className: 'bg-red-100 text-red-600' },
    { label: '⌫', type: 'backspace', className: 'bg-gray-100' },
    { label: '.', type: 'decimal' },
    { label: '÷', type: 'operator', className: 'bg-indigo-100 text-indigo-600', key: '/' },
    { label: '7', type: 'number', key: '7' },
    { label: '8', type: 'number', key: '8' },
    { label: '9', type: 'number', key: '9' },
    { label: '×', type: 'operator', className: 'bg-indigo-100 text-indigo-600', key: '*' },
    { label: '4', type: 'number', key: '4' },
    { label: '5', type: 'number', key: '5' },
    { label: '6', type: 'number', key: '6' },
    { label: '-', type: 'operator', className: 'bg-indigo-100 text-indigo-600', key: '-' },
    { label: '1', type: 'number', key: '1' },
    { label: '2', type: 'number', key: '2' },
    { label: '3', type: 'number', key: '3' },
    { label: '+', type: 'operator', className: 'bg-indigo-100 text-indigo-600', key: '+' },
    { label: '0', type: 'number', key: '0', className: 'col-span-2' },
    { label: '=', type: 'equals', className: 'bg-indigo-600 text-white col-span-2', key: 'Enter' }
  ];

  const buttonClasses = {
    default: 'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
    operator: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300',
    clear: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300',
    equals: 'bg-indigo-600 dark:bg-indigo-500 text-white',
    history: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
  };

  // Keyboard handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;

      e.preventDefault();
      const key = e.key;

      // Find matching button
      const button = buttons.find(b => b.key === key);
      if (button) {
        handleClick(button);
        return;
      }

      // Handle other special keys
      switch (key) {
        case 'Escape':
          setDisplay('0');
          break;
        case 'Backspace':
          handleClick({ type: 'backspace' });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, display]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calculatorRef.current && !calculatorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (button) => {
    switch (button.type) {
      case 'number':
      case 'decimal':
        setDisplay(prev => {
          if (prev === '0' && button.type === 'number') return button.label;
          if (button.type === 'decimal' && prev.includes('.')) return prev;
          return prev + button.label;
        });
        break;
      case 'operator':
        setDisplay(prev => prev + ` ${button.label} `);
        break;
      case 'equals':
        try {
          const expression = display.replace(/×/g, '*').replace(/÷/g, '/');
          const result = eval(expression);
          setHistory(prev => [{ expression: display, result }, ...prev.slice(0, 9)]);
          setDisplay(result.toString());
        } catch (error) {
          setDisplay('Error');
        }
        break;
      case 'clear':
        setDisplay('0');
        break;
      case 'backspace':
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={calculatorRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Calculator"
      >
        <CalculatorIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50">
          <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Header with history toggle */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                {showHistory && <span className="text-sm">Last 30 Days</span>}
              </button>
              <h3 className="text-sm font-medium">Calculator</h3>
              {showHistory ? (
                <button
                  onClick={clearHistory}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <div className="w-8" />
              )}
            </div>

            {/* Display section always visible */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800">
              <div className="text-right text-xl font-light truncate text-gray-900 dark:text-white">{display}</div>
            </div>

            {/* Conditional render of history or keypad */}
            <div className="max-h-[400px] overflow-y-auto">
              {showHistory ? (
                <div className="grid grid-cols-4 gap-0.5 p-1">
                  {Object.entries(groupedHistory)
                    .slice(0, 30) // Last 30 days
                    .map(([date, items]) => (
                      <React.Fragment key={date}>
                        {/* Date header spans full width */}
                        <div className="col-span-4 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
                          {date}
                        </div>
                        {/* History items in grid */}
                        {items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setDisplay(item.result.toString());
                              setShowHistory(false);
                            }}
                            className="p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors col-span-4"
                          >
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.expression}</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.result}</div>
                          </button>
                        ))}
                      </React.Fragment>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-0.5 p-1">
                  {buttons.map((button, index) => (
                    <button
                      key={index}
                      onClick={() => handleClick(button)}
                      className={`
                        p-3 text-sm font-medium rounded
                        hover:opacity-80 transition-opacity
                        ${buttonClasses[button.type] || buttonClasses.default}
                        ${button.label === '0' ? 'col-span-2' : ''}
                      `}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
