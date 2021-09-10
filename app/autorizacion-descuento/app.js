var app = new Vue({
    el: '#app',
    data: {
        message:null,
        codigo:null,
        motivo_descuento:null,
        check_autorizacion:null,
        loading:null,
    },
    methods:{
        addRow: function () {
            this.montos_descontar.push({
                descripcion : '',
                precio_unitario : '',
                importe_total : '',
                importe_total_contabilizado : '',
                numero_cuotas : '',
                monto_por_cuotas : '',
            })
        },
        removeRow: function (index, monto_descontar) {
            var idx = this.montos_descontar.indexOf(monto_descontar);
            // console.log(idx, index);
            if (idx > -1) {
              this.montos_descontar.splice(idx, 1);
            }
          },
        sendData: async function () {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
      
            var raw = JSON.stringify({
              "codigo": this.codigo,
              "motivo_descuento": this.motivo_descuento,
              "check": this.check_autorizacion,
              
            });
      
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
      
            let url_remoto = "https://solucionesm4g.site:8443/marcador-people";
            let url_local  = "http://localhost:8080";
            let response = await  fetch(`${url_remoto}/api-funciones/crear-registro-autorizacion-descuento`, requestOptions)
            let data = await response.json() ;
            return data;
          },
          setTwoDecimals: function(monto_descontar,propiedad) {
            var numberFloat = parseFloat(monto_descontar[propiedad]);
            if (!isNaN(numberFloat)) {
              monto_descontar[propiedad] = numberFloat.toFixed(2);
            }
          },
          setNumber: function(monto_descontar){
            var numberInteger = parseInt(monto_descontar["numero_cuotas"])
            if (!isNaN(numberInteger)) {
              monto_descontar["numero_cuotas"] = numberInteger.toFixed(0);
            }
          },
        sendAutorizacionDescuento: async function () {
            try{
              this.loading = true;
              let response =  await this.sendData();
              let data_zoho =  JSON.parse(response.data)
              if (data_zoho.details.output == "0"){
                this.message = "Se han registrado éxitosamente";  
                $('#exampleModal').modal();
                setTimeout(() => {
                  location.reload();  
                }, 4000);        
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
});