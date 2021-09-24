var app = new Vue({
    el: '#app',
    data: {
      message:"",
      codigo: null,
      fecha_inicio:null,
      fecha_fin:null,
      tipo_licencia:'',
      motivo:null,
      file: null,
      documento : {
        sustento:null,
      },
      url:{
        sustento:null,
      },      
      errors:{
        codigo: null,
        file:null,
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
      dni : function(val){

        if (!isNaN(val)) {
          this.errors.dni = false
          if (val.includes(".")) {
            this.errors.dni = true  
          }
        }else{
          this.errors.dni = true
        }
      },
      archivo: function(val) {
        if (!isNaN(val)) {
          this.errors.archivo = false
        }else{
          this.errors.archivo = true
        }
      },
    },
    methods: {
      selectFile: function (event) {
        console.log("file");
        console.log(event.target.files)
        this.file = event.target.files[0];
        let anularArchivo = false;
        if (this.file) {
          if (this.file.size === 0) {
            this.message = "Ha ingresado un archivo vacio, este no se considerará en el registro, por favor  cambie de archivo ";
            $('#exampleModal').modal();
            return 
          }
          let sizeFile = this.file.size / (1024*1024);

          if (sizeFile > 5.0 ) {
            this.message = "El tamaño no debe superar los 5 MB";
            $('#exampleModal').modal();
            anularArchivo = true;
          }
          if (anularArchivo) {
            this.file = null;
          }
          this.documento.sustento = this.file;
        }else{
          this.documento.sustento = null;
          this.url.sustento = null;
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
      sendLicencia:  async function() {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          "codigo": this.codigo,
          "fecha_inicio": this.convertDateFormat(this.fecha_inicio),
          "fecha_fin": this.convertDateFormat(this.fecha_fin),
          "tipo_licencia": this.tipo_licencia,
          "motivo": this.motivo,
          "documento_url": this.url.sustento,
        });
        console.log(raw);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
        let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
        let url_local  = "http://localhost:8080";
        let response = await fetch(`${url_remoto}/api-funciones/crear-registro-licencia`, requestOptions)
        let data = await response.json();
        // console.log(data);
        return data;
      },
      convertDateFormat: function (dateString) {
        if (dateString) {
          let fecha_sin_formato = dateString.split("T")[0];
          let fecha_separada = fecha_sin_formato.split("-");
          let fecha_con_formato = fecha_separada[2] + "-" + fecha_separada[1] + "-" + fecha_separada[0];
          console.log(fecha_con_formato);
          return fecha_con_formato;  
        }else{
          return null;
        }
        
      },
      createSolicitudLicencia: async function () {
        this.loading = true;
        try{
          if (this.documento.sustento) {
            console.log("documento sustento");
            this.url.sustento = await this.sendFile(this.documento.sustento);
            if (this.url.sustento == 1) {
              this.message = "No se pudo cargar el archivo 'Sustento', porfavor, intente nuevamente o cambie el archivo";
              $('#exampleModal').modal();
              return ;
            }
          }
            let response = await  this.sendLicencia();
            let data_zoho =  JSON.parse(response.data)
            console.log (response);
            if (data_zoho.details.output == "0"){
              this.message = "Se han registrado éxitosamente";  
              $('#exampleModal').modal();
              setTimeout(() => {
                // location.reload();  
              }, 5000);        
            }else{
               this.message =  data_zoho.details.output;
               $('#exampleModal').modal();
            }
        }catch(e){
          this.message = e;
          $('#exampleModal').modal();
        } finally {
          this.loading = false;
        }
      },
  
    }
  })