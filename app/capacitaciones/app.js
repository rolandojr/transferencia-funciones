var app = new Vue({
    el: '#app',
    data: {
      message:"",
      codigo: null,
      tipo:"",
      tema:null,
      fecha_convenio:null,
      fecha_convenio_formateado:null,
      fecha_inicio: null,
      fecha_inicio_formateado:null,
      fecha_fin: null,
      fecha_fin_formateado:null,
      file: null,
      evaluacion_capacitado:null,
      evaluacion_eficacia:null,
      descuento_aplicable:null,
      requisito_legal:null,
      tiempo_retencion:"",
      entidad_educativa:null,
      endpoint : null,
      errors:{
        codigo: null,
        evaluacion_capacitado:null,
        evaluacion_eficacia:null,
        descuento_aplicable:null,
      },
      loading:null,
    },
    watch:{
      codigo: function(val) {
        if (!isNaN(val)) {
          this.errors.codigo = false
          if (val.includes(".")) {
            this.errors.codigo = true  
          }
        }else{
          this.errors.codigo = true
        }
      },
      evaluacion_capacitado : function(val){

        if (!isNaN(val)) {
          this.errors.evaluacion_capacitado = false
          if (val.includes(".")) {
            this.errors.evaluacion_capacitado = true  
          }
        }else{
          this.errors.evaluacion_capacitado = true
        }
      },
      evaluacion_eficacia: function(val){
        if (!isNaN(val)) {
          this.errors.evaluacion_eficacia = false
          if (val.includes(".")) {
            this.errors.evaluacion_eficacia = true  
          }
        }else{
          this.errors.evaluacion_eficacia = true
        }
      },
      descuento_aplicable: function(val) {
        if (!isNaN(val)) {
          this.errors.descuento_aplicable = false
        }else{
          this.errors.descuento_aplicable = true
        }
      },
    },
    methods: {
      selectFile: function (event) {
        this.file = event.target.files[0];
        // console.log(this.file);
        let anularArchivo = false;
        if (this.file) {
          let sizeFile = this.file.size / (1024*1024);
          if (sizeFile > 5.0 ) {
            this.message = "El tamaño no debe superar los 5 MB";
            $('#exampleModal').modal();
            anularArchivo = true;
          }
          if (anularArchivo) {
            this.file = null;
          }
        }
        
        // console.log(this.file);
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
        return data;
  
      },
      sendCapacitacion:  async function(codigo,tipo,tema,fecha_convenio,fecha_inicio,fecha_fin,evaluacion_capacitado,
        evaluacion_eficacia,descuento_aplicable,registro_legal,tiempo_retencion,entidad_educativa_externa,url) {
  
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        var raw = JSON.stringify({
          "codigo": codigo,
          "tipo": tipo,
          "tema": tema,
          "fecha_convenio": fecha_convenio,
          "fecha_inicio": fecha_inicio,
          "fecha_fin": fecha_fin,
          "evaluacion_capacitado": evaluacion_capacitado,
          "evaluacion_eficacia": evaluacion_eficacia,
          "descuento_aplicable": descuento_aplicable,
          "registro_legal": registro_legal,
          "tiempo_retencion": tiempo_retencion,
          "entidad_educativa_externa": entidad_educativa_externa,
          "url": url,
        });
        console.log(raw);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
        let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
        let url_local  = "http://localhost:8080";
        let response = await fetch(`${url_remoto}/api-funciones/crear-registro-capacitacion`, requestOptions)
        let data = await response.json();
        // console.log(data);
        return data;
      },
      convertDate: function(dateString){
        let fecha_sin_formato =  dateString.split("T")[0];
        let fecha_separada = fecha_sin_formato.split("-");
        let fecha_con_formato = fecha_separada[2] + "-"+fecha_separada[1]+"-"+ fecha_separada[0];
        console.log(fecha_con_formato);
        return fecha_con_formato;
       },


      createSolicitudDescanso: async function () {
        this.loading = true;
        if (this.codigo && this.tipo && this.file && this.tema && this.fecha_convenio
           && this.fecha_inicio && this.fecha_fin && this.evaluacion_capacitado && this.evaluacion_eficacia 
           && this.descuento_aplicable && this.requisito_legal && this.tiempo_retencion && this.entidad_educativa ) {
          this.fecha_convenio_formateado = this.convertDate(this.fecha_convenio);
          this.fecha_inicio_formateado = this.convertDate(this.fecha_inicio);
          this.fecha_fin_formateado = this.convertDate(this.fecha_fin);
          let data = await this.sendFile(this.file);
          console.log(data);
          if (!data) {
            return;
          }
          let { id } = data;  
          let urlEndpoint = `https://solucionesm4g.site:8443/files/api-touring-people/downloadPdf/${id}`;
          // console.log(urlEndpoint);
          this.endpoint = urlEndpoint;
          let response = await  this.sendCapacitacion(this.codigo,this.tipo,this.tema,this.fecha_convenio_formateado,this.fecha_inicio_formateado,this.fecha_fin_formateado,this.evaluacion_capacitado,
            this.evaluacion_eficacia,this.descuento_aplicable,this.requisito_legal,this.tiempo_retencion,this.entidad_educativa,this.endpoint);
          let data_zoho =  JSON.parse(response.data)
          if (data_zoho.details.output == "0"){
            this.message = "Se han registrado éxitosamente";  
            $('#exampleModal').modal();
            setTimeout(() => {
              location.reload();  
            }, 3000);        
          }else{
             this.message =  data_zoho.details.output;
             $('#exampleModal').modal();
          }
        }else {
          this.message = "Debe ingresar todos los campos";
          $('#exampleModal').modal();
        }
        this.loading = false;
      },
    }
  })