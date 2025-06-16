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
      
      <footer className="mt-12 text-center text-gray-800 bg-blue-100 py-4 text-sm rounded-lg">
        <p>© 2025 - GRUPO 3 - SISTEMAS ECONÓMICOS -  INGENIERÍA EN SISTEMAS - UMSS 
          <br></br>INTEGRANTES: 
          <br></br>GUTIERREZ FAREL BRANDON LUIS
          <br></br>CALUSTRO CRESPO DANA LILI
          <br></br>MEDINA RODRIGUEZ MATEO JHOUSTIN
          <br></br>QUIROZ QUIROZ GIOVANI
          <br></br>PEÑA CLEMENTE KEVIN 
          <br></br>RAMIREZ ARANCIBIA FARID
        </p>
      </footer>
    </div>
  );
}

export default App;