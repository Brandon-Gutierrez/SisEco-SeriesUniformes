import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeriesForm } from "@/components/SeriesForm";
import { ResultDisplay } from "@/components/ResultDisplay";
import { GraphDisplay } from "@/components/GraphDisplay";

export default function SeriesUniformesApp() {
  const [result, setResult] = React.useState(null);
  const [graphData, setGraphData] = React.useState(null);

  const handleCalculation = (data: any) => {
    const i = data.rate / 100;
    const n = data.n;
    const pmt = data.pmt;
    const tipo = data.tipo;
    const diferido = data.diferido;

    let calculated;
    let graph;

    if (tipo === "ordinaria") {
      const factor = (Math.pow(1 + i, n) - 1) / (i * Math.pow(1 + i, n));
      const presentValue = pmt * factor;
      calculated = {
        formula: `P = PMT * [(1 + i)^n - 1] / [i(1 + i)^n]`,
        value: presentValue.toFixed(2),
      };
      graph = Array.from({ length: n }, (_, index) => ({ x: index + 1, y: pmt }));
    } else if (tipo === "diferida") {
      const m = diferido;
      const factor = (Math.pow(1 + i, n) - 1) / (i * Math.pow(1 + i, n));
      const presentValue = pmt * factor * Math.pow(1 + i, -m);
      calculated = {
        formula: `P = PMT * [(1 + i)^n - 1] / [i(1 + i)^n] * (1 + i)^-m`,
        value: presentValue.toFixed(2),
      };
      graph = Array.from({ length: n + m }, (_, index) => ({ x: index + 1, y: index + 1 > m ? pmt : 0 }));
    } else if (tipo === "creciente") {
      const g = data.growthRate / 100;
      const factor = (1 - Math.pow((1 + g) / (1 + i), n)) / (i - g);
      const presentValue = pmt * factor;
      calculated = {
        formula: `P = PMT * [1 - ((1 + g)/(1 + i))^n] / (i - g)`,
        value: presentValue.toFixed(2),
      };
      graph = Array.from({ length: n }, (_, index) => ({ x: index + 1, y: pmt * Math.pow(1 + g, index) }));
    } else if (tipo === "decreciente") {
      const g = data.growthRate / 100;
      const factor = (1 - Math.pow((1 - g) / (1 + i), n)) / (i + g);
      const presentValue = pmt * factor;
      calculated = {
        formula: `P = PMT * [1 - ((1 - g)/(1 + i))^n] / (i + g)`,
        value: presentValue.toFixed(2),
      };
      graph = Array.from({ length: n }, (_, index) => ({ x: index + 1, y: pmt * Math.pow(1 - g, index) }));
    }

    setResult(calculated);
    setGraphData(graph);
  };

  return (
    <main className="p-4 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Calculadora de Series Uniformes</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <SeriesForm onCalculate={handleCalculation} />
        </CardContent>
      </Card>

      <Tabs defaultValue="resultado" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resultado">Resultado</TabsTrigger>
          <TabsTrigger value="grafica">Gráfica</TabsTrigger>
        </TabsList>
        <TabsContent value="resultado">
          <ResultDisplay result={result} />
        </TabsContent>
        <TabsContent value="grafica">
          <GraphDisplay data={graphData} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
