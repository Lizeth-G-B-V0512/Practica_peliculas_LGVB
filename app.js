const GENEROS = ["Drama","Comedia","Musical","Crimen","Ciencia Ficción","Terror"];
const edadInput = document.getElementById("edad");
const generosDiv = document.getElementById("generos");
const resultado = document.getElementById("resultado");
let BD = null, generoActual = null;

fetch("peliculas.json").then(r => r.json()).then(d => {
  BD = d;
  GENEROS.forEach(g => {
    const b = document.createElement("button");
    b.textContent = g;
    b.onclick = () => { generoActual = g; mostrar(); };
    b.dataset.g = g;
    generosDiv.appendChild(b);
  });
}).catch(() => resultado.innerHTML = '<div class="aviso">No se pudo cargar peliculas.json. Abre el proyecto con un servidor (Live Server o GitHub Pages).</div>');

edadInput.addEventListener("input", () => generoActual && mostrar());

function grupo(e){ return e >= 18 ? "18+" : e >= 13 ? "13-17" : "2-12"; }

function mostrar(){
  [...generosDiv.children].forEach(b => b.classList.toggle("activo", b.dataset.g === generoActual));
  const edad = parseInt(edadInput.value, 10);
  if (isNaN(edad) || edad < 2) {
    resultado.innerHTML = '<div class="aviso">Ingresa una edad válida (2 años o más) para recomendarte películas.</div>';
    return;
  }
  const g = grupo(edad);
  const peliculas = BD[g][generoActual];
  const clase = g === "18+" ? "r" : g === "13-17" ? "t" : "";
  const texto = g === "18+" ? "Para mayores de 18 años" : g === "13-17" ? "Recomendada de 13 a 17 años" : "Apta para niños de 2 a 12 años";
  resultado.innerHTML = `<h2 class="titulo-res">Nuestra recomendación · ${generoActual}</h2><div class="grid">` +
    peliculas.map((p, i) => `<article class="peli" style="animation-delay:${i*80}ms">
      <div class="cartel">${generoActual}</div>
      <div class="info"><h3>${p.titulo}</h3>
      <p class="meta">${p.anio} · Dir. ${p.director}</p>
      <p>${p.sinopsis}</p>
      <span class="badge ${clase}">${texto}</span></div></article>`).join("") + "</div>";
}
