import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

const ChartDataInput: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8884d8');

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

  return (
    <div className="p-4">
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
        <div className="mt-8">
          <BarChart 
            width={600} 
            height={400} 
            data={dataPoints}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar 
              dataKey="value" 
              name="Valor"
              fill="#8884d8"
              shape={(props: { index?: any; x?: any; y?: any; width?: any; height?: any; fill?: any; }) => {
                const { x, y, width, height, fill } = props;
                const dataPoint = dataPoints[props.index];
                return <rect x={x} y={y} width={width} height={height} fill={dataPoint.color} />;
              }}
            >
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default ChartDataInput;
