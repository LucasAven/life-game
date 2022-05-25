import { useCallback, useRef, useState, useEffect } from "react";
import { produce } from "immer";
import "./app.css";
import FormsSelector from "./components/FormsSelector";
import Grid from "./components/Grid";

// array que contiene todas las combinaciones posibles
// para obtener los vecinos de una celda de forma relativa
const variants = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function App() {
  // estado para saber si la simulacion es paso a paso
  const [stepSimulation, setStepSimulation] = useState(false);

  // Estado que sirve para saber si se esta corriendo la simulación o no
  const [isSimulating, setIsSimulating] = useState(false);
  const simulatingRef = useRef(isSimulating);
  simulatingRef.current = isSimulating;

  // Estado que almacena la generación actual
  const [generation, setGeneration] = useState(0);
  const generationRef = useRef(generation);
  generationRef.current = generation;

  const [speed, setSpeed] = useState(300);

  const [rows, setRows] = useState(50);
  const [cols, setCols] = useState(30);

  // estado auxiliar para el control visual de la grilla
  const [gridCol, setGridCol] = useState(30);

  // Funcion que crea y devuelve una grilla vacia
  const createEmptyGrid = () => {
    const emptyGrid = [];
    for (let i = 0; i < rows; i++) {
      emptyGrid.push(Array.from(Array(cols), () => 0));
    }
    return emptyGrid;
  };

  // recorre todas las variantes y las aplica en base a la posicion de la celula
  // devolviendo la cantidad de vecinos vivos
  const countSphericNeighbors = (grid, x, y) => {
    // el reduce va sumando los valores de las celulas vecinos (0 o 1)
    return variants.reduce((acc, [i, j]) => {
      // a la posicion de la celula le suma el valor de la variante
      // para tener en cuenta el valor de la celula vecina que esta en el lado
      // opuesto a la celula actual, se le suma la cantidad de rows o cols (segun sea el caso)
      // y lueo se le hace el modulo del mismo para obtener la posicion equivalente sin pasar
      // el limite del array
      const row = (x + i + rows) % rows;
      const col = (y + j + cols) % cols;
      acc += grid[row][col];
      return acc;
    }, 0);
  };

  // Estado que almacena la grilla como un array de arrays [[0,0,0,0],[0,0,0,0,0]] en el cual cada
  // array representa una fila y cada elemento de esa fila representa una el estado de vida de la "celula"
  // siendo 0 = muerta y 1 = viva
  const [grid, setGrid] = useState(() => createEmptyGrid());

  // ref para manejar el dialog (puramente uso estetico)
  const dialogRef = useRef();

  // Funcion que reinicia la grilla a su estado inicial y detiene la simulación
  const resetGrid = () => {
    setGrid(createEmptyGrid());
    setGeneration(0);
    setIsSimulating(false);
  };

  // Funcion que se encarga de intercambiar(toogle) el estado de la celda al ser clikeada
  // en base a su posicion en la grilla
  const handleCellClick = (i, j) => {
    // Se usa la funcion produce para crear una copia de la grilla y modificarla
    // en lugar de modificar la original, para luego setearla en el estado
    setGrid(
      produce(grid, (mutableGrid) => {
        // Invierte el estado de la celda seleccionada
        mutableGrid[i][j] = 1 - mutableGrid[i][j];
      })
    );
  };

  // Funcion que cambia el estado de setIsSimulating a forma de toogle
  const handleButtonClick = (value) => {
    setIsSimulating(value);
    // se actualiza tambien la ref para evitar que dentro de la simulacion
    // aun no se haya actualizado el estado de setIsSimulating
    simulatingRef.current = value;
    if (value && !isSimulating) simulation();
  };

  // Funcion que reseta la grilla para que aplique los cambios
  // y actualiza la el valor auxiliar gridCol
  const applyChanges = (e) => {
    e.preventDefault();
    setGridCol(e.target.cols.value);
    resetGrid();
  };

  // useeffect que se encarga de iniciar el intervalo de tiempo de ejecucion de la
  // simulación y de su posterior cleanup
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(simulation, speed);
      return () => clearInterval(interval);
    }
    if (stepSimulation) {
      simulation(true);
      setStepSimulation(false);
    }
  }, [isSimulating, stepSimulation]);

  // Funcion que ejecuta la simulación almacenada en un useCallback para
  // evitar que se ejecute en cada renderizado
  const simulation = useCallback(
    (isStep = false) => {
      // se usa la ref ya que de otra manera el callback guardaria el valor
      // original del estado isSimulating y no el actualizado
      if (!simulatingRef.current && !isStep) return;

      // Se crea una copia de la grilla para no modificar la original y luego se le
      // es devuelta a setGrid para actualizar el estado
      setGrid((oldGrid) => {
        // se crea una grilla copia de la original pero que es mutable
        const newGrid = produce(oldGrid, (mutableGrid) => {
          // se recorren las filas y columnas de la grilla
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              // se obtiene el numero de vecinos vivos de la celda actual
              const neighbors = countSphericNeighbors(oldGrid, i, j);
              // caso 1: celula muere por soledad (neighbors < 2) o por sobrepobalcion (neighbors > 3)
              if (oldGrid[i][j] === 1 && (neighbors < 2 || neighbors > 3))
                mutableGrid[i][j] = 0;
              // caso 2: celula muerta con 3 vecinos "nace"
              else if (oldGrid[i][j] === 0 && neighbors === 3)
                mutableGrid[i][j] = 1;
              // caso restante omitido (las celulas vivas que no cumplen con el priemr caso se mantienen vivas y las
              // muertas que no cumplen el segundo caso siguen muertas)
            }
          }
        });
        return newGrid;
      });
      // se actualiza la generacion
      setGeneration(generationRef.current + 1);
      // agrego como dependencia la cantidad de filas y columnas para que al llamar a countSphericNeighbors
      // dichos valores esten actualizados
    },
    [rows, cols]
  );

  // Funcion que recibe una forma representada por un array de arrays
  // de las celulas a las que debe mostrar
  const setForm = (form) => {
    const emptyGrid = [];
    for (let i = 0; i < rows; i++) {
      // se crea una fila con celulas "muertas"
      emptyGrid.push(Array.from(Array(cols), () => 0));
      // se recorre la fila actual
      emptyGrid[i].forEach((_, j) => {
        // se recorre las posiciones marcadas en el "form" pasado por parametro
        form.forEach(([x, y]) => {
          // si se encuentra una posicion coincidente se cambia el estado de la celula
          // en esa posicion a viva
          if (i === x && j === y) emptyGrid[i][j] = 1;
        });
      });
    }
    return emptyGrid;
  };

  const handleSaveGrid = () => {
    localStorage.setItem("grid", JSON.stringify(grid));
    dialogRef.current.showModal();
  };

  const handleLoadGrid = () => {
    const grid_ = JSON.parse(localStorage.getItem("grid"));
    if (grid_ !== null) {
      resetGrid();
      setRows(grid_.length);
      setCols(grid_[0].length);
      setGridCol(grid_[0].length);
      setGrid(grid_);
    }
  };

  return (
    <>
      <h1>Life Game</h1>
      <div className="grid-options-container">
        <p>Generacion #{generation}</p>
        <div className="grid-options__buttons-container">
          <button
            onClick={() => handleButtonClick(true)}
            disabled={isSimulating}
          >
            Iniciar
          </button>
          <button
            onClick={() => setStepSimulation(!stepSimulation)}
            disabled={isSimulating}
          >
            Paso a Paso
          </button>
          <button
            onClick={() => handleButtonClick(false)}
            disabled={!isSimulating}
          >
            Detener
          </button>
          <button onClick={resetGrid} disabled={isSimulating}>
            Reiniciar
          </button>
          <button onClick={handleSaveGrid} disabled={isSimulating}>
            Guardar
          </button>
          <button onClick={handleLoadGrid} disabled={isSimulating}>
            Cargar Grilla
          </button>
          <FormsSelector onSelect={(opt) => setGrid(setForm(opt))} />
        </div>
        <form onSubmit={applyChanges}>
          <div>
            <label htmlFor="speed">Intervalo de Tiempo (ms)</label>
            <input
              type="number"
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="rows">Cantidad de Filas</label>
            <input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="cols">Cantidad de Columnas</label>
            <input
              type="number"
              id="cols"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            />
          </div>
          <button type="submit">Aplicar cambios</button>
        </form>
      </div>

      <dialog ref={dialogRef}>
        <h2>Grilla guardada!</h2>
        <button onClick={() => dialogRef.current.close()}>OK</button>
      </dialog>

      <Grid grid={grid} gridCol={gridCol} onCellClick={handleCellClick} />
    </>
  );
}

export default App;
