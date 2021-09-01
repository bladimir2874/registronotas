const arrayFrom = (json, clase, key) =>
  Array.from(
    getLocal(key) || json,
    (item) => new clase(item)
  ); /* funcion que genera un arreglo */

function getLocal(key) {
  let respuesta = $.parseJSON(localStorage.getItem(key));
  if (respuesta == "") {
    return undefined;
  } else {
    return respuesta;
  }
}

function getLocal1(key) {
  let respuesta1 = localStorage.getItem(key);
  if (respuesta1 == "") {
    return undefined;
  } else {
    return respuesta1;
  }
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
