var app = new Vue({
    el: '#app',
    data: {
      message:"",
      codigo: null,
      dni:null,
      familiar:"",
      dato_familiar:null,
      validacion:null,
      file: null,
      documento : {
        acta_defuncion:null,
        partida_nacimiento_colaborador:null,
        copia_dni_familiar:null,
        copia_dni_colaborador:null,
      },
      url:{
        acta_defuncion:null,
        partida_nacimiento_colaborador:null,
        copia_dni_familiar:null,
        copia_dni_colaborador:null,
      },
      endpoint : null,
      errors:{
        codigo: null,
        dni:null,
        dato_familiar:null,
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
        this.file = event.target.files[0];
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
          switch (event.target.id) {
            case "acta_defuncion":
              this.documento.acta_defuncion = this.file;
              break;
            case "partida_nacimiento_colaborador":
              this.documento.partida_nacimiento_colaborador = this.file;
              break;
            case "copia_dni_familiar":
              this.documento.copia_dni_familiar = this.file;
              break;
            case "copia_dni_colaborador":
              this.documento.copia_dni_colaborador = this.file;
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
        console.log(data);
        let { id } = data;  
        let urlEndpoint = `https://solucionesm4g.site:8443/files/api-touring-people/downloadPdf/${id}`;
        return urlEndpoint;
  
      },
      sendBonoFallecimiento:  async function() {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          "codigo": this.codigo,
          "dni": this.dni,
          "familiar": this.familiar,
          "dato_familiar": this.dato_familiar,
          "endpoint":{
            "acta_defuncion":this.url.acta_defuncion,
            "partida_nacimiento_colaborador":this.url.partida_nacimiento_colaborador,
            "copia_dni_familiar":this.url.copia_dni_familiar,
            "copia_dni_colaborador":this.url.copia_dni_colaborador,
          },
        });
        console.log(raw);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
        let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
        let url_local  = "http://localhost:8080";
        let response = await fetch(`${url_remoto}/api-funciones/crear-registro-bono-fallecimiento`, requestOptions)
        let data = await response.json();
        // console.log(data);
        return data;
      },
       convertDate: function(dateString){
        return dateString.replaceAll("/","-");
        },
      createSolicitudBonoFallecimiento: async function () {
        this.loading = true;
        try{
          if (this.documento.acta_defuncion) {
            console.log("acta_defuncion");
            this.url.acta_defuncion = await this.sendFile(this.documento.acta_defuncion);
          }
          if (this.documento.partida_nacimiento_colaborador) {
            console.log("partida_nacimiento_colaborador");
            this.url.partida_nacimiento_colaborador = await this.sendFile(this.documento.partida_nacimiento_colaborador);
          }
          if (this.documento.copia_dni_familiar) {
            console.log("copia_dni_familiar");
            this.url.copia_dni_familiar = await this.sendFile(this.documento.copia_dni_familiar);
          }
          if (this.documento.copia_dni_colaborador) {
            console.log("copia_dni_colaborador");
            this.url.copia_dni_colaborador = await this.sendFile(this.documento.copia_dni_colaborador);
          }
            let response = await  this.sendBonoFallecimiento();
            let data_zoho =  JSON.parse(response.data)
            console.log (response);
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
        }catch(e){
          console.log(e);
        } finally {
          this.loading = false;
        }
        
      },
  
    }
  })