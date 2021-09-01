/**
 * 1. el boton editar carga los datos en el input
 * 2. luego el boton editar cambia a guardar datos, actualizar
 * 3. el boton guardar copia los datos y modifica el registro
 * 4. 1 estudiante pueda tener varias notas
 * 5. calcular promedio notas por alumno y mostrar
 * 6 levantar el local store, si no hay usar el json.
 */

class Estudiante {
  constructor({ codigo, nombre, apellido, nota }) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.apellido = apellido;
    this.nota = nota;
    console.log(nota);
    this.promedio = this.promediar();
  }
  promediar() {
    console.log(this.nota);
    return this.nota.reduce((a, b) => a + b) / this.nota.length;
  }
  mostrar() {
    return `<tr>
                    <td>${this.codigo}</td>
                    <td>${this.nombre + " " + this.apellido}</td>
                    <td>${this.nota.map((nota) => nota)}</td>
                    <td class="botonEdicion" name="${
                      this.codigo
                    }"><button onclick="botones(event,'editarAlumno')" name="${
      this.codigo
    }" >Editar</button></td>
                    <td class="botonEdicion" style="display:none" name="${
                      this.codigo
                    }"><button onclick="botones(event,'guardarEdicion')" name="${
      this.codigo
    }" >Guardar</button></td>
                    <td><button onclick="botones(event,'eliminarAlumno')" name="${
                      this.codigo
                    }" >Eliminar</button></td>
                    <td><input class="inputNotas" type="text" name="${
                      this.codigo
                    }"/></td>
                    <td><button onclick="botones(event,'agregarNota')" name="${
                      this.codigo
                    }" >Agregar Nota</button></td>
                    <td>${this.promediar()}</td>
                </tr>`;
  }
}
function botones(e, accion) {
  programacion[accion](e.target.name, e);
}
class Catedra {
  constructor(nombre, archivoJSON) {
    this.nombre = nombre;
    //this.alumnos = arrayFrom(this.recuperarAlumnos(archivoJSON,this), Estudiante, "alumnos");
    /*verificar alumnos el local estorage*/
    this.alumnos = [];
    this.generarTabla();
  }

  agregarAlumno(estudiante = this.formulario()) {
    this.alumnos.push(new Estudiante(estudiante));
    this.generarTabla();
  }

  eliminarAlumno(codigo) {
    this.alumnos = this.alumnos.filter((alumno) => alumno.codigo != codigo);
    this.generarTabla();
  }

  indice(codigo) {
    return this.alumnos.findIndex((alumno) => alumno.codigo === codigo);
  }
  agregarNota(codigo) {
    this.alumnos[this.indice(codigo)].nota.push(
      parseInt($(".inputNotas[name=" + codigo + "]").val())
    );
    $(".inputNotas[name=" + codigo + "]").val("");
    this.generarTabla();
  }
  editarAlumno(codigo) {
    this.cambiaBoton(codigo);
    let alumno = this.alumnos[this.indice(codigo)];
    $("#codigo").val(alumno.codigo);
    $("#nombre").val(alumno.nombre);
    $("#apellido").val(alumno.apellido);
    $("#nota").val(alumno.nota);
  }

  guardarEdicion(codigo) {
    this.cambiaBoton(codigo);

    this.alumnos[this.indice(codigo)] = new Estudiante(this.formulario());
    this.generarTabla();
  }

  formulario(vaciar = false) {
    if (vaciar) {
      $("#codigo").val("");
      $("#nombre").val("");
      $("#apellido").val("");
      $("#nota").val("");
    }
    return {
      codigo: $("#codigo").val(),
      nombre: $("#nombre").val(),
      apellido: $("#apellido").val(),
      nota: [parseInt($("#nota").val())],
    };
  }
  cambiaBoton(codigo) {
    $("td[name=" + codigo + "]").toggle();
    $("td[name!=" + codigo + "]>button").prop("disabled", (i, v) => !v);
  }

  generarTabla() {
    saveLocal("alumnos", this.alumnos);
    $("#p1").html(`
                    <table border="1">
                      <tr>
                        <th>CODIGO</th>
                        <th>NOMBRE</th>
                        <th>NOTA</th>
                        <th>EDITAR</th>
                        <th>ELIMINAR</th>
                        <th>AGREGAR NOTA</th>
                        <th>     </th>
                        <th>PROMEDIO</th>
                      </tr>
                        ${this.alumnos
                          .map((alumno) => alumno.mostrar())
                          .join("")}
                    </table>
                  `);

    this.formulario(true);
  }

  recuperarAlumnos(archivoJSON, objeto) {
    $.getJSON(archivoJSON, function (response, status) {
      //console.log('USERS', response);
      if (status === "success") {
        response.users.forEach((estudiante) => {
          objeto.agregarAlumno(estudiante);
        });
        return response.users;
      } else {
        return [];
      }
    });
  }
}

let programacion = new Catedra("programa javascript", "js/data/users.json");
programacion.recuperarAlumnos("js/data/users.json", programacion);
$(document).ready(function () {
  $("body").append('<button id="btnHide">Ocultar Etiquetas</button>');
  $("body").append('<button id="btnShow">Mostrar Etiquetas</button>');
  $("#btnHide").click(function () {
    $("h1").hide();
  });
  $("#btnShow").click(function () {
    $("h1").show();
  });

  $("#boton1").click(() => programacion.agregarAlumno());
  programacion.formulario(true);
});
