var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      codigo: null,
      tipo:"",
      file: null,
      fecha_inicio: null,
      fecha_inicio_formato:null,
      fecha_fin: null,
      fecha_fin_formato:null,
      endpoint : null,
      errors:{
        codigo:null
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
      sendSolicitudDescanso:  async function(codigo,url,tipo,fecha_inicio,fecha_fin) {
  
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        let raw = JSON.stringify({
          "codigo": codigo,
          "url": url,
          "tipo": tipo,
          "fecha_inicio": fecha_inicio,
          "fecha_fin": fecha_fin,
        });
  
        // console.log(raw);
  
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
  
        let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
        let url_local  = "http://localhost:8080";
        let response = await fetch(`${url_remoto}/api-funciones/crear-descanso-medico`, requestOptions)
        let data = await response.json();
        // console.log(data);
        return data;
  
      },
       convertDate: function(dateString){
        return dateString.replaceAll("/","-");
        
        },
       convertDateFormat: function(dateString){
        let fecha_sin_formato =  dateString.split("T")[0];
        let fecha_separada = fecha_sin_formato.split("-");
        let fecha_con_formato = fecha_separada[2] + "-"+fecha_separada[1]+"-"+ fecha_separada[0];
        // console.log(fecha_con_formato);
        return fecha_con_formato;
       },
      createSolicitudDescanso: async function () {
        this.search.ui.loading = true
        // this.fecha_inicio = document.getElementById("fecha_inicio").value;
        // this.fecha_fin = document.getElementById("fecha_fin").value;
        // console.log(this.fecha_inicio)
        if (this.fecha_inicio != null ) { 
          this.fecha_inicio_formato = this.convertDateFormat(this.fecha_inicio)
        }
        if (this.fecha_fin != null) {
          this.fecha_fin_formato = this.convertDateFormat(this.fecha_fin);
        }
        
        if (this.codigo && this.tipo && this.file && this.fecha_inicio && this.fecha_fin ) {
          // this.fecha_inicio_formato = this.convertDate(this.fecha_inicio);
          // this.fecha_fin_formato = this.convertDate(this.fecha_fin);
          let data = await this.sendFile(this.file);
          // console.log(data);
          if (!data) {
            return;
          }
          let { id } = data;  
          let urlEndpoint = `https://solucionesm4g.site:8443/files/api-touring-people/downloadPdf/${id}`;
          // console.log(urlEndpoint);
          this.endpoint = urlEndpoint;
          let response = await  this.sendSolicitudDescanso(this.codigo,this.endpoint,this.tipo,this.fecha_inicio_formato,this.fecha_fin_formato);
          let data_zoho =  JSON.parse(response.data)
          if (data_zoho.details.output == "0"){
            this.message = "Se han registrado éxitosamente";  
            $('#exampleModal').modal();
            setTimeout(() => {
              location.reload();  
            }, 5000);        
          }else{
             this.message =  data_zoho.details.output;
             $('#exampleModal').modal();
          }
          
        }else {
          this.message = "Debe ingresar todos los campos";
          $('#exampleModal').modal();
        }
        this.search.ui.loading = false
      },
  
    }
  })