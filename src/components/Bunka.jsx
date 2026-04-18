import React, { useEffect } from "react";
import { useContext } from "react";
import { MyContext } from "@/actions/Contexts";
import { useReducer } from "react";

const bunkaReducer = (state, action) => {
  switch (action.type) {
    case "CLICK":
      if (state.isValid) return state;
      return {
        value: action.payload,
        isValid: true,
      };

    default:
      return state;
  }
};

const Bunka = (props) => {
  const { znak, setZnak } = useContext(MyContext);
  const [bunkaState, dispatchBunka] = useReducer(bunkaReducer, {
    value: " ",
    isValid: false,
  });

  useEffect(() => {
    props.updateState(bunkaState.value, props.sloupec);
    console.log(bunkaState.value, props.sloupec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bunkaState.value]);

  const bunkaClickHandler = () => {
    if (!props.konecHry) {
      if (bunkaState.isValid) return;

      dispatchBunka({ type: "CLICK", payload: znak });

      setZnak((prev) => (prev === "X" ? "O" : "X"));
    }
  };

  return (
    <td
      className="size-8 cursor-pointer select-none border border-neutral-400 bg-white text-center text-sm font-semibold leading-8 hover:bg-amber-50"
      id="bunka"
      onClick={bunkaClickHandler}
    >
      {bunkaState.value}
    </td>
  );
};

export default Bunka;
