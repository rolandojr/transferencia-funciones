var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    codigo: null,
    tipo: "",
    file: null,
    documento: {
      certificado_medico: null,
      receta_medica: null,
      pago_consulta: null,
      pago_medicamentos: null,
      examenes_auxiliares: null,
    },
    url: {
      certificado_medico: null,
      receta_medica: null,
      pago_consulta: null,
      pago_medicamentos: null,
      examenes_auxiliares: null,
    },
    fecha_inicio: null,
    fecha_inicio_formato: null,
    fecha_fin: null,
    fecha_fin_formato: null,
    endpoint: null,
    errors: {
      codigo: null
    },
    search: {
      ui: {
        loading: false,
        error: null,
        success: false,
        showResults: false
      },
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
    selectFile: function (event) {
      console.log(event.target.id);
      this.file = event.target.files[0];
      let anularArchivo = false;
      if (this.file) {
        if (this.file.size === 0) {
          this.message = "Ha ingresado un archivo vacio, este no se considerará en el registro, por favor  cambie de archivo ";
          $('#exampleModal').modal();
          return 
        }
        let sizeFile = this.file.size / (1024 * 1024);
        if (sizeFile > 5.0) {
          this.message = "El tamaño no debe superar los 5 MB";
          $('#exampleModal').modal();
          anularArchivo = true;
        }
        if (anularArchivo) {
          this.file = null;
        }
        switch (event.target.id) {
          case "certificado_medico":
            this.documento.certificado_medico = this.file;
            break;
          case "receta_medica":
            this.documento.receta_medica = this.file;
            break;
          case "pago_consulta":
            this.documento.pago_consulta = this.file;
            break;
          case "pago_medicamentos":
            this.documento.pago_medicamentos = this.file;
            break;
          case "examenes_auxiliares":
            this.documento.examenes_auxiliares = this.file;
            break;
          default:
            break;
        }
      }else{
        switch (event.target.id) {
          case "certificado_medico":
            this.documento.certificado_medico = null;
            this.url.certificado_medico = null;
            break;
          case "receta_medica":
            this.documento.receta_medica = null;
            this.url.receta_medica = null;
            break;
          case "pago_consulta":
            this.documento.pago_consulta = null;
            this.url.pago_consulta = null;
            break;
          case "pago_medicamentos":
            this.documento.pago_medicamentos = null;
            this.url.pago_medicamentos = null;
            break;
          case "examenes_auxiliares":
            this.documento.examenes_auxiliares = null;
            this.url.examenes_auxiliares = null;
            break;
          default:
            break;
        }
      }
    },
    sendFile: async function (archivo) {
      let formData = new FormData();
      formData.append("archivo", archivo);

      let requestOptions = {
        method: 'POST',
        body: formData,
      };

      let response = await fetch("https://solucionesm4g.site:8443/files/api-touring-people/uploadPdf", requestOptions);
      let data = await response.json();
      // console.log(data);
      if ( !this.isObjEmpty(data) ) {
        console.log(data);
        let { id } = data;
        let urlEndpoint = `https://solucionesm4g.site:8443/files/api-touring-people/downloadPdf/${id}`;
        return urlEndpoint;
      }else{
        return 1;
      } 
    },
    isObjEmpty : function (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
      }
    
      return true;
    },
    sendSolicitudDescanso: async function () {

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        "codigo": this.codigo,
        "endpoint": {
          "certificado_medico": this.url.certificado_medico,
          "receta_medica": this.url.receta_medica,
          "pago_consulta": this.url.pago_consulta,
          "pago_medicamentos": this.url.pago_medicamentos,
          "examenes_auxiliares": this.url.examenes_auxiliares,
        },
        "tipo": this.tipo,
        "fecha_inicio": this.fecha_inicio_formato,
        "fecha_fin": this.fecha_fin_formato,
      });

      console.log(raw);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };

      let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
      let url_local = "http://localhost:8080";
      let response = await fetch(`${url_remoto}/api-funciones/crear-descanso-medico`, requestOptions)
      let data = await response.json();
      // console.log(data);
      return data;

    },
    convertDate: function (dateString) {
      return dateString.replaceAll("/", "-");

    },
    convertDateFormat: function (dateString) {
      let fecha_sin_formato = dateString.split("T")[0];
      let fecha_separada = fecha_sin_formato.split("-");
      let fecha_con_formato = fecha_separada[2] + "-" + fecha_separada[1] + "-" + fecha_separada[0];
      // console.log(fecha_con_formato);
      return fecha_con_formato;
    },
    createSolicitudDescanso: async function () {
      try {
        this.search.ui.loading = true
        if (this.fecha_inicio != null) {
          this.fecha_inicio_formato = this.convertDateFormat(this.fecha_inicio)
        }
        if (this.fecha_fin != null) {
          this.fecha_fin_formato = this.convertDateFormat(this.fecha_fin);
        }
        if (this.documento.certificado_medico) {
          
          this.url.certificado_medico = await this.sendFile(this.documento.certificado_medico);

          if (this.url.certificado_medico == 1) {
            this.message = "No se pudo cargar el archivo 'Certificado Medico', porfavor, intente nuevamente o cambie el archivo";
            $('#exampleModal').modal();
            return ;
          }
          
        }
        if (this.documento.receta_medica) {
          console.log("receta medica");
          this.url.receta_medica = await this.sendFile(this.documento.receta_medica);
          if (this.url.receta_medica == 1) {
            this.message = "No se pudo cargar el archivo 'Receta Medica', porfavor, intente nuevamente o cambie el archivo";
            $('#exampleModal').modal();
            return ;
          }
        }
        if (this.documento.pago_consulta) {
          console.log("pago consulta");
          this.url.pago_consulta = await this.sendFile(this.documento.pago_consulta);
          if (this.url.pago_consulta == 1) {
            this.message = "No se pudo cargar el archivo 'Pago de Consulta', porfavor, intente nuevamente o cambie el archivo";
            $('#exampleModal').modal();
            return ;
          }
        }
        if (this.documento.pago_medicamentos) {
          console.log("pago medicamento");
          this.url.pago_medicamentos = await this.sendFile(this.documento.pago_medicamentos);
          if (this.url.pago_medicamentos == 1) {
            this.message = "No se pudo cargar el archivo 'Pago de Medicamentos', porfavor, intente nuevamente o cambie el archivo";
            $('#exampleModal').modal();
            return ;
          }
        }
        if (this.documento.examenes_auxiliares) {
          console.log("examenes auxiliares");
          this.url.examenes_auxiliares = await this.sendFile(this.documento.examenes_auxiliares);
          if (this.url.examenes_auxiliares == 1) {
            this.message = "No se pudo cargar el archivo 'Examenes Auxiliares', porfavor, intente nuevamente o cambie el archivo";
            $('#exampleModal').modal();
            return ;
          }
        }
        // console.log(urlEndpoint)
          let response = await this.sendSolicitudDescanso();
          console.log(response);
          let data_zoho = JSON.parse(response.data)
          if (data_zoho.details.output == "0") {
            this.message = "Se han registrado éxitosamente";
            $('#exampleModal').modal();
            setTimeout(() => {
              // location.reload();
            }, 5000);
          } else {
            this.message = data_zoho.details.output;
            $('#exampleModal').modal();
          }
      } catch (e) {
        console.log(e);
      } finally {
        this.search.ui.loading = false
      }

    },

  }
})