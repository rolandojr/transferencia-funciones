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

  }
})