import { useEffect, useState } from 'react'
import './App.css'
import { Table } from '@mantine/core';
import data from "./dataset/Manufac _ India Agro Dataset.json"
import DataTable from './components/DataTable';


interface YearlyAggregation {
  Year: string;
  MaxCrop: string;
  MinCrop: string;
}

interface CropAggregation {
  Crop: string;
  AvgYield: string;
  AvgArea: string;
}

interface CropData {
  Year: string;
  CropName: string;
  CropProduction: number;
  Yield: number;
  CultivationArea: number;
}




function App() {

  const [table1Data, setTable1Data] = useState<YearlyAggregation[]>([]);
  const [table2Data, setTable2Data] = useState<CropAggregation[]>([]);

  useEffect(() => {

    const processedData: any[] = data.map((row) => ({
      Year: row.Year,
      CropName: row["Crop Name"],
      CropProduction: row["Crop Production (UOM:t(Tonnes))"] ? row["Crop Production (UOM:t(Tonnes))"] : 0,
      Yield: row["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] ? row["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] : 0,
      CultivationArea: row["Area Under Cultivation (UOM:Ha(Hectares))"] ? row["Area Under Cultivation (UOM:Ha(Hectares))"] : 0,
    }));

    setTable1Data(processYearlyAggregation(processedData));
    setTable2Data(processCropAggregation(processedData));

  }, []);


  const processYearlyAggregation = (data: CropData[]): YearlyAggregation[] => {
    const yearlyData: YearlyAggregation[] = [];

    const groupedByYear = data.reduce((acc, row) => {
      if (!acc[row.Year]) acc[row.Year] = [];
      acc[row.Year].push(row);
      return acc;
    }, {} as Record<string, CropData[]>);

    for (const year in groupedByYear) {
      const crops = groupedByYear[year];
      const maxCrop = crops.reduce((max, crop) => (crop.CropProduction > max.CropProduction ? crop : max), crops[0]);
      const minCrop = crops.reduce((min, crop) => (crop.CropProduction < min.CropProduction ? crop : min), crops[0]);

      yearlyData.push({
        Year: year,
        MaxCrop: maxCrop.CropName,
        MinCrop: minCrop.CropName,
      });
    }

    return yearlyData;
  };

  const processCropAggregation = (data: CropData[]): CropAggregation[] => {
    const cropData: CropAggregation[] = [];

    const groupedByCrop = data.reduce((acc, row) => {
      if (!acc[row.CropName]) acc[row.CropName] = { totalYield: 0, totalArea: 0, count: 0 };
      acc[row.CropName].totalYield += row.Yield;
      acc[row.CropName].totalArea += row.CultivationArea;
      acc[row.CropName].count++;
      return acc;
    }, {} as Record<string, { totalYield: number; totalArea: number; count: number }>);

    for (const crop in groupedByCrop) {
      const { totalYield, totalArea, count } = groupedByCrop[crop];
      cropData.push({
        Crop: crop,
        AvgYield: (totalYield / count).toFixed(3),
        AvgArea: (totalArea / count).toFixed(3),
      });
    }

    return cropData;
  };

  return (
    <>
    <h2>Yearly Aggregation of Crop Production</h2>
      <DataTable columns={[
        "Year",
        "MinCrop",
        "MaxCrop",
      ]} rows={table1Data}
        headings={[
          "Year",
          "Crop with Maximum Production in that Year",
          "Crop with Maximum Production in that Year",
        ]}
      />

      <h2 style={{marginTop: "4rem"}}>Crop Aggregation: Average Yield and Area</h2>
      <DataTable
        columns={[
          "Crop", 
          "AvgYield", 
          "AvgArea"
        ]}
        rows={table2Data}
        headings={[
          "Crop", 
          "Avg Yield (Kg/Ha)", 
          "Avg Area (Ha)"
        ]}
      />
    </>
  );
}

export default App
