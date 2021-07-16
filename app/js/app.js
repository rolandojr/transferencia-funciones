var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    codigo: null,
    file: null,
    endpoint : null,
  },
  methods: {
    selectFile: function (event) {
      this.file = event.target.files[0];
      console.log(this.file);
      if (this.file.type.indexOf('application/pdf') < 0) {
        this.message = "Debe ingresar un documento pdf";
        $('#exampleModal').modal();
        this.file = null;
      }
      console.log(this.file);
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
    sendTransferencia:  async function(codigo,url) {

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        "codigo": codigo,
        "url": url
      });

      console.log(raw);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };

      let response = await fetch("https://solucionesm4g.site:8443/marcador-people/api-transferencia/crear-transferencia", requestOptions)
      let data = await response.json();
      return data;

    },
    createTransferencia: async function () {
      if (this.codigo && this.file) {
        let data = await this.sendFile(this.file);
        console.log(data);
        if (!data) {
          return;
        }
        let { id } = data;  
        let urlEndpoint = `https://solucionesm4g.site:8443/files/api-touring-people/downloadPdf/${id}`;
        console.log(urlEndpoint);
        this.endpoint = urlEndpoint;
        let response = await  this.sendTransferencia(this.codigo,this.endpoint);
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
        this.message = "Debe ingresar ambos campos";
        $('#exampleModal').modal();
      }
      
    },

  }
})