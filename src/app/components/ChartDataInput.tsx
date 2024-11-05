import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

const ChartDataInput: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8884d8');
  const [chartTitle, setChartTitle] = useState('');

  const handleAddDataPoint = () => {
    if (newName && newValue) {
      setDataPoints([
        ...dataPoints,
        {
          name: newName,
          value: Number(newValue),
          color: selectedColor
        }
      ]);
      setNewName('');
      setNewValue('');
    }
  };

  const handleSaveChart = () => {
    if (chartRef.current) {
      // Clone the chart div to remove the button
      const chartClone = chartRef.current.cloneNode(true) as HTMLElement;
      const buttonContainer = chartClone.querySelector('div.flex.justify-center');
      if (buttonContainer) {
        buttonContainer.remove();
      }

      const styleSheet = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          
          body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Poppins', sans-serif;
            margin: 0;
          }
          
          .chart-container {
            width: 1080px;
            backdrop-filter: blur(10px);
            animation: fadeIn 0.6s ease-out;
          }
          
          .chart-title {
            color: #000000;
            font-size: 1.875rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 1.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      `;

      const chartHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${styleSheet}
          </head>
          <body>
            <div class="chart-container">
              ${chartClone.innerHTML}
            </div>
          </body>
        </html>
      `;

      const blob = new Blob([chartHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartTitle || 'chart'}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
          placeholder="Título do gráfico"
          className="border p-2 rounded w-full mb-4"
        />
      </div>
      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nome da categoria"
          className="border p-2 rounded"
        />
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Valor"
          className="border p-2 rounded"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="barColor" className="text-sm">Cor da barra:</label>
          <input
            type="color"
            id="barColor"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-12 h-8 cursor-pointer"
          />
        </div>
        <button
          onClick={handleAddDataPoint}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Adicionar Dados
        </button>
      </div>

      {dataPoints.length > 0 && (
        <div className="mt-8" ref={chartRef}>
          {chartTitle && (
            <h2 className="chart-title">{chartTitle}</h2>
          )}
          <BarChart
            width={1080}
            height={600}
            data={dataPoints}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis type="number" stroke="#4a5568" />
            <YAxis dataKey="name" type="category" stroke="#4a5568"
            style={{
              fill: '#2d3748',
              fontWeight: 600,
              fontSize: '25px'
            }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar
              dataKey="value"
              name="Valor"
              fill="#8884d8"
              shape={(props: { index?: any; x?: any; y?: any; width?: any; height?: any; fill?: any; }) => {
                const { x, y, width, height } = props;
                const dataPoint = dataPoints[props.index];
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={dataPoint.color}
                    rx={4}
                    ry={4}
                  />
                );
              }}
            >
              <LabelList
                dataKey="value"
                position="right"
                offset={10}  // Adds 10px spacing between bar and value
                style={{
                  fill: '#2d3748',
                  fontWeight: 600,
                  fontSize: '25px'
                }}
              />
            </Bar>
          </BarChart>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleSaveChart}
              className="btn btn-primary"
            >
              Exportar Gráfico
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDataInput;
