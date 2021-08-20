var app = new Vue({
    el: '#app',
    data: {
        message:null,
        codigo:null,
        dni:null,
        domicilio:null,
        motivo_descuento:null,
        genera_interes:null,
        porcentaje_interes:null,
        montos_descontar:[{
            descripcion : '',
            precio_unitario : '',
            importe_total : '',
            importe_total_contabilizado : '',
            numero_cuotas : '',
            monto_por_cuotas : '',
        }
        ]
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
              "dni": this.dni,
              "domicilio": this.domicilio,
              "motivo_descuento": this.motivo_descuento,
              "genera_interes": this.genera_interes,
              "porcentaje_interes": this.porcentaje_interes,
              "montos_descontar": this.montos_descontar
              
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
          },
    }
});