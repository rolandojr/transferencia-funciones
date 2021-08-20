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
      endpoint : null,
      errors:{
        codigo: null,
        dni:null,
        dato_familiar:null,
        file:null,
      }
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
        // console.log(this.file);
        let anularArchivo = false;
        if (this.file) {
          if (this.file.type.indexOf('application/pdf') < 0) {
            this.message = "Debe ingresar un documento pdf";
            $('#exampleModal').modal();
            anularArchivo = true;
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
      sendBonoFallecimiento:  async function(codigo,dni,familiar,dato_familiar,validacion,url) {
  
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        var raw = JSON.stringify({
          "codigo": codigo,
          "dni": dni,
          "familiar": familiar,
          "dato_familiar": dato_familiar,
          "validacion": validacion,
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
        let response = await fetch(`${url_remoto}/api-funciones/crear-registro-bono-fallecimiento`, requestOptions)
        let data = await response.json();
        // console.log(data);
        return data;
      },
       convertDate: function(dateString){
        return dateString.replaceAll("/","-");
        },
      createSolicitudBonoFallecimiento: async function () {
        //this.fecha_inicio = document.getElementById("fecha_inicio").value;
        //this.fecha_fin = document.getElementById("fecha_fin").value;
        //this.fecha_convenio = document.getElementById("fecha_convenio").value;       

        if (this.codigo && this.dni && this.familiar && this.dato_familiar && this.validacion  && this.file) {
          //this.fecha_convenio = this.convertDate(this.fecha_convenio);
          ///this.fecha_inicio = this.convertDate(this.fecha_inicio);
          //this.fecha_fin = this.convertDate(this.fecha_fin);

          let data = await this.sendFile(this.file);
          console.log(data);
          if (!data) {
            return;
          }
          let { id } = data;  
          let urlEndpoint = `https://solucionesm4g.site:8443/files/api-touring-people/downloadPdf/${id}`;
          // console.log(urlEndpoint);
          this.endpoint = urlEndpoint;
          let response = await  this.sendBonoFallecimiento(this.codigo,this.dni,this.familiar,this.dato_familiar,this.validacion,this.endpoint);
          let data_zoho =  JSON.parse(response.data)
          console.log (response);
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
        
      },
  
    }
  })