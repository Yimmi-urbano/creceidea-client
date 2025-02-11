function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function obtenerFechaHoraLocal() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

async function obtenerUltimoCorrelativo() {
    const domain = document.querySelector('meta[name="domain"]')?.content;
    if (!domain) {
        console.error("No se pudo obtener el dominio de la URL");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/reclamos/ultimo-correlativo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'domain': domain
            }
        });

        if (!response.ok) throw new Error('Error al obtener el correlativo');

        const data = await response.json();
        document.getElementById('numReclamo').innerHTML = String(data.ultimoCorrelativo).padStart(8, '0');
        document.getElementById('fechaActual').innerHTML = obtenerFechaHoraLocal();
        hideloading();
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerUltimoCorrelativo();

    document.querySelectorAll("input[name='tipo_consumidor']").forEach(input => {
        input.addEventListener("click", () => {
            document.querySelector('.dato_empresa').classList.toggle('hidden', input.value !== "empresa");
        });
    });

    document.querySelector("input[name='menor_edad']").addEventListener("click", (event) => {
        document.querySelector('.nom_apoderado').classList.toggle('hidden', !event.target.checked);
    });

    document.querySelectorAll('.tipo_consumidor').forEach(input => {
        input.addEventListener("click", () => {
            const isEmpresa = input.value === "empresa";
            document.getElementById('ruc').toggleAttribute('required', isEmpresa);
            document.getElementById('razon_social').toggleAttribute('required', isEmpresa);
            if (!isEmpresa) {
                document.getElementById('ruc').value = '';
                document.getElementById('razon_social').value = '';
            }
        });
    });
});

function loading() {
    document.querySelector('.loading').style.display = "block";
    document.documentElement.classList.add('cargandoEstado');
}

function hideloading() {
    document.querySelector('.loading').style.display = "none";
    document.documentElement.classList.remove('cargandoEstado');
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('/claim-assets/departamentos/ubigeo_peru_2016_departamentos.json')
        .then(response => response.json())
        .then(data => {
            const departamentoSelect = document.getElementById("departamento");
            data.forEach(dep => {
                let option = new Option(dep.name, dep.id);
                departamentoSelect.add(option);
            });
        })
        .catch(error => console.error("Error cargando departamentos:", error));
});

document.getElementById('departamento').addEventListener('change', function () {
    fetch("/claim-assets/departamentos/ubigeo_peru_2016_provincias.json")
        .then(response => response.json())
        .then(data => {
            const provinciaSelect = document.getElementById("provincia");
            provinciaSelect.innerHTML = "";
            data.filter(prov => prov.department_id === this.value).forEach(prov => {
                let option = new Option(prov.name, prov.id);
                provinciaSelect.add(option);
            });
        })
        .catch(error => console.error("Error cargando provincias:", error));
});

document.getElementById('provincia').addEventListener('change', function () {
    fetch("/claim-assets/departamentos/ubigeo_peru_2016_distritos.json")
        .then(response => response.json())
        .then(data => {
            const distritoSelect = document.getElementById("distrito");
            distritoSelect.innerHTML = "";
            data.filter(dist => dist.province_id === this.value).forEach(dist => {
                let option = new Option(dist.name, dist.id);
                distritoSelect.add(option);
            });
        })
        .catch(error => console.error("Error cargando distritos:", error));
});

document.getElementById('formularioReclamos').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());
    jsonData.menor_edad = jsonData.menor_edad === "on";
    jsonData.acepta_term = jsonData.acepta_term === "on";
    jsonData.domain = document.querySelector('meta[name="domain"]')?.content;

    if (!jsonData.domain) {
        alert("Error: El dominio no está configurado.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/reclamos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById("registro-exitoso").classList.remove("hidden");
            document.getElementById("formularioReclamos").classList.add("hidden");
            document.getElementById("CODReclamo").innerHTML = result.cod_reclamo;
        } else {
            alert("Error al registrar el reclamo: " + result.mensaje);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error al registrar el reclamo.");
    }
});
