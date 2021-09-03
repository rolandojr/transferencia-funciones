var app = new Vue({
  el: '#app',
  data: {
    message: "",
    codigo: null,
    puesto: null,
    fecha_ingreso: null,
    fecha_evaluacion: null,
    evaluador: null,
    cargo: null,
    f_responsabilidad: "",
    d_f_responsabilidad: "",
    v_f_responsabilidad: "",
    f_habilidad: "",
    d_f_habilidad: "",
    v_f_habilidad: "",
    f_iniciativa: "",
    d_f_iniciativa: "",
    v_f_iniciativa: "",
    f_disciplina: "",
    d_f_disciplina: "",
    v_f_disciplina: "",
    f_produccion: "",
    d_f_produccion: "",
    v_f_produccion: "",
    f_relacion: "",
    d_f_relacion: "",
    v_f_relacion: "",
    ponderacion_total : null,
    endpoint: null,
    errors: {
      codigo: null,
      puesto: null,
      fecha_ingreso: null,
      fecha_evaluacion: null,
      evaluador: null,
      cargo: null,
    }
  },
  watch: {
    codigo: function (val) {
      if (!isNaN(val)) {
        this.errors.codigo = false
        if (val.includes(".")) {
          this.errors.codigo = true
        }
      } else {
        this.errors.codigo = true
      }
    },
    f_responsabilidad: function(val) {
      switch (val) {
        case "Deficiente":
          this.d_f_responsabilidad = "Persona irresponsable sin interés en el cumplimiento de las funciones";
          this.v_f_responsabilidad = "5%";  
          break;
        case "Regular":
          this.d_f_responsabilidad = "Demuestra poco interés por su trabajo";
          this.v_f_responsabilidad = "16%";  
          break;          
        case "Bueno":
          this.d_f_responsabilidad = "Asume las Responsabilidades a nivel satisfactorio";
          this.v_f_responsabilidad = "18%";  
          break;
        case "Excelente":
          this.d_f_responsabilidad = "Muy responsable, muestra verdadero interés por el trabajo";
          this.v_f_responsabilidad = "20%";  
          break;                      
        default:
          break;
      }
      this.ponderacionTotal();
    },
    f_habilidad: function(val) {
      switch (val) {
        case "Deficiente":
          this.d_f_habilidad = "Es desorganizado, pierde mucho el tiempo y siempre se atraza";
          this.v_f_habilidad = "3%";  
          break;
        case "Regular":
          this.d_f_habilidad = "Algunas veces es desorganizado ocasionando pérdida de tiempo";
          this.v_f_habilidad = "8%";  
          break;          
        case "Bueno":
          this.d_f_habilidad = "Es organizado, distribuye bien el tiempo para cumplir con su trabajo";
          this.v_f_habilidad = "9%";  
          break;
        case "Excelente":
          this.d_f_habilidad = "Es organizado, distribuye y utiliza bien su tiempo para cumplir con su trabajo";
          this.v_f_habilidad = "10%";  
          break;                      
        default:
          break;
      }
      this.ponderacionTotal();
    },
    f_iniciativa: function(val) {
      switch (val) {
        case "Deficiente":
          this.d_f_iniciativa = "Siempre se le debe decir lo que le corresponde hacer";
          this.v_f_iniciativa = "3%";  
          break;
        case "Regular":
          this.d_f_iniciativa = "Se le debe recordar lo que debe hacer. Muestra poco interés o iniciativa";
          this.v_f_iniciativa = "8%";  
          break;          
        case "Bueno":
          this.d_f_iniciativa = "Muestra iniciativa para realizar el trabajo, se limita a cumplir con sus responsabilidades";
          this.v_f_iniciativa = "9%";  
          break;
        case "Excelente":
          this.d_f_iniciativa = "Muestra habilidad para tomar iniciativa en superarse, adquiere conocimientos y propone ideas";
          this.v_f_iniciativa = "10%";  
          break;                      
        default:
          break;
      }
      this.ponderacionTotal();
    },
    f_disciplina: function(val) {
      switch (val) {
        case "Deficiente":
          this.d_f_disciplina = "Frecuentemente incumple con los reglamentos, normar y con la autoridad jerárquica";
          this.v_f_disciplina = "5%";  
          break;
        case "Regular":
          this.d_f_disciplina = "Eventualmente incumple con los reglamentos, norma y con la autoridad";
          this.v_f_disciplina = "15%";  
          break;          
        case "Bueno":
          this.d_f_disciplina = "Persona que cumple las ordenes y disposiciones, reglamentos y autoridad";
          this.v_f_disciplina = "16%";  
          break;
        case "Excelente":
          this.d_f_disciplina = "Persona autodisciplinada muy dispuesta y adaptable, su presentación es siempre impecable";
          this.v_f_disciplina = "20%";  
          break;                      
        default:
          break;
      }
      this.ponderacionTotal();
    },
    f_produccion: function(val) {
      switch (val) {
        case "Deficiente":
          this.d_f_produccion = "La cantidad y calidad de trabajo es notablemente menos a lo esperado, no cumple las indicaciones para mejorar";
          this.v_f_produccion = "10%";  
          break;
        case "Regular":
          this.d_f_produccion = "La cantidad y calidad de trabajo es menos a lo esperado, requiere supervisión y corrección";
          this.v_f_produccion = "21%";  
          break;          
        case "Bueno":
          this.d_f_produccion = "La cantidad y calidad del trabajo es aceptable, su trabajo requiere supervisión siempre está al día";
          this.v_f_produccion = "23%";  
          break;
        case "Excelente":
          this.d_f_produccion = "La cantidad y calidad del trabajo es satisfactoria, no comete errores en la ejecución de su cargo";
          this.v_f_produccion = "25%";  
          break;                      
        default:
          break;
      }
      this.ponderacionTotal();
    },
    f_relacion: function(val) {
      switch (val) {
        case "Deficiente":
          this.d_f_relacion = "Sus relaciones interpersonales no son apropiadas generando conflictos laborales";
          this.v_f_relacion = "5%";  
          break;
        case "Regular":
          this.d_f_relacion = "Sus relaciones interpersonales a veces generan conflicto o alteran el ambiente laboral";
          this.v_f_relacion = "11%";  
          break;          
        case "Bueno":
          this.d_f_relacion = "Sus relaciones interpersonales son apropiadas, no generan conflicto";
          this.v_f_relacion = "13%";  
          break;
        case "Excelente":
          this.d_f_relacion = "Siempre mantiene y promueve las buenas relaciones interpersonales, desarrolla su trabajo en armonía";
          this.v_f_relacion = "15%";  
          break;                      
        default:
          break;
      }
      this.ponderacionTotal();
    },

  },
  methods: {
    sendEvaluacionPeriodoPrueba: async function (codigo, puesto, fecha_ingreso, fecha_evaluacion, evaluador, cargo, f_responsabilidad, d_f_responsabilidad, v_f_responsabilidad, f_habilidad,d_f_habilidad, v_f_habilidad, f_iniciativa, d_f_iniciativa, v_f_iniciativa, f_disciplina, d_f_disciplina, v_f_disciplina, f_produccion, d_f_produccion, v_f_produccion, f_relacion, d_f_relacion, v_f_relacion) {

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "codigo": codigo,
        "puesto": puesto,
        "fecha_ingreso": fecha_ingreso,
        "fecha_evaluacion": fecha_evaluacion,
        "evaluador": evaluador,
        "cargo": cargo,
        "f_responsabilidad": f_responsabilidad,
        "d_f_responsabilidad": d_f_responsabilidad,
        "v_f_responsabilidad": v_f_responsabilidad,
        "f_habilidad": f_habilidad,
        "d_f_habilidad":d_f_habilidad,
        "v_f_habilidad": v_f_habilidad,
        "f_iniciativa": f_iniciativa,
        "d_f_iniciativa": d_f_iniciativa,
        "v_f_iniciativa": v_f_iniciativa,
        "f_disciplina": f_disciplina,
        "d_f_disciplina": d_f_disciplina,
        "v_f_disciplina": v_f_disciplina,
        "f_produccion": f_produccion,
        "d_f_produccion": d_f_produccion,
        "v_f_produccion": v_f_produccion,
        "f_relacion": f_relacion,
        "d_f_relacion": d_f_relacion,
        "v_f_relacion": v_f_relacion,
      });
      console.log(raw);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
      let url_local  = "http://localhost:8080";
      let response = await fetch(`${url_remoto}/api-funciones/crear-registro-evaluacion-periodo-prueba`, requestOptions)
      let data = await response.json();
      console.log(data);
      return data;
    },
    convertDate: function (dateString) {
      return dateString.replaceAll("/", "-");
    },
    createSolicitudEvaluacionPeriodoPrueba: async function () {

      this.fecha_ingreso_c = document.getElementById("fecha_ingreso").value;
      this.fecha_evaulacion_c = document.getElementById("fecha_evaluacion").value;
     // console.log(this.fecha_ingreso_c);
      //console.log(this.fecha_evaulacion_c);
      //this.codigo && this.puesto && this.fecha_ingreso && this.fecha_evaluacion && this.evaluador && this.cargo && this.f_responsabilidad && this.d_f_responsabilidad && this.v_f_responsabilidad && this.f_habilidad && this.d_f_habilidad && this.v_f_habilidad && this.f_iniciativa && this.d_f_iniciativa && this.v_f_iniciativa && this.f_disciplina && this.d_f_disciplina && this.v_f_disciplina && this.f_produccion && this.d_f_produccion && this.v_f_produccion && this.f_relacion && this.d_f_relacion && this.v_f_relacion
      if (this.codigo && this.puesto && this.fecha_ingreso_c != null && this.fecha_evaulacion_c != null && this.evaluador && this.cargo && this.f_responsabilidad && this.d_f_responsabilidad && this.v_f_responsabilidad && this.f_habilidad && this.d_f_habilidad && this.v_f_habilidad && this.f_iniciativa && this.d_f_iniciativa && this.v_f_iniciativa && this.f_disciplina && this.d_f_disciplina && this.v_f_disciplina && this.f_produccion && this.d_f_produccion && this.v_f_produccion && this.f_relacion && this.d_f_relacion && this.v_f_relacion) {
        
        this.fecha_ingreso = this.convertDate(this.fecha_ingreso_c);
        this.fecha_evaluacion = this.convertDate(this.fecha_evaulacion_c);

        console.log(this.fecha_ingreso); 
        let response = await this.sendEvaluacionPeriodoPrueba(this.codigo, this.puesto, this.fecha_ingreso, this.fecha_evaluacion, this.evaluador, this.cargo, this.f_responsabilidad, this.d_f_responsabilidad, this.v_f_responsabilidad, this.f_habilidad, this.d_f_habilidad, this.v_f_habilidad, this.f_iniciativa, this.d_f_iniciativa, this.v_f_iniciativa, this.f_disciplina, this.d_f_disciplina, this.v_f_disciplina, this.f_produccion, this.d_f_produccion, this.v_f_produccion, this.f_relacion, this.d_f_relacion, this.v_f_relacion);
        console.log(response); 
        let data_zoho = JSON.parse(response.data)
        if (data_zoho.details.output == "0") {
          this.message = "Se han registrado éxitosamente";
          $('#exampleModal').modal();
          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          this.message = data_zoho.details.output;
          $('#exampleModal').modal();
        }
      } else {  
        this.message = "Debe ingresar todos los campos";
        $('#exampleModal').modal();
      }

    },
    ponderacionTotal: function() {

      let responsabilidad =  this.v_f_responsabilidad;
      let habilidad =  this.v_f_habilidad
      let iniciativa =  this.v_f_iniciativa
      let disciplina =  this.v_f_disciplina
      let produccion =  this.v_f_produccion
      let relacion  =  this.v_f_relacion 
      responsabilidad =  responsabilidad == "" ? 0 : parseInt(responsabilidad.replace("%",'') );
      habilidad =  habilidad == "" ? 0 : parseInt(habilidad.replace("%",'') );
      iniciativa =  iniciativa == "" ? 0 : parseInt(iniciativa.replace("%",'') );
      disciplina =  disciplina == "" ? 0 : parseInt(disciplina.replace("%",'') );
      produccion =  produccion == "" ? 0 : parseInt(produccion.replace("%",'') );
      relacion =  relacion == "" ? 0 : parseInt(relacion.replace("%",'') );
      let total = responsabilidad + habilidad + iniciativa + disciplina + produccion + relacion;
      this.ponderacion_total = total + "%";
    }
  }
})