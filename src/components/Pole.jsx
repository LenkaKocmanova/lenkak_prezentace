import React, { useState, useEffect, useContext } from "react";
import Row from "@/components/Row.jsx";
import { MyContext } from "@/actions/Contexts";

function Pole() {
  const { matice, setMatice, zprava, setZprava, onKonecHry } =
    useContext(MyContext);
  const velikost = 10;
  //const [matice, setMatice] = useState(matice);
  //const [zprava, setZprava] = useState(zprava);
  //const [state, setState] = useState(znak);

  const [gameEnd, setGameEnd] = useState(false);

  const vyhodnoceni = () => {
    //console.log(matice);
    for (var j = 0; j < velikost; j++) {
      for (var i = 0; i < velikost - 4; i++) {
        //console.log((matice[j][i]=== matice[j][i+1]==='X'));
        //console.log(matice[j][i]);
        if (
          (matice[j][i] === "X" &&
            matice[j][i + 1] === "X" &&
            matice[j][i + 2] === "X" &&
            matice[j][i + 3] === "X" &&
            matice[j][i + 4] === "X") ||
          (matice[j][i] === "O" &&
            matice[j][i + 1] === "O" &&
            matice[j][i + 2] === "O" &&
            matice[j][i + 3] === "O" &&
            matice[j][i + 4] === "O")
        ) {
          setGameEnd(true);
          setZprava("Vyhrál " + matice[j][i]);
          //setTimeout(()=>{console.log({gameEnd});},2000);
          //props.onKonecHry(true, zprava);
        }
      }
    }
    for (j = 0; j < velikost - 4; j++) {
      for (i = 0; i < velikost; i++) {
        if (
          (matice[j][i] === "X" &&
            matice[j + 1][i] === "X" &&
            matice[j + 2][i] === "X" &&
            matice[j + 3][i] === "X" &&
            matice[j + 4][i] === "X") ||
          (matice[j][i] === "O" &&
            matice[j + 1][i] === "O" &&
            matice[j + 2][i] === "O" &&
            matice[j + 3][i] === "O" &&
            matice[j + 4][i] === "O")
        ) {
          setGameEnd(true);
          setZprava("Vyhrál " + matice[j][i]);
        }
      }
    }
    for (j = 0; j < velikost - 4; j++) {
      for (i = 0; i < velikost - 4; i++) {
        if (
          (matice[j][i] === "X" &&
            matice[j + 1][i + 1] === "X" &&
            matice[j + 2][i + 2] === "X" &&
            matice[j + 3][i + 3] === "X" &&
            matice[j + 4][i + 4] === "X") ||
          (matice[j][i] === "O" &&
            matice[j + 1][i + 1] === "O" &&
            matice[j + 2][i + 2] === "O" &&
            matice[j + 3][i + 3] === "O" &&
            matice[j + 4][i + 4] === "O")
        ) {
          setGameEnd(true);
          setZprava("Vyhrál " + matice[j][i]);
        }
      }
    }
    for (j = 0; j < velikost - 4; j++) {
      for (i = 4; i < velikost; i++) {
        if (
          (matice[j][i] === "X" &&
            matice[j + 1][i - 1] === "X" &&
            matice[j + 2][i - 2] === "X" &&
            matice[j + 3][i - 3] === "X" &&
            matice[j + 4][i - 4] === "X") ||
          (matice[j][i] === "O" &&
            matice[j + 1][i - 1] === "O" &&
            matice[j + 2][i - 2] === "O" &&
            matice[j + 3][i - 3] === "O" &&
            matice[j + 4][i - 4] === "O")
        ) {
          setGameEnd(true);
          setZprava("Vyhrál " + matice[j][i]);
        }
      }
    }
  };

  const updateMatice = (newRadek, porad) => {
    console.log("update matice", newRadek, porad);
    setMatice((prev) => prev.map((row, i) => (i === porad ? newRadek : row)));
  };

  useEffect(() => {
    vyhodnoceni();
    if (gameEnd) {
      onKonecHry(true, matice, zprava);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEnd, matice, zprava]);

  const aRow = [...Array(velikost)].map((a, i) => (
    <Row
      key={i}
      poradi={i}
      velikost={velikost}
      radek={matice[i]}
      konecHry={gameEnd}
      updateMatice={updateMatice}
    />
  ));

  return (
    <div className="flex flex-col gap-3">
      <table className="mx-auto border-collapse border border-neutral-500">
        <tbody>{aRow}</tbody>
      </table>
      {gameEnd && (
        <div className="text-center text-base font-semibold text-red-600">
          {zprava}
        </div>
      )}
    </div>
  );
}

export default Pole;
