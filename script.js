// script.js
// Archivo base para el laboratorio.
// NO deben modificar el HTML ni el CSS, solo trabajar aquí.

// API pública: JSONPlaceholder
// Documentación: https://jsonplaceholder.typicode.com/ (solo lectura)
// Ejemplo de endpoint que usaremos:
//   https://jsonplaceholder.typicode.com/posts?userId=1

// Paso 1: Referencias a elementos del DOM (ya tienes los IDs definidos en index.html).
const postForm = document.getElementById("postForm");
const userIdInput = document.getElementById("userIdInput");
const rememberUserCheckbox = document.getElementById("rememberUser");
const statusArea = document.getElementById("statusArea");
const postsList = document.getElementById("postsList");
const clearResultsBtn = document.getElementById("clearResultsBtn");

// Claves para localStorage
const LAST_USER_ID_KEY = "lab_fetch_last_user_id";
const POSTS_DATA_KEY = "lab_fetch_posts_data";

// TODO 1:
// Al cargar la página:
// - Leer de localStorage el último userId usado (si existe) y colocarlo en el input.
//   Si hay valor, marcar el checkbox "rememberUser".
// - Leer de localStorage los posts guardados (si existen) y mostrarlos en la lista.
//   Si hay posts guardados, actualizar el área de estado indicando que se cargaron desde localStorage.
// Pista: window.addEventListener("DOMContentLoaded", ...)

    // Leer de localStorage
window.addEventListener("DOMContentLoaded",() => {
    const valorGuardadoUser = localStorage.getItem("lab_fetch_last_user_id");
    const valorGuardadoPost= localStorage.getItem("lab_fetch_posts_data");

    if (valorGuardadoUser !== null) {
      userIdInput.textContent = localStorage.getItem("lab_fetch_last_user_id");
      rememberUserCheckbox.checked=true;
    } else {
      rememberUserCheckbox.checked=false;
    }

    if (valorGuardadoPost !==null){
        postForm= JSON.parse(valorGuardadoPost);
        statusArea.textContent= "cargado desde el localstorage";
    }
});

// TODO 2:
// Manejar el evento "submit" del formulario.
// - Prevenir el comportamiento por defecto.
// - Leer el valor de userId.
// - Validar que esté entre 1 y 10 (o mostrar mensaje de error).
// - Actualizar el área de estado a "Cargando..." con una clase de loading.
// - Llamar a una función que haga la petición fetch a la API.
formEvent.addEventListener("submit", function (event)  {
  event.preventDefault
    var userId= parseInt(userIdInput.textContent);  
    if(userId<=10 || userId>=1){
      statusArea.textContent="cargando...";
      fetchPostsByUser(userIdInput.textContent)
    }
    else{
      console.log("error")
      statusArea.textContent="error no existe esa id"
    }

});


// TODO 3:
// Implementar una función async que reciba el userId y:
// - Arme la URL: https://jsonplaceholder.typicode.com/posts?userId=VALOR
// - Use fetch para hacer la petición GET.
// - Valide que la respuesta sea ok (response.ok).
// - Convierta la respuesta a JSON.
// - Actualice el área de estado a "Éxito" o similar.
// - Muestre los resultados en la lista usando otra función (ver TODO 4).
// - Maneje errores (try/catch) y muestre mensaje de error en statusArea.
async function fetchPostsByUser(userId) {
  try {
    const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la petición");
    const data = await response.json();
    statusArea.textContent = "Éxito: publicaciones cargadas"; 
    renderPosts(data);
  } catch (error) {
    statusArea.textContent = `Error: ${error.message}`;
  }
}



// TODO 4:
// Crear una función que reciba un arreglo de publicaciones y:
// - Limpie cualquier resultado previo en postsList.
// - Para cada post, cree un <li> con clase "post-item".
// - Dentro agregue un título (h3 o p con clase "post-title") y el cuerpo (p con clase "post-body").
// - Inserte los elementos en el DOM.
// - IMPORTANTE: Después de mostrar los posts, guardarlos en localStorage usando la clave POSTS_DATA_KEY.
//   Recuerda que localStorage solo guarda strings, así que usa JSON.stringify() para convertir el arreglo.
function renderPosts(posts) {
  postsList.innerHTML = "";
  posts.forEach(post => {
    const li = document.createElement("li");
    li.className = "post-item";

    const title = document.createElement("h3");
    title.className = "post-title";
    title.textContent = post.title;

    const body = document.createElement("p");
    body.className = "post-body";
    body.textContent = post.body;

    li.appendChild(title);
    li.appendChild(body);
    postsList.appendChild(li);
  });
  localStorage.setItem(POSTS_DATA_KEY, JSON.stringify(posts));
}

// TODO 5:
// Si el checkbox "rememberUser" está marcado cuando se hace una consulta
// exitosa, guardar el userId en localStorage. Si no, limpiar ese valor.
rememberUserCheckbox.addEventListener("change", function(){
    if(rememberUserCheckbox.checked){
        localStorage.setItem(LAST_USER_ID_KEY,userIdInput.textContent)
    }
    else{
        localStorage.removeItem(LAST_USER_ID_KEY)
    }
})


// TODO 6:
// Agregar un evento al botón "Limpiar resultados" que:
// - Vacíe la lista de publicaciones.
// - Restablezca el mensaje de estado a "Aún no se ha hecho ninguna petición."
// - Elimine los posts guardados en localStorage (usando la clave POSTS_DATA_KEY).
clearResultsBtn.addEventListener("click", function(){
    postsList.textContent="";
    statusArea.textContent="aun no se ha hecho ninguna peticion";
    localStorage.removeItem( POSTS_DATA_KEY)

})
