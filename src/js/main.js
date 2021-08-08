document.addEventListener("DOMContentLoaded", () => {
  arrancarApp();
  document.querySelector(".carrito-icono img").addEventListener("click", () => {
    document
      .querySelector("#carritoContenido")
      .classList.toggle("mostrar-carrito");
  });
});

// ------VARIABLES
const cursosSelect = document.querySelector("#cursosSelect");
const fragment = document.createDocumentFragment();
const templateCarrito = document.querySelector("#templateCarrito").content;
const templateOption = document.querySelector("#templateOption").content;
const templateCardCurso = document.querySelector("#templateCardCurso").content;
const contenedorCards = document.querySelector("#contenedorCards");
const carritoTablaBody = document.querySelector("#carritoTablaBody");

let cursosExtraidos; //se guardan todos los cursos traidos de localStorage (en la funcion arrancarAPP() )
let arregloCursoCategoriaSeleccionada = []; //se guardan los cursos de la categoría seleccionada ( en la function buscarCategoriaSeleccionado() )
let carrito = []; //guarda cursos seleccionados al carrito

//  ----------Eventos
cursosSelect.addEventListener("change", buscarCategoriaSeleccionado);

function arrancarApp() {
  cursosExtraidos = revisarCursosLocalStorage();
  cursosExtraidos.forEach((curso) => {
    // const option = document.createElement('option');
    const optionTemplate = templateOption.querySelector("option");
    optionTemplate.textContent = curso.categoria;
    optionTemplate.value = curso.categoria;

    const clone = templateOption.cloneNode(true);
    fragment.appendChild(clone);
  });
  cursosSelect.appendChild(fragment);

  carrito = revisarCarritoLocalStorage() || [];
  generarTablaCarrito();
}

function buscarCategoriaSeleccionado(e) {
  //borrar de la vista los cursos seleccionados anteriormente
  limpiarContenedorCards();

  const categoriaSeleccionada = e.target.value;
  //decir que categoría se ha seleccionado
  document.querySelector("#categoriaSeleccionada span").textContent =
    categoriaSeleccionada;

  // filtrar categorias para traer la seleccionada
  const curso = cursosExtraidos.filter(
    (c) => c.categoria === categoriaSeleccionada
  );

  //se hace un fitrado para eliminar la posicion 0 , la cual solo contiene en nombre para el objeto,
  //asi, se logra dejar un arreglo con solo los datos de los cursos seleccionados
  curso.forEach((c) => {
    arregloCursoCategoriaSeleccionada = Object.values(c).filter(
      (c, i) => i !== 0
    );
  });

  //pintar el HTML
  pintarCursosHtml(arregloCursoCategoriaSeleccionada);
}

function pintarCursosHtml(datosCursos) {
  contenedorCards.addEventListener("click", detectarAddCarrito);

  datosCursos.forEach((datos) => {
    templateCardCurso.querySelector("#cardTitulo").textContent =
      datos["titulo-curso"];
    templateCardCurso.querySelector("#cardDescripcion").textContent =
      datos["descripcion-curso"];
    templateCardCurso.querySelector("#precio span").textContent =
      datos["precio-curso"];
    templateCardCurso.querySelector("#calificacion span").textContent =
      datos.calificacion;
    templateCardCurso.querySelector("#autor").textContent = datos.autor;

    templateCardCurso
      .querySelector("#imgWebp")
      .setAttribute("srcset", datos["imagen-curso-webp"]);
    templateCardCurso.querySelector("#imgWebp").type = "image/webp";

    templateCardCurso
      .querySelector("#imgOtro")
      .setAttribute("srcset", datos["imagen-curso"]);
    templateCardCurso.querySelector("#imgOtro").type = "image/jgp";

    templateCardCurso
      .querySelector("#img")
      .setAttribute("src", datos["imagen-curso"]);
    templateCardCurso
      .querySelector("#img")
      .setAttribute("alt", datos["titulo-curso"]);

    templateCardCurso.querySelector("#addCarrito").dataset.id = datos.id;

    const clone = templateCardCurso.cloneNode(true);
    fragment.appendChild(clone);
  });
  contenedorCards.appendChild(fragment);
}

function detectarAddCarrito(e) {
    let idCurso;
    if (e.target.id === "addCarrito"){
        idCurso = e.target.dataset.id;
    }else{
        return;
    }
    

  //filtrar al seleccionado de entre todos los de esa categoría
  let cursoSelec = arregloCursoCategoriaSeleccionada.filter((c) => c.id === idCurso);

  //revisar si el curso ya fue agregado
   const existe = carrito.some(c => {
      return c.id === idCurso; 
    });

    //si sí existe, va a generar un nuevo arreglo en el cual se modifique la cantidad y el total
    if (existe) {
        //retorna arreglo el la variable "nuevo"
        const nuevo = carrito.map(c => {
            if (c.id === idCurso) {
                c.cantidad++; 
                c.total = (c['precio-curso'] * c.cantidad).toFixed(3);
                return c;
            }else{
                return c;
            }
        })
        //carrito es arreglo, y nuevo también, por eso solo se igualan
        carrito = nuevo;
    }else{
        //se usan pop porque su estructura es [ {} ] objeto dentro de arreglo, y se quiere que carrito
        //sea arreglo de objetos, no arrreglo de arreglos con objetos...
        //facilita recorrerlo con foreach
        carrito = [...carrito, cursoSelec.pop()];
    }
    //GUARDAR EN LOCALSTORAGE
    guardarCarritoEnLocalStorage(carrito);


    generarTablaCarrito();
}

function generarTablaCarrito() {

    //LIMPIAR LA TABLA DEL CARRITO DE LAS SELECCIONES ANTERIORES
    limpiarTablaCarrito();

    //asignar evento al tbody para obtener el click al agregar o remover curso desde la tabla de
    //carrito
    carritoTablaBody.addEventListener('click', eventoCarrito);

    
    

    carrito.forEach( c => {

        templateCarrito.querySelector('#idCurso').textContent = c.id;
        templateCarrito.querySelector('#nombreCurso').textContent = c['titulo-curso'];
        
        templateCarrito.querySelector('#webpCarrito').setAttribute('srcset',c['imagen-curso-webp']);
        templateCarrito.querySelector('#webpCarrito').type = 'image/webp';
        
        templateCarrito.querySelector('#jpgCarrito').setAttribute('srcset', c['imagen-curso']);
        templateCarrito.querySelector('#jpgCarrito').type = 'image/jpg';
        
        templateCarrito.querySelector('#imgCarrito').setAttribute('src', c['imagen-curso']);
        templateCarrito.querySelector('#imgCarrito').setAttribute('alt', c['titulo-curso']);
        templateCarrito.querySelector('#imgCarrito').setAttribute('title', c['titulo-curso']);

        templateCarrito.querySelector('#cantidadCurso').textContent = c.cantidad;
        templateCarrito.querySelector('#precioCurso span').textContent = c['precio-curso'];
        templateCarrito.querySelector('#precioTotal span').textContent = c.total;

        templateCarrito.querySelector('#eliminarCurso').dataset.id = c.id;
        templateCarrito.querySelector('#aumentarCurso').dataset.id = c.id;
    
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });

    document.querySelector("#carritoTablaBody").appendChild(fragment);
}

function eventoCarrito(e){
    const filtro = {
        'eliminarCurso': e.target.id,
        'aumentarCurso': e.target.id,
    }
    const accion = filtro[e.target.id];
    if(accion === undefined) return;

    let id = accion !== undefined ? e.target.dataset.id : '' ;

    let nuevoCarrito = null;
    if (id.trim() !== '') {
        if (accion === 'eliminarCurso') {

            carrito.forEach(curso => {
              if (curso.id === id && curso.cantidad === 1) 
              {
                   nuevoCarrito = carrito.filter(c => c.id !== id);
              }
              else if(curso.id === id && curso.cantidad > 1)
              { 
                nuevoCarrito = carrito = carrito.map( c => {
                  if (c.id === id) {
                    c.cantidad --;
                    c.total = (c['precio-curso'] * c.cantidad).toFixed(3);
                  }
                  return c;
                });
              }
            });
        }// if de accion === 'eliminar curso
        else if(accion === 'aumentarCurso')
        {
          console.log('aumentar carrito');
          nuevoCarrito = carrito.map(c => {
            if (c.id === id) {
              c.cantidad ++;
              c.total = (c['precio-curso'] * c.cantidad).toFixed(3);
            }
            return c;
          });
        }
    }//id de id.trim() !== ''  
    carrito = nuevoCarrito;
    actualizarCarritoEnLocalStorage(carrito);
    generarTablaCarrito();

}


function limpiarContenedorCards() {
  while (contenedorCards.firstChild) {
    contenedorCards.removeChild(contenedorCards.firstChild);
  }
}

function limpiarTablaCarrito() {
 
    while(carritoTablaBody.firstChild){
        carritoTablaBody.removeChild(carritoTablaBody.firstChild);
    }
}