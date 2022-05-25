const Grid = ({ gridCol, grid, onCellClick }) => {
  return (
    <div
      className="grid"
      style={{
        "--col-count": `${gridCol}`,
      }}
    >
      {grid.length > 0 &&
        grid.map((rows, i) =>
          rows.map((col, j) => {
            return (
              <div
                key={`${i}-${j}`}
                onClick={() => onCellClick(i, j)}
                className="grid__item"
                style={{
                  background: `${
                    col === 1 ? "var(--alive-color)" : "var(--dead-color)"
                  }`,
                }}
              ></div>
            );
          })
        )}
    </div>
  );
};

export default Grid;
