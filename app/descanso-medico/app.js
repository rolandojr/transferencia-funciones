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
    },
    methods: {
      selectFile: function (event) {
        this.file = event.target.files[0];
        // console.log(this.file);
        if (this.file.type.indexOf('application/pdf') < 0) {
          this.message = "Debe ingresar un documento pdf";
          $('#exampleModal').modal();
          this.file = null;
        }
        let sizeFile = this.file.size / (1024*1024);
        if (sizeFile > 5.0 ) {
          this.message = "El tamaño no debe superar los 5 MB";
          $('#exampleModal').modal();
          this.file = null;
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
  
        let response = await fetch("https://solucionesm4g.site:8443/marcador-people/api-funciones/crear-descanso-medico", requestOptions)
        let data = await response.json();
        // console.log(data);
        return data;
  
      },
       convertDate: function(dateString){
        return dateString.replaceAll("/","-");
        
        },
      createSolicitudDescanso: async function () {
        this.fecha_inicio = document.getElementById("fecha_inicio").value;
        this.fecha_fin = document.getElementById("fecha_fin").value;
        // console.log(this.codigo);
        // console.log(this.tipo);
        // console.log(this.fecha_inicio);
        // console.log(this.fecha_fin);
        if (this.codigo && this.tipo && this.file && this.fecha_inicio && this.fecha_fin ) {
          // console.log(this.codigo);
          // console.log(this.tipo);
          // console.log(this.fecha_inicio);
          // console.log(this.fecha_fin);
          this.fecha_inicio_formato = this.convertDate(this.fecha_inicio);
          this.fecha_fin_formato = this.convertDate(this.fecha_fin);
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