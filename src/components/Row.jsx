import React from "react";
import Bunka from "./Bunka";
//import './Row.css'

const Row = (props) => {
  console.log("render row", props.poradi, props.radek);

  const updateState = (newValue, sloupe) => {
    const newRadek = props.radek.map((item, i) =>
      i === sloupe ? newValue : item,
    );
    props.updateMatice(newRadek, props.poradi);
  };
  console.log("length:", props.radek.length);
  const aBun = [...Array(props.velikost)].map((a, i) => (
    <Bunka
      key={props.poradi + i}
      sloupec={i}
      updateState={updateState}
      konecHry={props.konecHry}
    />
  ));

  return <tr>{aBun}</tr>;
};

export default Row;
