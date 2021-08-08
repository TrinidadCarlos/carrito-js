function revisarCursosLocalStorage() {
    //revisar si exite la "base de datos" en localStrage
    if (!localStorage.getItem('cursosDB')) {
        localStorage.setItem('cursosDB', JSON.stringify(dataCursos));
    }
    //ahora que exista la "bd" se traen los curso
    return JSON.parse(localStorage.getItem('cursosDB'));
}

function revisarCarritoLocalStorage(){
    let carritoInicial;
    if (!localStorage.getItem('carritoUsuario')) {
        carritoInicial = localStorage.setItem('carritoUsuario', JSON.stringify([]));        
    }else{
        carritoInicial = JSON.parse(localStorage.getItem('carritoUsuario'));
    }
    return carritoInicial;
}


function guardarCarritoEnLocalStorage(carrito){
    localStorage.setItem('carritoUsuario', JSON.stringify(carrito));
}

function actualizarCarritoEnLocalStorage(carrito){
    localStorage.setItem('carritoUsuario', JSON.stringify(carrito));
}