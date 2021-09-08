var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    codigo: null,
    file: null,
    endpoint : null,
    errors:{
      codigo:null,
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
    sendRegistroHojaRuta:  async function(codigo,url) {

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        "codigo": codigo,
        "url": url
      });

      // console.log(raw);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
      let url_local  = "http://localhost:8080"
      let response = await fetch(`${url_remoto}/api-funciones/crear-registro-hoja-de-ruta`, requestOptions)
      let data = await response.json();
      return data;

    },
    createHojaRuta: async function () {
      this.loading=true;
      if (this.codigo && this.file) {
        let data = await this.sendFile(this.file);
        // console.log(data);
        if (!data) {
          return;
        }
        let { id } = data;  
        let urlEndpoint = `https://solucionesm4g.site:8443/files/api-touring-people/downloadPdf/${id}`;
        // console.log(urlEndpoint);
        this.endpoint = urlEndpoint;
        let response = await  this.sendRegistroHojaRuta(this.codigo,this.endpoint);
        let data_zoho =  JSON.parse(response.data)
        if (data_zoho.details.output == "0"){
          this.message = "Se han registrado éxitosamente";  
          $('#exampleModal').modal();
          setTimeout(() => {
            // location.reload();  
          }, 3000);
          
        }else{
           this.message =  data_zoho.details.output;
           $('#exampleModal').modal();
        }
      }else {
        this.message = "Debe ingresar ambos campos";
        $('#exampleModal').modal();
      }

      this.loading=false;
    },

  }
})