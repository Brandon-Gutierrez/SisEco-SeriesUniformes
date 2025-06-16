import Calculator from './components/calculator/CalculatorForm';

function App() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
          Calculadora de Series Uniformes
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Resuelve problemas de series ordinarias, anticipadas y diferidas con visualizaciones claras
        </p>
      </header>
      
      <main>
        <Calculator />
      </main>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © 2025 - Herramienta Financiera Avanzada
      </footer>
    </div>
  );
}

export default App;