
export const generarId = ()=>{
    const ramdom = Math.random().toString(36).substring(2)
    const fecha = Date.now().toString(36)

    return ramdom + fecha
}

export function formatearFecha(fecha){
    const nuevaFecha = new Date(fecha);
    const opciones = {
        year:"numeric",
        month:"long",
        day:"2-digit"
    }

    return nuevaFecha.toLocaleDateString("es-ES", opciones)

    // recordar para poder tener la fecha le aplicamos como parametro de la funcion un Date.now()
}

export function obtenerDiferenciaYear(year){

    parseInt(year)
    
    const yearActual = new Date().getFullYear()

    return  yearActual - year
}

export function calcularMarca(marca){
    let incremento = marca

    switch(marca){
        case "1":
            incremento = 1.3;
            break
        case "2":
            incremento = 1.15;
            break
        case "3":
        incremento = 1.05;
        break 
        default:
        break
        
    }

    return incremento
}

export function calcularPlan(plan){
    return plan === "basico" ? 1.2 : 1.5;
}

export function formatearCantidad(cantidad){
    return cantidad.toLocaleString('en-US',{
        style:'currency',
        currency:'USD'

    })
}