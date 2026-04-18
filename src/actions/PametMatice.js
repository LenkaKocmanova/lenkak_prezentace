import axios from "axios";

/*export const deleteCard = (id) => {
  return {
    type: 'DELETE_CARD',
    id: id
  }
}

export const deleteUser = (id) => {
  return {
    type: 'DELETE_USER',
    id
  }
}*/

export const fetchUsers = () => {
  return (dispatch) => {
    axios
      .get("https://github.com/LenkaKocmanova/Lenka/blob/[main|master]/db.json")
      .then(({ data }) => {
        dispatch({ type: "FETCH_USERS", payload: data });
      });
  };
};
