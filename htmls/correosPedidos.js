require('hdb/lib/protocol/common/Constants').MAX_PACKET_SIZE = Math.pow(2,24);
require('datejs');
const axios = require('axios');
var fs = require('fs');
const crypto = require('crypto');
const hdb = require('hdb');
const { query } = require('express');
const { resolve } = require('path');
const envioGeneral = require('./models/integrationModel').envioGeneral;
var qs = require('qs');
const config = require('./configs/config');
const f = require('./funciones')
const writeFileSync = require('fs').writeFileSync
const fileLogs = '/opt/api-app-petco/filelogscorreoNws.txt'
const rutaFile = process.env.NODE_ENV === 'production' ? './tokenHybris.txt' : 'tokenHybris.txt'
var valorGrant = qs.stringify({
 'grant_type': 'client_credentials' 
});
const wFileLog=(message)=>{
  try{
    // writeFileSync(fileLogs, message + '\n', { flag: 'a' })
    // fs.appendFileSync(fileLogs, message);
  }catch(ex){console.log(ex)}
}
let idCorreo = '';
const db = hdb.createClient({
  host     : '10.1.2.239',
  port     : 30215,
  instanceNumber : 02,
  user     : process.env.HANA_USER,
  password : process.env.HANA_ENV
});
db.connect(function (err) {
  if (err) {
    return console.error('Error:', err);
  }
});
const groupBy = keys => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map(key => obj[key]).join('-');
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
const BASE_URL = 'https://api.emarsys.net/api/v2';
function generateHeaderCL(){
  const username = 'petcochile001';
  const pass = 'NkVsn5KPkSQvl6phuCnj';
  return getWsseHeader(username, pass);
}
function isDefined(obj) {
  return obj !== null && obj !== undefined && obj !== ''
}
function generateHeader(pais=config.MX) {
  if(pais === config.MX) {
    const username = 'petco004';
    const pass = '92y49w1BlH0frGvxxszb';
    let headHss = getWsseHeader(username, pass);
    console.log('hss')
    console.log(headHss)
    return headHss;
  } else {
    return generateHeaderCL()
  }
}

function getWsseHeader(user, secret) {
  let nonce = crypto.randomBytes(16).toString('hex');
  let timestamp = new Date().toISOString();

  let digest = base64Sha1(nonce + timestamp + secret);

  return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`
};

function trackingUrls(trackingUrl, trackingID, tienda, obj,PetcoTienda){ 
  if (!isDefined(PetcoTienda))
    PetcoTienda = {paquetera:''
  }
  if (!isDefined(trackingUrl)) {
    return ''
  } else {
    if (trackingUrl.match(/http:\/\/estafeta.azurewebsites.net\/Tracking\/searchByGet\/\?wayBillType=1\&wayBill=/)) {
      return trackingUrl.replace('http://estafeta.azurewebsites.net/Tracking/searchByGet/?wayBillType=1&wayBill=',
      'https://rastreositecorecms.azurewebsites.net/Tracking/searchByGet/?wayBillType=1&wayBill=')
    } else if(trackingUrl.match(/iVoy.*/i)) {
      return 'https://tracking.ivoy.mx/guide/'+trackingID;
    } else if (trackingID && trackingUrl.match(/https:\/\/v2.ivoy.mx\/client\/app\/track\/package\//) && !trackingID.includes('P')) {
      return trackingUrl.replace('https://v2.ivoy.mx/client/app/track/package/','https://tracking.ivoy.mx/guide/') + trackingID
    } else if (trackingUrl.match(/Dostavista.*/i)) {
      return 'https://dostavista.mx/track/'+trackingID
    } else if (trackingUrl.match(/Derby.*/i)) {
      return 'https://tracking.derby.mx/track/'+Buffer.from(trackingID).toString('base64')
    } else if(trackingUrl.match(/RayoApp.*/i)) {
      if(tienda == 'CLP'){
        return `https://seguimiento.thor.rayoapp.com/petcocl?id=${trackingID}`
      }else if(tienda == 'MXN'){
        return `https://seguimiento.thor.rayoapp.com/petco_mex?id=${trackingID}`
      } else{
        return `https://seguimiento.thor.rayoapp.com/Consulta/`
      }
    } else if(trackingUrl.match(/Starken.*/i)) {
      return `https://starken.cl/seguimiento?codigo=${trackingID}`
    }  else if (trackingUrl.match(/Chazki.*/i)){
      return 'https://tracking.ng.paquery.com/package/' + btoa(trackingID).replace("=", "").replace("+", "").replace("/", "")
    } else if (trackingUrl.match(/estafeta*/i)){
      return 'https://cs.estafeta.com/es/Tracking/searchByGet?wayBillType=1&wayBill=' + trackingID
    } else if( PetcoTienda.paquetera.match(/envios4you*/i)){
      return "https://envios4you.com/track/"+PetcoTienda.email+"/"+trackingID
    }else if(PetcoTienda.paquetera.match(/Uber*/i)){
      return PetcoTienda.urlTracking
    }else if(PetcoTienda.paquetera.match(/Envíos\s*Petco/i)){
      return "https://envios4you.com/track/"+PetcoTienda.email+"/"+PetcoTienda.paquetera_tracking
    }
    else {
      return trackingUrl
    }
  }
}

function base64Sha1(str) {
  let hexDigest = crypto.createHash('sha1')
    .update(str)
    .digest('hex');

  return new Buffer.from(hexDigest).toString('base64');
};
/**
 * @abstract Crear lista de contacto en Emarsys
 * @param lista Arreglo de IDs de Emarsys
 * @param nombre Nombre asignado a la lista
 * @param descripcion Descripción de la lista
 */
function createContactList(lista, nombre, descripcion) {
  let datos = {
      name: nombre,
      description: descripcion
  };
  return new Promise((resolve, reject) => {
      axios.post(BASE_URL + '/contactlist', datos, {
        headers: {
            'X-WSSE': generateHeader()
        }
      })
      .then((respuesta) => {
      listaEnvio = respuesta.data.data.id;
      let data = {
          'key_id': 'id',
          'external_ids': lista
      }
      axios.post(BASE_URL + '/contactlist/'+listaEnvio+'/add', data, {
          headers: {
          'X-WSSE': generateHeader()
          }
      })
      .then((response) => {
          resolve({idLista: listaEnvio, agregadoCode: response.data.replyCode,agregadoTexto:response.data.replyText})
      })
      .catch((err) => {
        process.exit()
      });
      })
      .catch((error) => {
        process.exit()
      });
  });
}

function getToken() {
  return new Promise(resolve => {
    var config = {
      method: 'post',
      url: 'https://www.petco.com.mx/authorizationserver/oauth/token',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'User-Agent': '27.05.24/APP61.PETCO.MX', 
        'Host': 'petco.com.mx', 
        'Authorization': 'Basic bW9iaWxlX2FwcDpSN1pNZ05ALlRKPiEkXllN'
      },
      data : valorGrant
    };
    axios(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        resolve(response.data.access_token)
      })
      .catch((error) => {
        console.log(error);
        resolve(null)
      });
  })
}

function getTokenAndUser(correo) {
  return new Promise(resolve => {
    fs.stat(rutaFile, function(err) {
      if (err == null) {
        console.log("TokenHybris exists...");
        fs.readFile(rutaFile, 'utf8', function(err, data) {
          if (err) {
            return console.log(err);
          }
            // console.log(data);
            axios.get('https://www.petco.com.mx/petcows/v2/petco/users/' + encodeURIComponent(correo) + '?fields=FULL',{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Host': 'petco.com.mx',
                'User-Agent': '27.05.24/APP61.PETCO.MX',
                'Authorization': 'Bearer ' + data
              }
            })
            .then((respuesta) => {
              resolve({token: data, idClubPetco: respuesta.data.idClubPetco,
              nombre: respuesta.data.name + ' ' + respuesta.data.middleName + ' ' + respuesta.data.lastName, 
              correo: respuesta.data.displayUid})
            })
            .catch(() => {
              resolve({token: data, idClubPetco: null})
            })
        });

      } else if (err.code == 'ENOENT') {
        console.log("TokenHybris not exists...");
        resolve({token: data, idClubPetco: null})
      } else {
        console.log(err); // ocurrió algún error
        resolve({token: data, idClubPetco: null})
      }
    })
  })
}

// function getOrderDetail(idOrden, idCliente, correo, idEmarsys, tiempoPromesa, tipoEnvio) {
// function getOrderDetail(idOrden, idCliente, correo, idEmarsys, tipoEnvio) {
function getOrderDetail(order, pais) {
  return new Promise(async (resolve) => {
    let resultado = await f.getTokenAndUser(order.email,pais)
    let token = resultado.token
    let urlHybris = config.getURLHybris(pais)
    let baseSiteHybris = config.getHybrisBaseSite(pais)
    const numberFormat1 = new Intl.NumberFormat('es-MX', {style: "currency", currency: "MXN"});
    const numberFormat2 = new Intl.NumberFormat('es-CL', {style: "currency", currency: "CLP"});
   if(pais === config.MX) {
     axios.get(BASE_URL + '/contact/?3='+order.email,{
       headers: {
       'X-WSSE': generateHeader()
       }
     })
     .then((emarsys) => {
       console.log('Emarsys Successfully!')
       axios.get('https://www.petco.com.mx/petcows/v2/petco/users/' + encodeURIComponent(order.email) + '/orders/'+order.client_order_id.slice(0, 8)+ '?fields=FULL',{
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Accept': 'application/json',
           'Host': 'petco.com.mx',
           'User-Agent': '27.05.24/APP61.PETCO.MX',
           'Authorization': 'Bearer ' + token
         }
       })
       .then((response) =>{ 
         if (response.status === 200) {
           let datosOrden = response.data.consignments;
           let url = trackingUrls(order.paquetera, order.paquetera_tracking ,"MX",'',order);
           let splitTxt = `Envío ${order.client_order_id.slice(-1).toString()} de ${datosOrden.length}`
           datosOrden = datosOrden.filter(val => val.code === order.client_order_id)[0]
           let dataOrden = datosOrden.entries.map(val => ({
             numero_marca: val.orderEntry.product.code,
             descripcion_marca: val.orderEntry.product.name,
             cantidad_producto: val.quantity,
             direccion: datosOrden.shippingAddress.formattedAddress.slice(0,(datosOrden.shippingAddress.formattedAddress.length-12)),
             telefono: datosOrden.shippingAddress.phone,
             url_imagen: val.orderEntry.product.images.filter(val => val.format==='product').map(({url}) => 'https://www.petco.com.mx'+url)[0],
             url_producto: 'https://www.petco.com.mx'+val.orderEntry.product.baseOptions[0].selected.url,
             precio_producto: numberFormat1.format((val.orderEntry.totalPrice.value / val.quantity)).toString()//.slice(2)
           }))
           const tipoPago = (tipo) => {
             if (tipo === 'card') {
               return 'Tarjeta de crédito/débito'
             } else if (tipo.match(/paypal plus/i) ) {
               return 'PayPal Plus'
             } else if (tipo.match(/paypal/i) ) {
               return 'PayPal'
             } else if (tipo === 'antad') {
               return 'Office Depot/Chedraui/Elektra'
             } else if (tipo === 'bankDepositr') {
               return 'Depósito Bancario'
             } else if (tipo === 'payu') {
               return 'PayU'
             }
           }
           let paymentInfo = {
             pago: tipoPago(response.data.paymentInfo.paymentMethod),
             banco: response.data.paymentInfo.banco ? response.data.paymentInfo.banco.toUpperCase() : response.data.paymentInfo.paymentMethod === 'paypal' ? 'PAYPAL': undefined,
             cardNumber: response.data.paymentInfo.cardNumber ? '*'.repeat(12)+response.data.paymentInfo.cardNumber.slice(-4): undefined,
             cardType: response.data.paymentInfo.cardType ? response.data.paymentInfo.cardType.name : undefined,
             nombreTarjeta: response.data.paymentInfo.accountHolderName ? response.data.paymentInfo.accountHolderName : undefined,
             expiration: response.data.paymentInfo.expiryMonth && response.data.paymentInfo.expiryYear ? response.data.paymentInfo.expiryMonth + '/'+ response.data.paymentInfo.expiryYear : undefined
           }
           let info = {
             id: order.client_order_id.slice(0, 8).toString(),
             splitTxt,
		         cantidad_splits:order.cantidad_splits || 1,
             nombre_cliente: order.nombre_cliente,
             nombreCliente: order.primerNombre,
             carrito: order.client_order_id,
             datosOrden: dataOrden,
             carritoTotal: response.data.totalPriceIncludingCoupons.formattedValue,
             metodoPago: paymentInfo,
             idEmarsys: emarsys.data.data.id, //'274954099',// idEmarsys === '178166379' ? '78835875' : idEmarsys, //274954099
             idClubPetco: order.client_id,
             correo: order.email,
             tienda_id: order.store,
             tienda: order.store_name,
             url_tienda: datosOrden.deliveryPointOfService ? 'https://www.google.com.mx/maps/search/'+datosOrden.deliveryPointOfService.displayName.split(' ').join('+') : undefined,
             recoleccion: order.recoleccion,
             tipoEnvio: order.tipo_orden,
             paquetera: order.paquetera,
             status_id: order.estatus_sap,
             status_envio: order.tipo_orden !== 'BOPUS' ? (order.estatus_sap === "84" ? "Estamos preparando tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A2" ? "Se generó la guía de tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "90" ?  "Enviamos tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "85" ? "Regresamos tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A3" ? "Se ha entregado tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A4" ? "Se ha regresado a tienda tu pedido "+order.client_order_id.slice(0, 8).toString() : "") : (order.estatus_sap === "84" ? "Estamos listos para entregarte tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "91" ? "Se ha entregado tu pedido "+order.client_order_id.slice(0, 8).toString(): ""),
             tokenOrden: order.tokenOrden,
             pincode:order.tokenUber ? order.tokenUber : "",
             telefono:  order.telefono ?  order.telefono : "",
             created_at: order.createdAt ? order.createdAt : "",
             tipo_orden: order.tipo_orden == "BOPUS" ? "Entrega en tienda Petco" : "Envío a domicilio",
             totalDesc:  response.data.totalCoveredWithCoupons.formattedValue, //
             totalEnv: response.data.totalTax.formattedValue, 
             total: response.data.totalPriceIncludingCoupons.formattedValue,
             totalSinDesc : response.data.totalPrice.formattedValue,
             card: response.data.paymentInfo ? 
             ( response.data.paymentInfo.cardNumber ? response.data.paymentInfo.cardNumber.substring(response.data.paymentInfo.cardNumber.length - 4, response.data.paymentInfo.cardNumber.length) : '')
             : response.data.paymentInfo.subscriptionId,
             cardName: response.data.paymentInfo.accountHolderName,
             methodPay: response.data.paymentInfo.paymentMethod,
             easyBuy: response.data.deliveryMode.deliveryCost.value,
             url: url,
             tokenBOPUS: order.tokenOrden ? order.tokenOrden : '',
             uber_dropoff_eta: order.uber_dropoff_eta ? order.uber_dropoff_eta : undefined

           }
           console.log("Send info...")
           resolve(info)
         } else {
           let info = {
             id: order.client_order_id.slice(0, 8).toString(),
		   cantidad_splits:order.cantidad_splits || 1,
             nombre_cliente: order.nombre_cliente,
             carrito: order.client_order_id,
             datosOrden: [],
             carritoTotal: '$0.00',
             idEmarsys: emarsys.data.data.id,
             metodoPago: {},
             correo: order.email,
             idClubPetco: order.client_id,
             tipoEnvio: order.tipo_orden,
             telefono:  order.telefono ?  order.telefono : "",
             created_at: order.createdAt ? order.createdAt : "",
             tipo_orden: order.tipo_orden == "BOPUS" ? "Entrega en tienda Petco" : "Envío a domicilio"
           }
           resolve(info)
         }
       })
       .catch((error)=>{
         console.log(error.message)
         let info = {
           id: order.client_order_id.slice(0, 8).toString(),
           nombre_cliente: order.nombre_cliente,
		 cantidad_splits:order.cantidad_splits || 1,
           carrito: order.client_order_id,
           datosOrden: [],
           carritoTotal: '$0.00',
           metodoPago: {},
           idEmarsys: emarsys.data.data.id,
           correo: order.email,
           idClubPetco: order.client_id,
           tipoEnvio: order.tipo_orden,             
           telefono:  order.telefono ?  order.telefono : "",
           created_at: order.createdAt ? order.createdAt : "",
           tipo_orden: order.tipo_orden == "BOPUS" ? "Entrega en tienda Petco" : "Envío a domicilio"
         }
         resolve(info)
       })
     })
     .catch((err) => {
       process.exit()
     });
   } else {
          if ( order.tipo_orden == "BOPUS")
          {
            axios.get(`https://www.petco.cl/petcows/v2/petco-chile/users/${encodeURIComponent(order.email)}/orders/${order.client_order_id.slice(0, 8)}?fields=FULL`, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Host': 'www.petco.cl',
                'User-Agent': '27.05.24/APP61.PETCO.MX',
                'Authorization': 'Bearer ' + token
              }
            })
              .then((response) => {
                if (response.status === 200) {
                  let datosOrden = response.data.consignments;
                  datosOrden = datosOrden.filter(val => val.code === order.client_order_id)[0]
                  let dataOrden = datosOrden.entries.map(val => ({
                    numero_marca: val.orderEntry.product.code,
                    descripcion_marca: val.orderEntry.product.name,
                    cantidad_producto: val.quantity,
                    direccion: datosOrden.shippingAddress.formattedAddress ? datosOrden.shippingAddress.formattedAddress.slice(0, (datosOrden.shippingAddress.formattedAddress.length - 12)) : '',
                    telefono: order.telefono ? order.telefono : "",/* datosOrden.shippingAddress.phone, */
                    url_imagen: val.orderEntry.product.images.filter(val => val.format === 'product').map(({ url }) => urlHybris + url)[0],
                    url_producto: urlHybris + val.orderEntry.product.baseOptions[0].selected.url,
                    precio_producto: numberFormat2.format((val.orderEntry.totalPrice.value / val.quantity)).toString()
                  }))
                  const tipoPago = (tipo) => {
                    if (tipo === 'card') {
                      return 'Tarjeta de crédito/débito'
                    } else if (tipo.match(/paypal plus/i)) {
                      return 'PayPal Plus'
                    } else if (tipo.match(/paypal/i)) {
                      return 'PayPal'
                    } else if (tipo === 'antad') {
                      return 'Office Depot/Chedraui/Elektra'
                    } else if (tipo === 'bankDepositr') {
                      return 'Depósito Bancario'
                    } else if (tipo === 'payu') {
                      return 'PayU'
                    }else if (tipo === 'webpayplus') {
                      return 'WEB PAY PLUS'
                    }
                  }
                  let paymentInfo = {
                    pago: tipoPago(response.data.paymentInfo.paymentMethod),
                    banco: response.data.paymentInfo.banco ? response.data.paymentInfo.banco.toUpperCase() : response.data.paymentInfo.paymentMethod === 'paypal' ? 'PAYPAL' : response.data.paymentInfo.paymentMethod === 'webpayplus' ? 'WEBPAYPLUS' : undefined,
                    cardNumber2: response.data.paymentInfo.cardNumber ? '*'.repeat(12) + response.data.paymentInfo.cardNumber.slice(-4) : undefined,
                    cardNumber: response.data.paymentInfo.cardNumber ? response.data.paymentInfo.cardNumber.slice(-4) : undefined,      
                    cardType: response.data.paymentInfo.cardType ? response.data.paymentInfo.cardType.name : undefined,
                    nombreTarjeta: response.data.paymentInfo.accountHolderName ? response.data.paymentInfo.accountHolderName : undefined,
                    expiration: response.data.paymentInfo.expiryMonth && response.data.paymentInfo.expiryYear ? response.data.paymentInfo.expiryMonth + '/' + response.data.paymentInfo.expiryYear : undefined
                  }
                  let info = {
                    id: order.client_order_id.slice(0, 8).toString(),
                    cantidad_splits: order.cantidad_splits || 1,
                    nombre_cliente: order.nombre_cliente,
                    carrito: order.client_order_id,
                    datosOrden: dataOrden,
                    carritoTotal: response.data.totalPriceIncludingCoupons.formattedValue,
                    metodoPago: paymentInfo,
                    idClubPetco: order.client_id,
                    correo: order.email,
                    tienda_id: order.store,
                    tienda: order.store_name,
                    created_at: order.createdAt,
                    url_tienda: datosOrden.deliveryPointOfService ? 'https://www.google.cl/maps/search/' + dataOrden[0].direccion.replace('Piso -1, No. ', '').slice(0, -8).split(', ').join('+') : undefined,
                    recoleccion: order.recoleccion,
                    tipoEnvio: order.tipo_orden,
                    paquetera: order.paquetera,
                    status_id: order.estatus_sap,
                    status_envio: order.tipo_orden !== 'BOPUS' ? (order.estatus_sap === "84" ? "Estamos preparando tu pedido " + order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A2" ? "Se generó la guía de tu pedido " + order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "90" ? "Enviamos tu pedido " + order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "85" ? "Regresamos tu pedido " + order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A3" ? "Se ha entregado tu pedido " + order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A4" ? "Se ha regresado a tienda tu pedido " + order.client_order_id.slice(0, 8).toString() : "") : (order.estatus_sap === "84" ? "Estamos listos para entregarte tu pedido " + order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "91" ? "Se ha entregado tu pedido " + order.client_order_id.slice(0, 8).toString() : ""),
                    tokenOrden: "12345678",
                    tipo_orden: order.tipo_orden == "BOPUS" ? "Entrega en tienda Petco" : "Envío a domicilio",
                    totalDesc:  response.data.totalCoveredWithCoupons.formattedValue, //
                    totalEnv: response.data.totalTax.formattedValue, 
                    total: response.data.totalPriceIncludingCoupons.formattedValue,
                    totalSinDesc : response.data.totalPrice.formattedValue,
                    card: response.data.paymentInfo ? 
                    ( response.data.paymentInfo.cardNumber ? response.data.paymentInfo.cardNumber.substring(response.data.paymentInfo.cardNumber.length - 4, response.data.paymentInfo.cardNumber.length) : '')
                    : response.data.paymentInfo.subscriptionId,
                    cardName: response.data.paymentInfo.accountHolderName,
                    methodPay: response.data.paymentInfo.paymentMethod,
                    easyBuy: response.data.deliveryMode.deliveryCost.value,
                  }
                  console.log("Send info...")
                  resolve(info)
                } else {
                  let info = {
                    id: order.client_order_id.slice(0, 8).toString(),
                    cantidad_splits: order.cantidad_splits || 1,
                    nombre_cliente: order.nombre_cliente,
                    carrito: order.client_order_id,
                    datosOrden: [],
                    carritoTotal: '$0.00',
                    metodoPago: {},
                    correo: order.email,
                    idClubPetco: order.client_id,
                    tipoEnvio: order.tipo_orden
                  }
                  resolve(info)
                }
              })
              .catch((error) => {
                console.log(error.message)
                let info = {
                  id: order.client_order_id.slice(0, 8).toString(),
                  cantidad_splits: order.cantidad_splits || 1,
                  nombre_cliente: order.nombre_cliente,
                  carrito: order.client_order_id,
                  datosOrden: [],
                  carritoTotal: '$0.00',
                  metodoPago: {},
                  correo: order.email,
                  idClubPetco: order.client_id,
                  tipoEnvio: order.tipo_orden
                }
                resolve(info)
              })
          }
          else
          {
            axios.get(`${urlHybris}/petcows/v2/${baseSiteHybris}/users/${encodeURIComponent(order.email)}/orders/${order.client_order_id.slice(0, 8)}?fields=FULL`,{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
              'Host': urlHybris.replace('https://', ''),
              'User-Agent': '27.05.24/APP61.PETCO.MX',
              'Authorization': 'Bearer ' + token
            }
            })
            .then((response) =>{ 
              if (response.status === 200) {
                let datosOrden = response.data.consignments;
                datosOrden = datosOrden.filter(val => val.code === order.client_order_id)[0]
                let url = trackingUrls(order.paquetera, order.paquetera_tracking ,"CL",'',order);
                let dataOrden = datosOrden.entries.map(val => ({
                  numero_marca: val.orderEntry.product.code,
                  descripcion_marca: val.orderEntry.product.name,
                  cantidad_producto: val.quantity,
                  direccion: datosOrden.shippingAddress.formattedAddress.slice(0,(datosOrden.shippingAddress.formattedAddress.length-12)),
                  telefono: datosOrden.shippingAddress.phone,
                  url_imagen: val.orderEntry.product.images.filter(val => val.format==='product').map(({url}) => urlHybris+url)[0],
                  url_producto: urlHybris+val.orderEntry.product.baseOptions[0].selected.url,
                  precio_producto: numberFormat2.format((val.orderEntry.totalPrice.value / val.quantity)).toString()
                }))
                const tipoPago = (tipo) => {
                  if (tipo === 'card') {
                    return 'Tarjeta de crédito/débito'
                  } else if (tipo.match(/paypal plus/i) ) {
                    return 'PayPal Plus'
                  } else if (tipo.match(/paypal/i) ) {
                    return 'PayPal'
                  } else if (tipo === 'antad') {
                    return 'Office Depot/Chedraui/Elektra'
                  } else if (tipo === 'bankDepositr') {
                    return 'Depósito Bancario'
                  } else if (tipo === 'payu') {
                    return 'PayU'
                  } else if (tipo === 'webpayplus') {
                    return 'WEB PAY PLUS'
                  }
                }
                let paymentInfo = {
                  pago: tipoPago(response.data.paymentInfo.paymentMethod),
                  banco: response.data.paymentInfo.banco ? response.data.paymentInfo.banco.toUpperCase() : response.data.paymentInfo.paymentMethod === 'paypal' ? 'PAYPAL': response.data.paymentInfo.paymentMethod === 'webpayplus' ? 'WEBPAYPLUS' : undefined,
                  cardNumber: response.data.paymentInfo.cardNumber ? '*'.repeat(12)+response.data.paymentInfo.cardNumber.slice(-4): undefined,
                  cardType: response.data.paymentInfo.cardType ? response.data.paymentInfo.cardType.name : undefined,
                  nombreTarjeta: response.data.paymentInfo.accountHolderName ? response.data.paymentInfo.accountHolderName : undefined,
                  expiration: response.data.paymentInfo.expiryMonth && response.data.paymentInfo.expiryYear ? response.data.paymentInfo.expiryMonth + '/'+ response.data.paymentInfo.expiryYear : undefined
                }
                let info = {
                  id: order.client_order_id.slice(0, 8).toString(),
                  cantidad_splits:order.cantidad_splits || 1,
                  nombre_cliente: order.nombre_cliente,
                  carrito: order.client_order_id,
                  datosOrden: dataOrden,
                  carritoTotal: response.data.totalPriceIncludingCoupons.formattedValue,
                  metodoPago: paymentInfo,
                  idClubPetco: order.client_id,
                  correo: order.email,
                  tienda_id: order.store,
                  tienda: order.store_name,
                  url_tienda: datosOrden.deliveryPointOfService ? 'https://www.google.cl/maps/search/'+dataOrden[0].direccion.replace('Piso -1, No. ','').slice(0,-8).split(', ').join('+') : undefined,
                  recoleccion: order.recoleccion,
                  tipoEnvio: order.tipo_orden,
                  paquetera: order.paquetera,
                  status_id: order.estatus_sap,
                  status_envio: order.tipo_orden !== 'BOPUS' ? (order.estatus_sap === "84" ? "Estamos preparando tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A2" ? "Se generó la guía de tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "90" ?  "Enviamos tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "85" ? "Regresamos tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A3" ? "Se ha entregado tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "A4" ? "Se ha regresado a tienda tu pedido "+order.client_order_id.slice(0, 8).toString() : "") : (order.estatus_sap === "84" ? "Estamos listos para entregarte tu pedido "+order.client_order_id.slice(0, 8).toString() : order.estatus_sap === "91" ? "Se ha entregado tu pedido "+order.client_order_id.slice(0, 8).toString(): ""),
                  tokenOrden: order.tokenOrden,
                  totalSinDesc : response.data.totalPrice.formattedValue,
                  card: response.data.paymentInfo ? 
                  ( response.data.paymentInfo.cardNumber ? response.data.paymentInfo.cardNumber.substring(response.data.paymentInfo.cardNumber.length - 4, response.data.paymentInfo.cardNumber.length) : '')
                  : response.data.paymentInfo.subscriptionId,
                  cardName: response.data.paymentInfo.accountHolderName,
                  methodPay: response.data.paymentInfo.paymentMethod,
                  easyBuy: response.data.deliveryMode.deliveryCost.value,
                  url: url,
                  tokenBOPUS: order.tokenOrden ? order.tokenOrden : '',
                  uber_dropoff_eta: order.uber_dropoff_eta ? order.uber_dropoff_eta : undefined
                }
                console.log("Send info...")
                resolve(info)
              } else {
                let info = {
                  id: order.client_order_id.slice(0, 8).toString(),
            cantidad_splits:order.cantidad_splits || 1,
                  nombre_cliente: order.nombre_cliente,
                  carrito: order.client_order_id,
                  datosOrden: [],
                  carritoTotal: '$0.00',
                  metodoPago: {},
                  correo: order.email,
                  idClubPetco: order.client_id,
                  tipoEnvio: order.tipo_orden
                }
                resolve(info)
              }
            })
            .catch((error)=>{
              console.log(error.message)
              let info = {
                id: order.client_order_id.slice(0, 8).toString(),
                cantidad_splits:order.cantidad_splits || 1,
                nombre_cliente: order.nombre_cliente,
                carrito: order.client_order_id,
                datosOrden: [],
                carritoTotal: '$0.00',
                metodoPago: {},
                correo: order.email,
                idClubPetco: order.client_id,
                tipoEnvio: order.tipo_orden
              }
              resolve(info)
            })
        }
    }

    /* */
    

  });
}

function getDataBasedOnQuery(query, tipo) {
  return new Promise(resolve => {
    db.exec(query, (err, rows) => {
      if (err) {
        console.log(err)
        resolve([]);
      } else {
        // console.log(rows)
          let resultado = rows.map(obj => ({...obj, tipoEnvio: tipo,tiempoPromesa: getTextoTiempoPromesa(tipo)}))
          if (tipo > 3) {
            resolve([])
          } else {
            resolve(resultado)
          }
      }
    })
  })
}

function getTextoTiempoPromesa(tipo) {
  if (tipo === 1 || tipo === 2) {
    return 'Tu pedido llegará en un plazo de 24 horas'
  } else if (tipo === 3) {
    return 'CDMX y Área metropolitana es de 3 a 5 días hábiles. Guadalajara y Monterrey'
    +' de 3 a 7 días hábiles, y para el resto de la República Mexicana hasta 15 días hábiles'
  } else {
    return ''
  }
}



function getOrders(pedidos){
  return new Promise(async (resolve) => {
    // let queryBOPUS = 'SELECT DISTINCT CLIDE AS CLIENTE_ID, ORDVE AS ORDEN_VENTA_ID, B."/BIC/ZPE_CLCOR" AS CORREO,"/BIC/ZPR_EMAID" AS EMARSYS, FEVTA AS FECHA_VENTA, HOVTA AS HORA_VENTA, '
    // + ' PALOG AS PASO_LOGISTICO, VENVE AS MONTO, TIEND AS TIENDA '
    // // + ' B."/BIC/ZPE_CLCOR" AS CORREO,pc."/BIC/ZPR_EMAID" AS EMARSYS '
    // + ' FROM "_SYS_BIC"."ZPEEC.BOP/ZPEEC_AB_EST_BOP" A '
    // + ' JOIN "SAPPHP"."/BIC/PZPE_CLIDE" pc ON A."CLIDE" = pc."/BIC/ZPE_CLIDE"  '
    // + ' JOIN "SAPPHP"."/BIC/AZPEHBO052" B ON SUBSTRING(A.ORDVE,26,8) = SUBSTRING(B."/BIC/ZPE_ORDVE",28) '
    // + ' WHERE "ORDES" != \'02\' AND PALOG = \'83\' '
    // // + ' AND "FEMOD" = '+fecha+' AND HOMOD >= '+horaPasada+' AND HOMOD <'+horaActual+' AND PALOG = \'83\' ORDER BY ORDVE;'
    // + ' AND ORDVE LIKE \'%17206705%\' OR ORDVE LIKE \'%16739725%\' OR ORDVE LIKE \'%17174867%\' AND PALOG = \'83\' ORDER BY ORDVE;'
    
    // let dataCedis = await getDataBasedOnQuery(queryCEDIS,3)
    let query = {
      client_order_id: pedidos,
      tipo_orden: {$ne:'VENTEL'},
      store: {$ne:'7100'}
    }
    let projection = {
      _id: 0, 
      client_id: 1,
      nombre_cliente:1,
      client_order_id: 1,
      email: 1,
      fecha_venta: 1,
      hora_venta: 1,
      estatus_sap: 1,
      total_orden: 1,
      store: 1,
      store_name: 1,
      tipo_orden: 1, 
      paquetera: 1,
      recoleccion: 1,
      tokenOrden: 1,
      cantidad_splits:1,
      tokenUber:1,
      created_at: 1,
      telefono: 1,
      tipo_orden: 1,
      paquetera_tracking:1,
      paquetera_ordenInt:1,
      paquetera_id: 1,
      urlTracking: 1,
      tokenOrden: 1,
      primerNombre: 1,
      uber_dropoff_eta: 1
    }

    let data = await envioGeneral.find(query, projection).lean().exec()

    if(data.length==0)
      process.exit()
    
    if(data[0].created_at){
      let fechaISO = data[0].created_at;
      let fecha = new Date(fechaISO);
      let año = fecha.getFullYear();
      let mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
      let dia = String(fecha.getDate()).padStart(2, '0');
      let fechaFormateada = `${dia}/${mes}/${año}`;
      data[0].createdAt = fechaFormateada;
    }

    let arregloCompleto = data
    let arregloOrdenes = [];

    let weekBefore = new Date()
    let ahora = new Date()
    weekBefore.setDate(ahora.getDate() - 7)
    let sweekBefore = weekBefore.toString("yyyyMMdd")

    if (arregloCompleto.length > 0) {
      for (const order of arregloCompleto) {
        // console.log(order)
        let pais = /^7/.test(order.store) === true ? config.MX : config.CL;
        let valoresOrden = await getOrderDetail(order, pais)
        wFileLog(JSON.stringify(valoresOrden))
        if (valoresOrden.datosOrden.length > 0) {
          if(Number(order.fecha_venta?order.fecha_venta:0)>Number(sweekBefore)){
            // if(true){
            arregloOrdenes.push(valoresOrden)
            wFileLog('Enviado')
          }else{
            wFileLog('No Enviado')
          }
        } else {
          continue;
        }
      }
      // console.log(arregloCompleto)
      arregloOrdenes = [...new Set(arregloOrdenes.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
      const groupByIdOrdenPadre = groupBy(['id'])
      let ordenes = groupByIdOrdenPadre(arregloOrdenes)
      // ordenes = [...new Set([ordenes].map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
      // console.log(ordenes[0])
      resolve(ordenes)
    } else {
      console.log("Vacío")
      resolve([])
    }
  });
}

function createAndLaunchEmailCampaign(contactListId, tipo, arregloOrden) {
  console.log("Order: ")
  console.log(arregloOrden[0]) 
  
  let auxPago = ''

  if (arregloOrden[0].metodoPago.banco !== null && arregloOrden[0].metodoPago.banco !== undefined) {
    auxPago = '<tr>'
              +' <td align="left" class="lh h2">'
              +' <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
              +'   <span style="font-size: 18px;">'
              +'     '+arregloOrden[0].metodoPago.banco+''
              +'   </span>'
              +' </font>'
              +' </td>'
              +' </tr>'
              +' <tr>'
              +'     <td align="left" class="lh h2">'
              +'     <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
              +'       <span style="font-size: 18px;">'
              +'         '+arregloOrden[0].metodoPago.pago+' '
              +'       </span>'
              +'     </font>'
              +'     </td>'
              +' </tr>'
  } else {
    auxPago = '<tr>'
              +'    <td align="left" class="lh h2">'
              +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
              +'      <span style="font-size: 18px;">'
              +'        '+arregloOrden[0].metodoPago.pago+''
              +'      </span>'
              +'    </font>'
              +'    </td>'
              +'</tr>'
              +'<tr>'
              +'    <td align="left" class="lh h2">'
              +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
              +'      <span style="font-size: 18px;">'
              +'        '+arregloOrden[0].metodoPago.cardNumber+''
              +'      </span>'
              +'    </font>'
              +'    </td>'
              +'</tr>'
              +'<tr>'
              +'    <td align="left" class="lh h2">'
              +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
              +'      <span style="font-size: 18px;">'
              +'        '+arregloOrden[0].metodoPago.nombreTarjeta+''
              +'      </span>'
              +'    </font>'
              +'    </td>'
              +'</tr>'
              +'<tr>'
              +'    <td align="left" class="lh h2">'
              +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
              +'      <span style="font-size: 18px;">'
              +'        '+arregloOrden[0].metodoPago.cardType+''
              +'      </span>'
              +'    </font>'
              +'    </td>'
              +'</tr>'
              +'<tr>'
              +'    <td align="left" class="lh h2">'
              +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
              +'      <span style="font-size: 18px;">'
              +'        '+arregloOrden[0].metodoPago.expiration+''
              +'      </span>'
              +'    </font>'
              +'    </td>'
              +'</tr>'
  }
  
  let cards_begin = '\n<tr>'
                   +'\n\t<td align="center">'
                   +'\n\t\t<div class="yfix">'

  let cards_end   = '\n\t\t</div>' 
                   +'\n\t</td>' 
                   +'\n</tr>'
  
  let productos = ''

  let aux =  '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
             +' Tu número de pedido es <strong> '+arregloOrden[0].id+' </strong> y el costo total de tu compra'
             +' es de <strong> '+arregloOrden[0].carritoTotal+' </strong>'
             +'</font>'

  let auxProductos = ''

  for (let i = 0; i < arregloOrden.length; i++) {
    productos += cards_begin
    if (arregloOrden[0].tipoEnvio !== 1) {
      auxProductos += '<br>'
                      +'<table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
                      +'  <tr>'
                      +'  <td align="left" class="lh h2">'
                      +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
                      +'    <span style="font-size: 14px;"><strong> Envío '+arregloOrden[i].carrito.slice(-1)+' </strong></span>'
                      +'    </font>'
                      +'  </td>'
                      +'  </tr>'
                      +'  <tr>'
                      +'  <td height="5" class="rh10">'
                      +'    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="5" style="display: block;">'
                      +'  </td>'
                      +'  </tr>'
                      +'  <tr>'
                      +'  <td align="left" class="lh h2">'
                      +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
                      // +'    <p style="font-size: 14px;"> <strong> Fecha aproximada de entrega: </p> </span>'
                      +'    </font>'
                      +'  </td>'
                      +'  </tr>'
                      +'  <tr>'
                      +'  <td align="left" class="lh h2">'
                      +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
                      // +'    <span style="font-size: 14px;"> '+arregloOrden[i].tiempoPromesa+' </span>'
                      +'    </font>'
                      +'  </td>'
                      +'  </tr>'
                      +'  <tr>'
                      +'  <td height="5" class="rh10">'
                      +'    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="5" style="display: block;">'
                      +'  </td>'
                      +'  </tr>'
                      +'  <tr>'
                      +'  </tr>'
                      +'</table>'
    } else {
      auxProductos += ''
    }
    for (let j = 0; j < arregloOrden[i].datosOrden.length; j++) {
      auxProductos += '<table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
                     +'  <tr>'
                     +'  <td align="center">'
                    // ANTERIOR
                    //  +'    <img src="'+arregloOrden[i].datosOrden[j].url_imagen+'"'
                    //  +'    border="0" style="display: block;" class="image vce-image" alt="">'
                     +'     <table cellspacing="0" cellpadding="0" border="0" width="0%">'
                     +'       <tr>'
                     +'           <td align="center">'
                     +'               <table border="0" cellspacing="0" cellpadding="0" class="fw">'
                     +'                   <tr>'
                     +'                       <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
                     +'                           font-weight: normal; vertical-align: top;">'
                     +'                           '
                     +'                           <table cellspacing="0" cellpadding="0" border="0" width="186" class="fw sm4">'
                     +'                               <tr>'
                     +'                               <!--[IMAGEN]-->'
                     +'                                   <td align="center">'
                     +'                                   <a href="" target="_blank"><img src="'+arregloOrden[i].datosOrden[j].url_imagen+'" class="img-widget"></a>'
                     +'                                   </td>'
                     +'                               <!--[IMAGEN]-->'
                     +'                               </tr>'
                     +'                               <tr>'
                     +'                                   <td align="center">'
                     +'                               '
                     +'                                   </td>'
                     +'                               </tr>'
                     +'                           </table> '
                     +'                       </th>'
                     +'                   </tr>'
                     +'               </table>'
                     +'           </td>'
                     +'       </tr>'
                     +'     </table>'
                     +'  </td>'
                     +'  </tr>'
                     +'  <tr>'
                     +'  <td align="center" class="lh h2">'
                     +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
                     +'    <p style="font-size: 14px;">'
                     +'      <strong> '
                     +'      '+arregloOrden[i].datosOrden[j].descripcion_marca+''
                     +'      </strong> '
                     +'      '+arregloOrden[i].datosOrden[j].numero_marca+''
                     +'    </p>'
                     +'    </font>'
                     +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
                     +'    <p style="font-size: 14px;">'
                     +'      <strong> '
                     +'      Cantidad: '
                     +'      </strong> '
                     +'      '+arregloOrden[i].datosOrden[j].cantidad_producto+''
                     +'    </p>'
                     +'    </font>'
                     +'    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
                     +'    <p style="font-size: 14px;">'
                     +'      <strong> '
                     +'      Precio unitario: '
                     +'      </strong> '
                     +'      '+arregloOrden[i].datosOrden[j].precio_producto+''
                     +'    </p>'
                     +'    </font>'
                     +'  </td>'
                     +'  </tr>'
                     +'</table>' 
    }  
    
    productos += cards_end  
  }
  // console.log(productos)  
  let aux2 = ''
  let BoB = ''
  console.log(arregloOrden[0].tipoEnvio)
  if (arregloOrden[0].tipoEnvio === "BOSS") {
    aux2 = ''
    BoB = '<span style="font-size: 25px;"><strong> Envío a domicilio </strong></span>'
    if (arregloOrden[0].status_id === "84") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
          +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> pronto será enviado, estamos en proceso de generarle una '
          +' guía para que pueda ser recolectado. <strong> ¡Apreciamos tu paciencia! </strong>'
          +'</font>'
    } else if (arregloOrden[0].status_id === "A2") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
          +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> ya cuenta con una guía de '
          +' <strong> '+arregloOrden[0].paquetera+'</strong>, lo estarás recibiendo el día de hoy.'
          +'</font>'
    } else if (arregloOrden[0].status_id === "90") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
          +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> está en camino a la dirección que nos indicaste a través de '
          +' <strong> '+arregloOrden[0].paquetera+'</strong>.'
          +'</font>'
    } else if (arregloOrden[0].status_id === "A3") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
          +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> ha sido entregado. '
          +' <strong> ¡Agradecemos tu compra!</strong>'
          +'</font>'
    } else if (arregloOrden[0].status_id === "A4") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
          +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> está en camino de regreso para su posterior envío, desafortunadamente no tuvimos suerte en localizarte. '
          +'</font>'
    } else if (arregloOrden[0].status_id === "85") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
          +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> ha sido regresado. El día de mañana volveremos a intentar la entrega. '
          +'</font>'
    }
    
  } else { 
    aux2 = ''
    BoB = '<span style="font-size: 25px;"><strong> Recoger en tienda </strong></span>'
    if (arregloOrden[0].status_id === "84") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
              +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> está listo para recoger en '
              +' <strong> '+arregloOrden[0].tienda+'</strong>. ¡Esperamos tu visita para entregártelo!'
              +'</font>'
    } else if (arregloOrden[0].status_id === "91") {
      aux = '<font class="hl1" style="font-family: Arial, sans-serif; font-size: 18px; color: #000000;">'
              +' Tu pedido <strong> '+arregloOrden[0].id+' </strong> ha sido entregado en '
              +' <strong> '+arregloOrden[0].tienda+'</strong>. ¡Agradecemos tu compra!'
              +'</font>'
    }

  }        
  
let htmlToSend = ''
+'  <html xmlns:v="urn:schemas-microsoft-com:vml"'
+'xmlns:o="urn:schemas-microsoft-com:office:office"'
+'xmlns:w="urn:schemas-microsoft-com:office:word"'
+'xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"'
+'xmlns="http://www.w3.org/TR/REC-html40">'
+'<head>'
+' <title>Petco Mexico | Tienda de Mascotas Online, alimento para perros y gatos, casa'
+'  para perro, pecera, collares, juguetes y más</title>'
+' <meta name="viewport" content="initial-scale=1, user-scalable=yes">'
+' <!--[if !mso]><!-->'
+' <meta http-equiv="X-UA-Compatible" content="IE=edge">'
+' <!--<![endif]-->'
+' <meta http-equiv="content-type" content="text/html; charset=utf-8">'
+' <style type="text/css">'
+'<!--'
+'body { margin:0; padding:0; background:#ffffff; -webkit-text-size-adjust:none; -ms-text-size-adjust:none; }'
+'a, a:active, a:visited, .yshortcuts, .yshortcuts a span { color:#000000; text-decoration:none; font-weight:normal; }'
+'a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family:'
+'inherit !important; font-weight: inherit !important; line-height: inherit !important; }'
+'[office365] td div, [office365] button { display:block !important; }'
+'.ReadMsgBody { width:100%; }'
+'.ExternalClass *, .b-message-body { line-height:100%; }'
+'.ExternalClass { width:100%; }'
+'input { display:none !important; max-height:0px; overflow:hidden; }'
+'table th { padding:0; Margin:0; border:0; font-weight:normal; vertical-align:top; }'
+'*[lang="uri"] a { color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !'
+'important; font-weight:inherit !important; line-height:inherit !important; }'
+'.olcta4td { padding:5px 20px !important; }'
+'-->'
+' </style>'
+' <!--[if gte mso 9]>'
+'<style type="text/css">'
+'table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; border:0; }'
+'table td, table th { border-collapse:collapse; font-size:1px; line-height:1px; }'
+'.lh { line-height:normal !important; }'
+'.olctatd { padding:0 !important; }'
+'<xml>'
+' <o:OfficeDocumentSettings>'
+' <o:AllowPNG/>'
+'  <o:PixelsPerInch>96</o:PixelsPerInch>'
+' </o:OfficeDocumentSettings>'
+'</xml>'
+'</style>'
+'<![endif]-->'
+' <style>'
+'  a img'
+'  {'
+'   border: 0;'
+'  }'
+'  .cp, .cp1, .cp2, .ph, .ov, .ni, .ni font, .hl, .hl1, .hl2, .hl3, .cta, .cta font, .ft, .un, .un font'
+'  {'
+'   font-family: Arial, sans-serif;'
+'   font-size: 12px;'
+'   color: #87888a;'
+'  }'
+'  .ni, .cta, .un'
+'  {'
+'   line-height: normal;'
+'  }'
+'  .cp a'
+'  {'
+'   font-weight: normal;'
+'   text-decoration: underline;'
+'   color: #87888a;'
+'  }'
+'  .cp1 a'
+'  {'
+'   font-weight: normal;'
+'   text-decoration: none;'
+'   color: #87888a;'
+'  }'
+'  .ph'
+'  {'
+'   font-size: 10px;'
+'  }'
+'  .ph a'
+'  {'
+'   color: #87888a;'
+'   font-weight: normal;'
+'   text-decoration: underline;'
+'  }'
+'  .ph a.mailto'
+'  {'
+'   color: #87888a;'
+'   text-decoration: none;'
+'  }'
+'  .ov'
+'  {'
+'   font-size: 10px;'
+'   color: #000000;'
+'   font-weight: bold;'
+'  }'
+'  .ov a'
+'  {'
+'   color: #000000;'
+'   font-weight: bold;'
+'   text-decoration: none;'
+'  }'
+'  .ni, .ni font'
+'  {'
+'   color: #000000;'
+'   font-weight: bold;'
+'  }'
+'  .ni a'
+'  {'
+'   color: #000000;'
+'   font-weight: bold;'
+'   text-decoration: none;'
+'  }'
+'  .hl'
+'  {'
+'   font-size: 16px;'
+'   color: #ffffff;'
+'   font-weight: bold;'
+'  }'
+'  .hl a'
+'  {'
+'   color: #ffffff;'
+'   font-weight: bold;'
+'   text-decoration: none;'
+'  }'
+'  .hl1'
+'  {'
+'   font-size: 16px;'
+'   color: #000000;'
+'  }'
+'  .hl1 a'
+'  {'
+'   color: #000000;'
+'   font-weight: normal;'
+'   text-decoration: none;'
+'  }'
+'  .hl2'
+'  {'
+'   font-size: 17px;'
+'   color: #464648;'
+'  }'
+'  .hl2 a'
+'  {'
+'   color: #464648;'
+'   font-weight: normal;'
+'   text-decoration: none;'
+'  }'
+'  .hl3'
+'  {'
+'   font-size: 10px;'
+'   color: #87888a;'
+'   font-weight: bold;'
+'  }'
+'  .hl3 a'
+'  {'
+'   font-weight: bold;'
+'   text-decoration: none;'
+'   color: #87888a;'
+'  }'
+'  .cp1'
+'  {'
+'   font-size: 20px;'
+'  }'
+'  .cp2'
+'  {'
+'   font-size: 11px;'
+'   color: #464648;'
+'  }'
+'  .cp2 a'
+'  {'
+'   font-weight: normal;'
+'   text-decoration: underline;'
+'   color: #464648;'
+'  }'
+'  .pr'
+'  {'
+'   color: #e01b23;'
+'   font-weight: bold;'
+'  }'
+'  .pr a'
+'  {'
+'   color: #e01b23;'
+'   font-weight: bold;'
+'   text-decoration: none;'
+'  }'
+'  .cta, .cta font'
+'  {'
+'   font-size: 16px;'
+'   color: #ffffff;'
+'  }'
+'  .cta a'
+'  {'
+'   color: #ffffff;'
+'   font-weight: normal;'
+'   text-decoration: none;'
+'  }'
+'  .ft'
+'  {'
+'   font-size: 10px;'
+'  }'
+'  .ft a'
+'  {'
+'   color: #87888a;'
+'   font-weight: bold;'
+'   text-decoration: normal;'
+'  }'
+'  .un, .un font'
+'  {'
+'   font-size: 10px;'
+'  }'
+'  .un a'
+'  {'
+'   color: #00aae7;'
+'   font-weight: bold;'
+'   text-decoration: normal;'
+'  }'
+'  @media only screen and (max-width:400px)'
+'  {'
+'   .fl'
+'   {'
+'    display: block !important;'
+'    width: 100% !important;'
+'   }'
+'   .fw'
+'   {'
+'    width: 100% !important;'
+'    min-width: 0 !important;'
+'   }'
+'   .sec'
+'   {'
+'    width: 100% !important;'
+'    float: none !important;'
+'   }'
+'   .mh, .mobile_hidden'
+'   {'
+'    display: none !important;'
+'   }'
+'   .image'
+'   {'
+'    width: 100% !important;'
+'    height: auto !important;'
+'   }'
+'   .comt'
+'   {'
+'    margin: 0 auto !important;'
+'   }'
+'   .com'
+'   {'
+'    text-align: center;'
+'   }'
+'   .lom'
+'   {'
+'    text-align: left;'
+'   }'
+'   font'
+'   {'
+'    font-size: 17px !important;'
+'    font-size: 5.3125vw !important;'
+'   }'
+'   .h1, .h1 font'
+'   {'
+'    font-size: 24px !important;'
+'    font-size: 7.5vw !important;'
+'   }'
+'   .h2, .h2 font'
+'   {'
+'    font-size: 20px !important;'
+'    font-size: 6.25vw !important;'
+'   }'
+'   .small, .small font'
+'   {'
+'    font-size: 15px !important;'
+'    font-size: 4.6875vw !important;'
+'   }'
+'   .xsmall, .xsmall font'
+'   {'
+'    font-size: 13px !important;'
+'    font-size: 4.0625vw !important;'
+'   }'
+'   .cta4a, .cta4a td'
+'   {'
+'    background: none !important;'
+'    border-radius: 0 !important;'
+'    padding: 0 !important;'
+'   }'
+'   .cta4a a'
+'   {'
+'    display: block;'
+'    background: #e01b23;'
+'    border-radius: 3px;'
+'    padding: 7px 20px;'
+'   }'
+'   .rwom'
+'   {'
+'    width: auto !important;'
+'   }'
+'   .rhom'
+'   {'
+'    height: auto !important;'
+'   }'
+'   .rw5, .rw5 img'
+'   {'
+'    width: 5px !important;'
+'   }'
+'   .rw10, .rw10 img'
+'   {'
+'    width: 10px !important;'
+'   }'
+'   .rh10, .rh10 img'
+'   {'
+'    height: 10px !important;'
+'    height: 3.125vw !important;'
+'   }'
+'   .rh15, .rh15 img'
+'   {'
+'    height: 15px !important;'
+'    height: 4.6875vw !important;'
+'   }'
+'   .rh20, .rh20 img'
+'   {'
+'    height: 20px !important;'
+'    height: 6.25vw !important;'
+'   }'
+'   .mtb10'
+'   {'
+'    margin-top: 10px;'
+'    margin-bottom: 10px;'
+'   }'
+'   .mtop10'
+'   {'
+'    margin-top: 10px;'
+'   }'
+'   .plr10'
+'   {'
+'    padding: 0 10px;'
+'   }'
+'   .ptb10'
+'   {'
+'    padding: 10px 0;'
+'   }'
+'   .s1, .s1 img'
+'   {'
+'    height: 10px !important;'
+'    height: 3.125vw !important;'
+'   }'
+'   .s2, .s2 img'
+'   {'
+'    height: 5px !important;'
+'    height: 1.5625vw !important;'
+'   }'
+'   .s3, .s3 img'
+'   {'
+'    height: 10px !important;'
+'    height: 3.125vw !important;'
+'   }'
+'   .s4, .s4 img'
+'   {'
+'    height: 30px !important;'
+'    height: 9.375vw !important;'
+'   }'
+'   .sm1'
+'   {'
+'    margin-bottom: 10px !important;'
+'    margin-bottom: 3.125vw !important;'
+'   }'
+'   .sm2'
+'   {'
+'    margin-bottom: 5px !important;'
+'    margin-bottom: 1.5625vw !important;'
+'   }'
+'   .sm3'
+'   {'
+'    margin-bottom: 10px !important;'
+'    margin-bottom: 3.125vw !important;'
+'   }'
+'   .sm4'
+'   {'
+'    margin-bottom: 30px !important;'
+'    margin-bottom: 9.375vw !important;'
+'   }'
+'   .break'
+'   {'
+'    display: block !important;'
+'   }'
+'   .nobg'
+'   {'
+'    background: none !important;'
+'   }'
+'   .nav'
+'   {'
+'    background-color: #ffffff;'
+'    height: 40px;'
+'    height: 12.5vw !important;'
+'    border-bottom: 1px solid #6d6e70;'
+'   }'
+'   .nav td:first-child font:after'
+'   {'
+'    content: "Menú";'
+'    padding: 0px 0px 0px 10px;'
+'    font-weight: bold;'
+'    color: #000000;'
+'   }'
+'   .nav td:last-child font:after'
+'   {'
+'    content: "=";'
+'    font-size: 30px;'
+'    padding: 0px 10px 0px 0px;'
+'    font-weight: normal;'
+'    color: #000000;'
+'   }'
+'   .content th:first-child'
+'   {'
+'    border-top: none;'
+'   }'
+'   .content th a'
+'   {'
+'    border-bottom: 1px solid #6d6e70;'
+'    padding: 5px 10px;'
+'    display: block;'
+'   }'
+'   input[type=checkbox]:checked + .content'
+'   {'
+'    max-height: 500px !important;'
+'    max-height: 156.25vw !important;'
+'   }'
+'   .content'
+'   {'
+'    max-height: 0px;'
+'    overflow: hidden;'
+'    -moz-transition: all 750ms ease;'
+'    -ms-transition: all 750ms ease;'
+'    -o-transition: all 750ms ease;'
+'    -webkit-transition: all 750ms ease;'
+'    transition: all 750ms ease;'
+'   }'
+'   .m2c'
+'   {'
+'    display: block;'
+'    width: 50%;'
+'    float: left;'
+'   }'
+'   .pl'
+'   {'
+'    padding-left: 5px;'
+'   }'
+'   .pr'
+'   {'
+'    padding-right: 5px;'
+'   }'
+'   u + .body .gmh'
+'   {'
+'    display: none !important;'
+'   }'
+'   u + .body .gwfw'
+'   {'
+'    width: 100% !important;'
+'    width: 100vw !important;'
+'   }'
+'  }'
+'  @media only screen and (width:375px)'
+'  {'
+'   .iph'
+'   {'
+'    padding: 0 8px 0 7px !important;'
+'   }'
+'  }'
+'  @media yahoo'
+'  {'
+'   .yh'
+'   {'
+'    display: none !important;'
+'   }'
+'   .mby20'
+'   {'
+'    margin-bottom: 20px;'
+'   }'
+'  }'
+' </style>'
+'</head>'
+'<body class="body">'
+' <div ems:preheader="" style="display: none!important; font-size: 1px; color: #333333;'
+'  line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;'
+'  mso-hide: all">'
+'  Promociones exclusivas, cupones de descuento, códigos promocionales y mas...</div>'
+' <div class="yfix">'
+'  <table cellspacing="0" cellpadding="0" border="0" width="100%" height="100%" bgcolor="#ffffff"'
+'   class="gwfw">'
+'   <tr>'
+'    <td width="100%" align="center" valign="top">'
+'     <table cellspacing="0" cellpadding="0" border="0" width="660" class="fw">'
+'      <tr>'
+'       <td style="padding: 0 5px;" class="iph">'
+'        <table cellspacing="0" cellpadding="0" border="0" width="650" bgcolor="#ffffff" class="fw">'
+'         <tr>'
+'          <td width="25" class="rw5">'
+'          </td>'
+'          <td>'
+'           <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'            <tr>'
+'             <td height="20">'
+'              <br>'
+'             </td>'
+'            </tr>'
+'            <tr>'
+'             <td>'
+'<!--[ENCABEZADO]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'                <td>'
+'                 <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                  <tr>'
+'<!--[ENCABEZADO-TITULO1]-->'
+'                   <td align="center" valign="middle" style="vertical-align: middle;" class="lh com">'
+'                    <font class="ph xsmall" style="font-family: Arial, sans-serif; color: #87888a; font-size: 10px;">'
+'                    </font>'
+'                   </td>'
+'<!--[ENCABEZADO-TITULO1]-->'
+'                  </tr>'
+'                  <tr>'
+'                   <td height="10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                 </table>'
+'                 <table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#e9e9ea">'
+'                  <tr>'
+'                   <td height="5">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="5" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'                   <td align="center">'
+'                    <table cellspacing="0" cellpadding="0" border="0" class="fw">'
+'                     <tr>'
+'                      <td width="10">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                      </td>'
+'                      <td align="left" valign="middle" style="vertical-align: middle;" class="lh com">'
+'                       <font class="ph xsmall" style="font-family: Arial, sans-serif; color: #87888a; font-size: 10px;">'
+'                        escríbenos aquí <a href="mailto:info@petco.com.mx" ems:notrack="true" class="mailto"'
+'                         style="color: #000000; font-weight: bold; text-decoration: none;" target="_blank">'
+'                         info@petco.com.mx</a> para saber más</font>'
+'                      </td>'
+'                      <td width="5" class="mh">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                      </td>'
+'                      <td width="1" height="20" bgcolor="#747475" class="mh">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                      </td>'
+'                      <td width="5" class="mh">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                      </td>'
+'                      <td align="left" valign="middle" style="vertical-align: middle;" class="lh mh">'
+'                       <font class="ov" style="font-family: Arial, sans-serif; font-size: 10px; color: #000000;'
+'                        font-weight: bold;"><a href="#HTML_BROWSE_HREF#" ems:notrack="true" target="_blank"'
+'                         style="color: #000000; font-weight: bold; text-decoration: none;">ver sitio</a></font>'
+'                      </td>'
+'                      <td width="10">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                      </td>'
+'                     </tr>'
+'                    </table>'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'                   <td height="5">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="5" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                 </table>'
+'                </td>'
+'               </tr>'
+'               <tr>'
+'                <td height="10">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'                <td height="5">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="5" style="display: block;">'
+'                </td>'
+'               </tr>'
+'               <tr>'
+'                <td align="center">'
+'                    <a href="https://www.petco.com.mx/" target="_blank" style="color: #000000; text-decoration: none; '
+'                                      font-weight: normal;"> '
+'                        <img src="https://einfo.petco.com.mx/custloads/765664703/md_1035657.png" width="400" '
+'                    height="100" border="0" style="display: block;" class="logo vce-image"></a> '
+'                </td>'
+'               </tr>'
+'               <tr>'
+'                <td height="15">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr class="gmh">'
+'                <td align="left">'
+'                 <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                  <tr>'
+'                   <td align="center">'
+'                    <!--[if !mso 9]><!-->'
+'                    <label for="button" onclick="">'
+'                     <table cellspacing="0" cellpadding="0" border="0" width="100%" class="nav yh">'
+'                      <tr>'
+'                       <td align="left">'
+'                        <font face="Arial, "Helvetica Neue", Helvetica, sans-serif"></font>'
+'                       </td>'
+'                       <td align="right">'
+'                        <font face="Arial, "Helvetica Neue", Helvetica, sans-serif"></font>'
+'                       </td>'
+'                      </tr>'
+'                     </table>'
+'                    </label>'
+'                    <input id="button" type="checkbox" style="mso-hide: all; max-height: 0px; overflow: hidden;'
+'                     display: none !important;"><!--<![endif]-->'
+'                    <div class="content">'
+'                     <div style="">'
+'                     </div>'
+'                     <table cellspacing="0" cellpadding="0" border="0" class="fw mby20">'
+'                      <tr>'
+'                       <th align="left" valign="top" class="fl ni" style="padding: 0; margin: 0; border: 0;'
+'                        vertical-align: top; font-family: Arial, sans-serif; font-size: 12px; line-height: normal;'
+'                        color: #000000; font-weight: bold;">'
+'                        <a href="https://www.petco.com.mx/petco/en/Perro" target="_blank" style="color: #000000;'
+'                         font-weight: bold; text-decoration: none;"><font style="font-family: Arial, sans-serif;'
+'                          font-size: 12px; color: #000000; font-weight: bold;">perro</font></a>'
+'                       </th>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <td width="1" height="20" bgcolor="#7f7f7f" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                       </td>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <th align="left" valign="top" class="fl ni" style="padding: 0; margin: 0; border: 0;'
+'                        vertical-align: top; font-family: Arial, sans-serif; font-size: 12px; line-height: normal;'
+'                        color: #000000; font-weight: bold;">'
+'                        <a href="https://www.petco.com.mx/petco/en/Gato" target="_blank" style="color: #000000;'
+'                         font-weight: bold; text-decoration: none;"><font style="font-family: Arial, sans-serif;'
+'                          font-size: 12px; color: #000000; font-weight: bold;">gato</font></a>'
+'                       </th>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <td width="1" height="20" bgcolor="#7f7f7f" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                       </td>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <th align="left" valign="top" class="fl ni" style="padding: 0; margin: 0; border: 0;'
+'                        vertical-align: top; font-family: Arial, sans-serif; font-size: 12px; line-height: normal;'
+'                        color: #000000; font-weight: bold;">'
+'                        <a href="https://www.petco.com.mx/petco/en/Peces" target="_blank" style="color: #000000;'
+'                         font-weight: bold; text-decoration: none;"><font style="font-family: Arial, sans-serif;'
+'                          font-size: 12px; color: #000000; font-weight: bold;">peces</font></a>'
+'                       </th>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <td width="1" height="20" bgcolor="#7f7f7f" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                       </td>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <th align="left" valign="top" class="fl ni" style="padding: 0; margin: 0; border: 0;'
+'                        vertical-align: top; font-family: Arial, sans-serif; font-size: 12px; line-height: normal;'
+'                        color: #000000; font-weight: bold;">'
+'                        <a href="https://www.petco.com.mx/petco/en/Aves" target="_blank" style="color: #000000;'
+'                         font-weight: bold; text-decoration: none;"><font style="font-family: Arial, sans-serif;'
+'                          font-size: 12px; color: #000000; font-weight: bold;">aves</font></a>'
+'                       </th>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <td width="1" height="20" bgcolor="#7f7f7f" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                       </td>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <th align="left" valign="top" class="fl ni" style="padding: 0; margin: 0; border: 0;'
+'                        vertical-align: top; font-family: Arial, sans-serif; font-size: 12px; line-height: normal;'
+'                        color: #000000; font-weight: bold;">'
+'                        <font style="font-family: Arial, sans-serif; font-size: 12px; color: #000000; font-weight: bold;">'
+'                         <a href="https://www.petco.com.mx/petco/en/Reptiles" target="_blank" style="color: #000000;'
+'                          font-weight: bold; text-decoration: none;"><font style="font-family: Arial, sans-serif;'
+'                           font-size: 12px; color: #000000; font-weight: bold;">reptiles</font></a></font>'
+'                       </th>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <td width="1" height="20" bgcolor="#7f7f7f" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                       </td>'
+'                       <td width="25" class="mh">'
+'                        <img src="https://suite16.emarsys.net/img/trans.gif" width="25" height="1" style="display: block;">'
+'                       </td>'
+'                       <th align="left" valign="top" class="fl ni" style="padding: 0; margin: 0; border: 0;'
+'                        vertical-align: top; font-family: Arial, sans-serif; font-size: 12px; line-height: normal;'
+'                        color: #000000; font-weight: bold;">'
+'                        <a href="https://www.petco.com.mx/petco/en/Pequenas-Mascotas" target="_blank" style="color: #000000;'
+'                         font-weight: bold; text-decoration: none;"><font style="font-family: Arial, sans-serif;'
+'                          font-size: 12px; color: #000000; font-weight: bold;">pequeñas mascotas</font></a>'
+'                       </th>'
+'                      </tr>'
+'                     </table>'
+'                    </div>'
+'                   </td>'
+'                  </tr>'
+'                 </table>'
+'                </td>'
+'               </tr>'
+'               <tr class="yh gmh">'
+'                <td height="15" class="rh20">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'                <td>'
+'                 <table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#001952">'
+'                  <tr>'
+'                   <td height="10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'                   <td>'
+'                    <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                     <tr>'
+'                      <td height="10">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                      </td>'
+'<!--[ENCABEZADO-TITULO2]-->'
+'                      <td align="center" class="lh h2">'
+'                      </td>'
+'<!--[ENCABEZADO-TITULO2]-->'
+'                      <td height="10">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                      </td>'
+'                     </tr>'
+'                    </table>'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'                   <td height="10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                 </table>'
+'<!--[GRACIAS]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'<!--[GRACIAS-IMAGEN]-->'
+'                <td align="center">'
+'                 <a title="bienvenida" href="https://einfo.petco.com.mx" style="color: #000000;'
+'                  text-decoration: none; font-weight: normal;" target="_blank">'
+'                  <img src="https://citas.petco.com.mx/img/bannerGracias.png" style="display: block;"'
+'                   border="0" class="image vce-image" width="800" alt="bienvenida"></a>'
+'                </td>'
+'<!--[GRACIAS-IMAGEN]-->'
+'               </tr>'
+'<!--[SALUDO]-->'
+'<tr>'
+'<table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'<tr>'
+' <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'  vertical-align: top;" valign="top">'
+'  <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+' </th>'
+' <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'  font-weight: normal; vertical-align: top;">'
+'  <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
+'   <tr>'
+'    <td height="20" class="rh10">'
+'     <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'    </td>'
+'   </tr>'
+'   <tr>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'    <td align="left" class="lh h2">'
+'     <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'      <span style="font-size: 25px;"><strong> Hola, {{contact.1}}. </strong></span>'
+'     </font>'
+'    </td>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'   </tr>'
+'   <tr>'
+'    <td height="4" class="rh10">'
+'     <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="4" style="display: block;">'
+'    </td>'
+'   </tr>'
+'   <tr>'
+'<!--[PEDIDOS-LEYENDA-DESCRIPCION]-->'
+' '+aux+' '
+'<!--[PEDIDOS-LEYENDA-DESCRIPCION]-->'
+'   </tr>'
+'   <tr>'
+'    <td height="20" class="rh10">'
+'     <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'    </td>'
+'   </tr>'
+'  </table>'
+' </th>'
+' <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'  vertical-align: top;" valign="top">'
+'  <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+' </th>'
+'</tr>'
+'</table>'
+'</tr>'
+'<!--[SALUDO-LEYENDA]-->'
+'               <tr>'
+'                <td height="15" class="s4">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'<!--[GRACIAS]--></tr>'
+'                </td>'
+'               </tr>'
+'               <tr>'
+'                <td height="5" class="rh10">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'<!--[ENCABEZADO]-->'
+'<!--[SUBTITLE1]-->'
+'<table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#001952">'
+'    <tr>'
+'     <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'     <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'      font-weight: normal; vertical-align: top;">'
+'      <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw" >'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'        <td align="center" class="lh h2">'
+'            <font class="hl" style="font-family: Arial, sans-serif; font-size: 18px; color: white;'
+'            font-weight: bold;"> '
+'             Detalle de tu compra'
+'            </font>'
+'        </td>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'       </tr>'
+'       <tr>'
+'        <td height="4" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="4" style="display: block;">'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'      </table>'
+'     </th>'
+'     <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'    </tr>'
+'   </table>'
+'<!--[SUBTITLE1]-->'
+'<!--[METODO-PAGO]-->'
+'<table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'    <tr>'
+'     <th width="10" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'     <th align="left" valign="top" class="fl" style="padding: 0; margin: 0;'
+'                    font-weight: normal; vertical-align: top;">'
+'      <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'        <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'                   font-weight: normal; vertical-align: top;">'
+'         <table cellspacing="0" cellpadding="0" border="0" width="380" class="fw">'
+'          <tr>'
+'           <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'            vertical-align: top;" valign="top">'
+'            <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'           </th>'
+'           <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'               font-weight: normal; vertical-align: top;">'
+'            <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
+'             <tr>'
+'              <td height="5" class="rh10">'
+'               <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="5" style="display: block;">'
+'              </td>'
+'             </tr>'
+'             <tr>'
+'              <td align="left" class="lh h2">'
+'               <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                <span style="font-size: 20px;"> <strong> Número de pedido: </strong> </span>'
+'               </font>'
+'              </td>'
+'             </tr>'
+'             <tr>'
+'                <td align="left" class="lh h2">'
+'                 <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                  <span style="font-size: 20px;">'
+'                   '+arregloOrden[0].id+' '
+'                  </span>'
+'                 </font>'
+'                </td>'
+'               </tr>'
+'             <tr>'
+'              <td height="5" class="rh10">'
+'               <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="5" style="display: block;">'
+'              </td>'
+'             </tr>'
+'             <tr>'
+'             </tr>'
+'            </table>'
+'            <br>'
+'            <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
+'                <tr>'
+'                    <td align="left" class="lh h2">'
+'                     <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                      <span style="font-size: 18px;"> <strong> Método de pago: </strong> </span>'
+'                     </font>'
+'                    </td>'
+'                </tr>'
+'                '+auxPago+' '
+'            </table>'
+' <br>'
+'           </th>'
+'           <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'            vertical-align: top;" valign="top">'
+'            <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'           </th>'
+'          </tr>'
+'         </table>'
+'        </th>'
+'        <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'                  font-weight: normal; vertical-align: top;"> '
+'         <table cellspacing="0" cellpadding="0" border="0" width="380" class="fw">'
+'          <tr>'
+'           <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'            vertical-align: top;" valign="top">'
+'            <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'           </th>'
+'           <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'               font-weight: normal; vertical-align: top;">'
+'            <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
+'                <tr>'
+'                    <td align="left" class="lh h2">'
+'                     <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                      <span style="font-size: 20px;"> <strong>  ID Club Petco: </strong> </span>'
+'                     </font>'
+'                    </td>'
+'                </tr>'
+'             <tr>'
+'              <td align="left" class="lh h2">'
+'               <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                <span style="font-size: 20px;">'
+'                 '+arregloOrden[0].idClubPetco+'                '
+'                </span>'
+'               </font>'
+'              </td>'
+'             </tr>'
+'                 <tr>'
+'                    <td align="left" class="lh h2">'
+'                     <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                      <span style="font-size: 20px;"> <strong>  Costo Total: </strong> </span>'
+'                     </font>'
+'                    </td>'
+'                </tr>'
+'             <tr>'
+'              <td align="left" class="lh h2">'
+'               <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                <span style="font-size: 20px;">'
+'                 '+arregloOrden[0].carritoTotal+'                 '
+'                </span>'
+'               </font>'
+'              </td>'
+'             </tr>'
+'            </table>'
+'           </th>'
+'           <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'            vertical-align: top;" valign="top">'
+'            <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'           </th>'
+'          </tr>'
+'         </table>'
+'        </th>'
+'       </tr>'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'      </table>'
+'     </th>'
+'     <th width="10" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'    </tr>'
+'   </table>'
+'<!--[METODO-PAGO]-->'
+'<!--[SUBTITLE2]-->'
+'<table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#001952">'
+'    <tr>'
+'     <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'     <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'      font-weight: normal; vertical-align: top;">'
+'      <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw" >'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'        <td align="center" class="lh h2">'
+'            <font class="hl" style="font-family: Arial, sans-serif; font-size: 18px; color: white;'
+'            font-weight: bold;"> '
+'             El pedido de tu mascota'
+'            </font>'
+'        </td>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'       </tr>'
+'       <tr>'
+'        <td height="4" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="4" style="display: block;">'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'      </table>'
+'     </th>'
+'     <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'    </tr>'
+'   </table>'
+'<!--[SUBTITLE2]-->'
+'<!--[PEDIDOS-LEYENDA]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'                <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'                 vertical-align: top;" valign="top">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                </th>'
+'                <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'                 font-weight: normal; vertical-align: top;">'
+'                 <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
+'                  <tr>'
+'                   <td height="20" class="rh10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'                   <td align="left" class="lh h2">'
+'                    <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'                    '+BoB+' '
+'                    </font>'
+'                   </td>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'                  </tr>'
+'                  <tr>'
+'                   <td height="4" class="rh10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="4" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'<!--[PEDIDOS-LEYENDA-DESCRIPCION]-->'
+'                    '+aux2+' '
+'<!--[PEDIDOS-LEYENDA-DESCRIPCION]-->'
+'                  </tr>'
+'                  <tr>'
+'                   <td height="20" class="rh10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                 </table>'
+'                </th>'
+'                <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'                 vertical-align: top;" valign="top">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                </th>'
+'               </tr>'
+'              </table>'
+'<!--[PEDIDOS-LEYENDA]-->                '
+'<!--[Ordenes]-->'
+'<table cellspacing="0" cellpadding="0" border="0" width="100%">'
+' <tr>'
+'  <th width="10" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'   vertical-align: top;" valign="top">'
+'   <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'  </th>'
+'  <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 1px solid gray;'
+'                 font-weight: normal; vertical-align: top;">'
+'   <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'    <tr>'
+'     <td height="20" class="rh10">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'     </td>'
+'    </tr>'
+'    <tr>'
+'     <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'                font-weight: normal; vertical-align: top;">'
+'      <table cellspacing="0" cellpadding="0" border="0" width="600" class="fw">'
+'       <tr>'
+'        <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'         vertical-align: top;" valign="top">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'        </th>'
+'        <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'            font-weight: normal; vertical-align: top;">'
+'         '+auxProductos+' '
+'        </th>'
+'        <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'         vertical-align: top;" valign="top">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'        </th>'
+'       </tr>'
+'      </table>'
+'     </th>'
+'     <th width="1" bgcolor="#b2b2b2" class="fl sm4" style="padding: 0; margin: 0; border: 0;'
+'      font-weight: normal; vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="1" style="display: block;">'
+'     </th>'
+'     <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'               font-weight: normal; vertical-align: top;"> '
+'      <table cellspacing="0" cellpadding="0" border="0" width="190" class="fw">'
+'       <tr>'
+'        <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'         vertical-align: top;" valign="top">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'        </th>'
+'        <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'            font-weight: normal; vertical-align: top;">'
+'         <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw">'
+'          <tr>'
+'           <td align="left" class="lh h2">'
+'            <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'             <span style="font-size: 14px;">'
+'              <strong> '
+'               Dirección de entrega: '
+'              </strong></span>'
+'            </font>'
+'           </td>'
+'          </tr>'
+'          <tr>'
+'           <td align="left" class="lh h2">'
+'            <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'             <p style="font-size: 14px;">'
+'              <strong> '
+'              '+(arregloOrden[0].tipoEnvio === "BOSS" ? "" : arregloOrden[0].tienda+'.')+' </strong> <br> '
+'              '+arregloOrden[0].datosOrden[0].direccion+' '
+'             </p>'
+'            </font>'
+'           </td>'
+'          </tr>'
+'          <tr>'
+'           <td align="left" class="lh h2">'
+'            <font class="hl1" style="font-family: Arial, sans-serif; font-size: 12px; color: #000000;">'
+'             <p style="font-size: 14px;">'
+'              <a style="text-decoration: underline blue; color: blue" href="'+(arregloOrden[0].url_tienda ? arregloOrden[0].url_tienda : '') +'" target="_blank">'+(arregloOrden[0].tipoEnvio === "BOSS" ? "" : (arregloOrden[0].url_tienda ? 'Ubica tu tienda': ''))+'</a>'
+'               <br>'
+'              <a style="text-decoration: underline blue; color: blue" href="'+(arregloOrden[0].tipoEnvio === 'BOSS' ? (arregloOrden[0].recoleccion ? (arregloOrden[0].recoleccion.fotoRepartidor ? arregloOrden[0].recoleccion.fotoRepartidor : '') : '') : '') +'" target="_blank">'+(arregloOrden[0].tipoEnvio === 'BOSS' ? (arregloOrden[0].recoleccion ? (arregloOrden[0].recoleccion.fotoRepartidor ? 'Ubica tu repartidor' : '') : '') : '')+'</a>'
+'             </p>'
+'            </font>'
+'           </td>'
+'          </tr>'
+'         </table>'
+'        </th>'
+'        <th width="20" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'         vertical-align: top;" valign="top">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'        </th>'
+'       </tr>'
+'      </table>'
+'     </th>'
+'    </tr>'
+'    <tr>'
+'     <td height="20" class="rh10">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'     </td>'
+'    </tr>'
+'   </table>'
+'  </th>'
+'  <th width="10" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'   vertical-align: top;" valign="top">'
+'   <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'  </th>'
+' </tr>'
+'</table>'
+'<!--[BOTON-DETALLE]-->'
+'<table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'    <tr>'
+'     <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'     <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'      font-weight: normal; vertical-align: top;">'
+'      <table cellspacing="0" cellpadding="0" border="0" width="100%" class="fw" >'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'        <td align="center" class="lh h2">'
+'            <font class="hl" style="font-family: Arial, sans-serif; font-size: 18px; color: black;'
+'            font-weight: bold;"> '
+'             Ir a detalle de orden'
+'            </font>'
+'        </td>'
+'<!--[PEDIDOS-LEYENDA-TITULO]-->'
+'       </tr>'
+'       <tr>'
+'        <td align="center" class="lh h2">'
+'          <br>'
+'          <!-- <a href="https://tracking.petco.com.mx/'+arregloOrden[0].correo+'/'+arregloOrden[0].id+'"> <img src="https://citas.petco.com.mx/img/continuar_mailnps.png"> </a> -->'
+'          <a href="https://tracking.petco.com.mx/'+arregloOrden[0].correo+'/'+arregloOrden[0].id+'" style="border: 5px solid #001952; '
+'          padding: 10px; background-color: #001952;  color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-size: 18px;'
+'          text-transform: uppercase; font-weight: bold;"> Continuar </a>'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'        <td height="4" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="4" style="display: block;">'
+'        </td>'
+'       </tr>'
+'       <tr>'
+'        <td height="20" class="rh10">'
+'         <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'        </td>'
+'       </tr>'
+'      </table>'
+'     </th>'
+'     <th width="14" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'      vertical-align: top;" valign="top">'
+'      <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'     </th>'
+'    </tr>'
+'   </table>'
+'   <br>'
+'<!--[BOTON-DETALLE]--></br>'
+'<!--[SUGERENCIAS]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'<!--[SUGERENCIAS-TITULO1]-->'
+'                <td align="center" class="lh h2">'
+'                 <font class="hl2" style="font-family: Arial, sans-serif; font-size: 17px; color: #464648;">'
+'                  <span style="font-size: 20px; color: #808080; font-family: arial, helvetica, sans-serif;">'
+'                  <strong> Recomendados para ti: </strong></span></font>'
+'                </td>'
+'<!--[SUGERENCIAS-TITULO1]-->'
+'               </tr>'
+'               <tr>'
+'                <td height="10">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'                <td align="center">'
+'                 <table border="0" cellspacing="0" cellpadding="0" class="fw">'
+'                  <tr>'
+'                   <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'                    font-weight: normal; vertical-align: top;">'
+'                    <table cellspacing="0" cellpadding="0" border="0" width="186" class="fw sm4">'
+'                     <tr>'
+'<!--[SUGERENCIAS-CELDA1-IMAGEN]-->'
+'                      <td align="center">'
+'                        <a href="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/1.html?eh=$pers_3954$&amp;es=$pers_3955$" target="_blank"><img src="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/1.jpg?eh=$pers_3954$&amp;es=$pers_3955$" width="200" height="260"></a>'
+'                        <!-- <a href="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/xcy87b/1.html?eh=$pers_3954$&amp;es=$pers_3955$" target="_blank"><img src="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/xcy87b/1.jpg?eh=$pers_3954$&amp;es=$pers_3955$" width="220" height="280" class="img-widget"></a> -->'
+'                      </td>'
+'<!--[SUGERENCIAS-CELDA1-IMAGEN]-->'
+'                     </tr>'
+'                     <tr>'
+'                      <td align="center">'
+'                       <table cellpadding="0" cellspacing="0" border="0" bgcolor="#001952" style="border-radius: 3px;"'
+'                        class="">'
+'                        <tr>'
+'                         <td>'
+'                          <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                           <tr class="mh">'
+'                            <td>'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="125" height="1" style="display: block;">'
+'                            </td>'
+'                           </tr>'
+'                           <tr>'
+'<!--[SUGERENCIAS-CELDA1-BOTON]-->'
+'                            <td align="center" style="font-family: Arial, sans-serif; line-height: normal; font-size: 16px;'
+'                             color: #ffffff; padding: 5px 20px !important;" class="olcta4td cta">'
+'                             <a href="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/1.html?eh=$pers_3954$&amp;es=$pers_3955$"'
+'                              target="_blank" style="color: #ffffff; font-weight: normal; text-decoration: none;'
+'                              display: block;" title=""><font style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;'
+'                               color: #ffffff;">Comprar Ahora</font>'
+'                             </a>'
+'                            </td>'
+'<!--[SUGERENCIAS-CELDA1-BOTON]-->'
+'                           </tr>'
+'                           <tr class="mh">'
+'                            <td>'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="1" style="display: block;">'
+'                            </td>'
+'                           </tr>'
+'                          </table>'
+'                         </td>'
+'                        </tr>'
+'                       </table>'
+'                      </td>'
+'                     </tr>'
+'                    </table>'
+'                   </th>'
+'                   <th width="21" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'                    vertical-align: top;" valign="top">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="21" height="1" style="display: block;">'
+'                   </th>'
+'                   <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'                    font-weight: normal; vertical-align: top;">'
+'                    <table cellspacing="0" cellpadding="0" border="0" width="186" class="fw sm4">'
+'                     <tr>'
+'<!--[SUGERENCIAS-CELDA2-IMAGEN]-->'
+'                      <td align="center">'
+'                        <a href="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/2.html?eh=$pers_3954$&amp;es=$pers_3955$" target="_blank"><img src="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/2.jpg?eh=$pers_3954$&amp;es=$pers_3955$" width="200" height="260"></a>                      </td>'
+'<!--[SUGERENCIAS-CELDA2-IMAGEN]-->'
+'                     </tr>'
+'                     <tr>'
+'                      <td align="center">'
+'                       <table cellpadding="0" cellspacing="0" border="0" bgcolor="#001952" style="border-radius: 3px;"'
+'                        class="">'
+'                        <tr>'
+'                         <td>'
+'                          <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                           <tr class="mh">'
+'                            <td>'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="125" height="1" style="display: block;">'
+'                            </td>'
+'                           </tr>'
+'                           <tr>'
+'<!--[SUGERENCIAS-CELDA2-BOTON]-->'
+'                            <td align="center" style="font-family: Arial, sans-serif; line-height: normal; font-size: 16px;'
+'                             color: #ffffff; padding: 5px 20px !important;" class="olcta4td cta">'
+'                             <a href="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/2.html?eh=$pers_3954$&amp;es=$pers_3955$"'
+'                              target="_blank" style="color: #ffffff; font-weight: normal; text-decoration: none;'
+'                              display: block;" title=""><font style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;'
+'                               color: #ffffff;">Comprar Ahora</font></a>'
+'                            </td>'
+'<!--[SUGERENCIAS-CELDA2-BOTON]-->'
+'                           </tr>'
+'                           <tr class="mh">'
+'                            <td>'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="1" style="display: block;">'
+'                            </td>'
+'                           </tr>'
+'                          </table>'
+'                         </td>'
+'                        </tr>'
+'                       </table>'
+'                      </td>'
+'                     </tr>'
+'                    </table>'
+'                   </th>'
+'                   <th width="21" class="mh" style="padding: 0; margin: 0; border: 0; font-weight: normal;'
+'                    vertical-align: top;" valign="top">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="21" height="1" style="display: block;">'
+'                   </th>'
+'                   <th align="left" valign="top" class="fl" style="padding: 0; margin: 0; border: 0;'
+'                    font-weight: normal; vertical-align: top;">'
+'                    <table cellspacing="0" cellpadding="0" border="0" width="186" class="fw sm4">'
+'                     <tr>'
+'<!--[SUGERENCIAS-CELDA3-IMAGEN]-->'
+'                      <td align="center">'
+'                        <a href="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/3.html?eh=$pers_3954$&amp;es=$pers_3955$" target="_blank"><img src="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/3.jpg?eh=$pers_3954$&amp;es=$pers_3955$" width="200" height="260"></a>                      </td>'
+'<!--[SUGERENCIAS-CELDA3-IMAGEN]-->'
+'                     </tr>'
+'                     <tr>'
+'                      <td align="center">'
+'                       <table cellpadding="0" cellspacing="0" border="0" bgcolor="#001952" style="border-radius: 3px;"'
+'                        class="">'
+'                        <tr>'
+'                         <td>'
+'                          <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                           <tr class="mh">'
+'                            <td>'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="125" height="1" style="display: block;">'
+'                            </td>'
+'                           </tr>'
+'                           <tr>'
+'<!--[SUGERENCIAS-CELDA3-BOTON]-->'
+'                            <td align="center" style="font-family: Arial, sans-serif; line-height: normal; font-size: 16px;'
+'                             color: #ffffff; padding: 5px 20px !important;" class="olcta4td cta">'
+'                             <a href="http://einfo.petco.com.mx/predict/recommender/16EB3754BA3F6B5B/arcccr/3.html?eh=$pers_3954$&amp;es=$pers_3955$"'
+'                              target="_blank" style="color: #ffffff; font-weight: normal; text-decoration: none;'
+'                              display: block;" title=""><font style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;'
+'                               color: #ffffff;">Comprar Ahora</font></a>'
+'                            </td>'
+'<!--[SUGERENCIAS-CELDA3-BOTON]-->'
+'                           </tr>'
+'                           <tr class="mh">'
+'                            <td>'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="1" style="display: block;">'
+'                            </td>'
+'                           </tr>'
+'                          </table>'
+'                         </td>'
+'                        </tr>'
+'                       </table>'
+'                      </td>'
+'                     </tr>'
+'                    </table>'
+'                   </th>'
+'                  </tr>'
+'                 </table>'
+'                </td>'
+'               </tr>'
+'               <tr class="mh">'
+'                <td height="15" class="s4">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="25" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'<!--[SUGERENCIAS]-->'
+'<!--[GROOMING]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'<!--[GROOMING-IMAGEN]-->'
+'                <td align="center">'
+'                 <a title="bienvenida" href="https://citas.petco.com.mx" style="color: #000000;'
+'                  text-decoration: none; font-weight: normal;" target="_blank">'
+'                  <img src="https://einfo.petco.com.mx/custloads/765664703/md_864629.jpg" style="display: block;"'
+'                   border="0" class="image vce-image" alt="bienvenida"></a>'
+'                </td>'
+'<!--[GROOMING-IMAGEN]-->'
+'               </tr>'
+'               <tr>'
+'                <td height="15" class="s4">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'<!--[GROOMING]-->'
+'<!--[AVISO]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'<!--[AVISO-IMAGEN]-->'
+'                <td align="center">'
+'                 <a title="bienvenida" href="https://petco.com.mx" style="color: #000000;'
+'                  text-decoration: none; font-weight: normal;" target="_blank">'
+'                  <img src="https://citas.petco.com.mx/img/bannerSeguimosAbiertos_1.png" style="display: block;"'
+'                   border="0" class="image vce-image" alt="bienvenida"></a>'
+'                </td>'
+'<!--[AVISO-IMAGEN]-->'
+'               </tr>'
+'               <tr>'
+'                <td height="15" class="s4">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'<!--[AVISO]-->'
+'<!--[FORMAS PAGO]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr>'
+'<!--[FORMAS PAGO-IMAGEN]-->'
+'                <td align="center">'
+'                 <a title="bienvenida" href="https://petco.com.mx" style="color: #000000;'
+'                  text-decoration: none; font-weight: normal;" target="_blank">'
+'                  <img src="https://citas.petco.com.mx/img/bannerRecogerTienda.png" style="display: block;"'
+'                   border="0" class="image vce-image" alt="bienvenida"></a>'
+'                </td>'
+'<!--[FORMAS PAGO-IMAGEN]-->'
+'               </tr>'
+'               <tr>'
+'                <td height="15" class="s4">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                </td>'
+'               </tr>'
+'              </table>'
+'<!--[FORMAS PAGO]-->'
+'<!--[PIE_PAG]-->'
+'              <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'               <tr class="mh">'
+'                <td height="15" class="s4">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                </td>'
+'               </tr>'
+'               <tr>'
+'                <td>'
+'                 <table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#e3e4e5">'
+'                  <tr>'
+'                   <td height="10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'                   <td>'
+'                    <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                     <tr>'
+'                      <td width="20" class="rw10">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'                      </td>'
+'                      <td>'
+'                       <table cellspacing="0" cellpadding="0" border="0" width="100%">'
+'                        <tr>'
+'<!--[PIEPAG-TITULO1]-->'
+'                         <td align="center" class="lh xsmall">'
+'                          <font class="hl3" style="font-family: Arial, sans-serif; font-size: 10px; color: #87888a;'
+'                           font-weight: bold;"> Petco México </font>'
+'                         </td>'
+'<!--[PIEPAG-TITULO1]-->'
+'                        </tr>'
+'                        <tr>'
+'                         <td height="15" class="rh10">'
+'                          <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'<!--[PIEPAG-DISCLAIMER]-->'
+'                         <td align="left" class="lh xsmall">'
+'                          <font class="ft" style="font-family: Arial, sans-serif; color: #87888a; font-size: 10px;">'
+'                           <span> Consulta tu tienda más cercana. Las fotografías utilizadas en este correo son solo con fines ilustrativos, pueden variar con respecto a los productos de la tienda. Venta al menudeo. Consulta condiciones en piso de venta. Queda exceptuada la devolución de los productos que incluyan regalos en caso de no devolver todos los productos adquiridos. Promociones válidas solo en tiendas Petco que cuenten con esta mercancía. Todas las promociones son sólo con Club Petco. La afiliación es gratuita. Los departamentos pueden variar por tienda. Todas las mascotas son bienvenidas. Válido solo en México. </span></font>'
+'                         </td>'
+'<!--[PIEPAG-DISCLAIMER]-->'
+'                        </tr>'
+'                        <tr>'
+'                         <td height="15" class="rh10">'
+'                          <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'                         <td align="center" class="lh xsmall">'
+'                          <font class="ft" style="font-family: Arial, sans-serif; color: #87888a; font-size: 10px;">'
+'                           <a href="https://www.petco.com.mx/AvisoPrivacidad" target="_blank" style="color: #87888a;'
+'                            font-weight: bold; text-decoration: normal;">Políticas de Privacidad</a></font>'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'                         <td height="15" class="rh20">'
+'                          <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="15" style="display: block;">'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'                         <td align="center" class="lh xsmall">'
+'                          <font class="hl3" style="font-family: Arial, sans-serif; font-size: 10px; color: #87888a;'
+'                           font-weight: bold;">Síguenos en:</font>'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'                         <td height="10">'
+'                          <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="10" style="display: block;">'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'                         <td align="center">'
+'                          <table cellspacing="0" cellpadding="0" border="0">'
+'                           <tr>'
+'                            <td valign="middle" style="vertical-align: middle;">'
+'                             <a href="https://www.facebook.com/Petco.Mexico" target="_blank" style="color: #000000;'
+'                              text-decoration: none; font-weight: normal;">'
+'                              <img src="http://einfo.petco.com.mx/custloads/765664703/NL-042017ES/fb.png" border="0"'
+'                               style="display: block;" class="vce-image"></a>'
+'                            </td>'
+'                            <td width="10">'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                            </td>'
+'                            <td valign="middle" style="vertical-align: middle;">'
+'                             <a href="https://twitter.com/petcomexico " target="_blank" style="color: #000000;'
+'                              text-decoration: none; font-weight: normal;">'
+'                              <img src="http://einfo.petco.com.mx/custloads/765664703/NL-042017ES/twr.png" border="0"'
+'                               style="display: block;" class="vce-image"></a>'
+'                            </td>'
+'                            <td width="10">'
+'                             <img src="https://suite16.emarsys.net/img/trans.gif" width="10" height="1" style="display: block;">'
+'                            </td>'
+'                            <td valign="middle" style="vertical-align: middle;">'
+'                             <a href="https://www.instagram.com/petcomexico/" target="_blank" style="color: #000000;'
+'                              text-decoration: none; font-weight: normal;">'
+'                              <img src="http://einfo.petco.com.mx/custloads/765664703/NL-042017ES/inst.png" border="0"'
+'                               style="display: block;" class="vce-image"></a>'
+'                            </td>'
+'                           </tr>'
+'                          </table>'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'                         <td height="20">'
+'                          <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                         </td>'
+'                        </tr>'
+'                        <tr>'
+'                         <td align="center" class="un xsmall" style="font-family: Arial, sans-serif; color: #87888a;'
+'                          line-height: normal; font-size: 10px;">'
+'                          <font style="font-family: Arial, sans-serif; color: #87888a; font-size: 10px;"><a'
+'                           href="#UNSUBSCRIBE_HREF#" ems:notrack="true" target="_blank" style="color: #00aae7;'
+'                           font-weight: bold; text-decoration: normal;">Borrar suscripción</a></font>'
+'                         </td>'
+'                        </tr>'
+'                       </table>'
+'                      </td>'
+'                      <td width="20" class="rw10">'
+'                       <img src="https://suite16.emarsys.net/img/trans.gif" width="20" height="1" style="display: block;">'
+'                      </td>'
+'                     </tr>'
+'                    </table>'
+'                   </td>'
+'                  </tr>'
+'                  <tr>'
+'                   <td height="20" class="rh10">'
+'                    <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                   </td>'
+'                  </tr>'
+'                 </table>'
+'                </td>'
+'               </tr>'
+'               <tr>'
+'                <td height="20" class="rh10">'
+'                 <img src="https://suite16.emarsys.net/img/trans.gif" width="1" height="20" style="display: block;">'
+'                </td>'
+'               </tr>'
+'               <tr>'
+'                <td align="center">'
+'                 <p style="font-size: 70%; font-family: Arial, sans-serif;"> '
+'                  Aviso de privacidad '
+'                 </p>         '
+'                 <p style="font-size: 70%; font-family: Arial, sans-serif;"> '
+'                  Petco México. Todos los derechos reservados. '
+'                  <br style="font-size: 70%;"> '
+'                  *Por favor no respondas este correo. Esta dirección de correo es exclusivamente para envío de mensajes.              '
+'                 </p>    '
+'                </td>'
+'               </tr>'
+'              </table>'
+'<!--[PIE_PAG]-->'
+'<!--[BODY-FOOTER]-->'
+'             </td>'
+'            </tr>'
+'           </table>'
+'          </td>'
+'          <td width="25" class="rw5">'
+'          </td>'
+'         </tr>'
+'        </table>'
+'       </td>'
+'      </tr>'
+'      <tr>'
+'       <td height="20">'
+'        <br>'
+'       </td>'
+'      </tr>'
+'     </table>'
+'    </td>'
+'   </tr>'
+'  </table>'
+' </div>'
+'</body>'
+'</html>'
+'<!--[BODY-FOOTER]-->'
                 


  const datos = {
    "name": tipo + ' ' + arregloOrden[0].id+' ' + Date.today().setTimeToNow().addHours(-1).toString("yyyy-MM-dd HH:mm:ss"),
    "content_type": "block",
    "language": "es",
    "fromemail": "prompet@emark.petco.com.mx",
    "fromname": "Petco México",
    "subject": "&#x1F381; ¡"+arregloOrden[0].status_envio+"! &#x1F381;" ,
    "email_category": "0",
    "contactlist": contactListId, // 112105874 otra lista ficticia
    "html_source": htmlToSend,
    "text_source": "",
    "exclude_filter": "442723",
    // "cc_list": "424972371",
    "keep_raw_html": 0,
    "keep_raw_text": 1,
    "unsubscribe": 0,
    "browse": 0,
    "text_only": 0
  }
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/email', datos, {
      headers: {
        'X-WSSE': generateHeader()
      }
    })
    .then((respuesta) => {
      let correoId = respuesta.data.data.id;
      idCorreo = respuesta.data.data.id;
      let datosAEnviar = {
        section: '1',
        url: 'https://tracking.petco.com.mx/'+arregloOrden[0].correo+'/'+arregloOrden[0].id // aqui va la url de seguimiento de la orden
      };
      axios.post(BASE_URL + '/email/' + correoId + '/trackedlinks', datosAEnviar, {
        headers: {
          'X-WSSE': generateHeader()
        }
      })
      .then((respuest) => {
        console.log({respuestas:respuest.data,replyText: respuest.data.replyText, idCorreo: idCorreo})
        // resolve({replyText: respuest.data.replyText, idCorreo: idCorreo})
        let fechaEnvio = '';
        const data = {
          "emailId": correoId,
          "schedule": fechaEnvio,
          "timezone": "America/Mexico_City",
          "features": []
        };
        console.log('Orden '+arregloOrden[0].id+' : '+Date.today().toString("yyyyMMdd")+' : '+ correoId)
        axios.post(BASE_URL + '/email/' + correoId + '/launch',data, {
          headers: {
            'X-WSSE': generateHeader()
          }
        })
        .then((resp) => {
          console.log('Enviado: '+JSON.stringify(resp.data))
          resp.data.idCorreo = idCorreo;
          resolve(resp.data);
        })
        .catch((err) => {
          console.log(err)
          process.exit()
        });
                
      })
      .catch((er) => {
        console.log(er)
        process.exit()
      });      
    })
    .catch((error) => {
      console.log(error)
      process.exit()
    });
  });
}


const prueba = {
  "17166582": [
    {
      "id": "17166582",
      "carrito": "1716658201",
      "datosOrden": [
          {
              "nombre_marca": "Instinct",
              "numero_marca": "117675",
              "descripcion_marca": "Instinct Libre de Granos Alimento Húmedo para Perro Todas las Edades Receta Res, 374 g",
              "cantidad_producto": 4,
              "direccion": "Paseo de los Tamarindos , 17, 201, BOSQUES DE LAS LOMAS,, Ciudad de México, Cuajimalpa, 05120",
              "telefono": "5552812984",
              "tiempo_promesa": "CDMX y Área metropolitana es de 3 a 5 días hábiles. Guadalajara y Monterrey de 3 a 7 días hábiles, y para el resto de la República Mexicana hasta 15 días hábiles",
              "url_imagen": "https://www.petco.com.mx/petcowebservices/v2/medias/?context=bWFzdGVyfGltYWdlc3wyMDYxOTN8aW1hZ2UvanBlZ3xpbWFnZXMvaDY1L2gxZC85NDI4OTA3NTg5NjYyLmpwZ3xhNDk1ZTJmYzhmM2QyMmYxN2IwM2E0ZTllMjE5NjJhODJlYWEzYzFjNmQxZmY4YmJjMWViOTZhN2M0YTE1YmE3",
              "url_producto": "https://www.petco.com.mx/MARCAS/Instinct/Instinct-Libre-de-Granos-Alimento-H%C3%BAmedo-para-Perro-Todas-las-Edades-Receta-Res%2C-156-g/p/117675",
              "precio_producto": "$74.25"
          },
          {
              "nombre_marca": "Instinct",
              "numero_marca": "117673",
              "descripcion_marca": "Instinct Libre de Granos Alimento Húmedo para Perro Todas las Edades Receta Pollo, 374 g",
              "cantidad_producto": 1,
              "direccion": "Paseo de los Tamarindos , 17, 201, BOSQUES DE LAS LOMAS,, Ciudad de México, Cuajimalpa, 05120",
              "telefono": "5552812984",
              "tiempo_promesa": "CDMX y Área metropolitana es de 3 a 5 días hábiles. Guadalajara y Monterrey de 3 a 7 días hábiles, y para el resto de la República Mexicana hasta 15 días hábiles",
              "url_imagen": "https://www.petco.com.mx/petcowebservices/v2/medias/?context=bWFzdGVyfGltYWdlc3wxODY1NDR8aW1hZ2UvanBlZ3xpbWFnZXMvaGM5L2hlMy85NDI4OTA0OTAyNjg2LmpwZ3xiNDdhMGM5MWQyYThkMjJiYmM2NDFiZjEzMjhhNGVkYmI0Mzg1NjQ5NWNhOTMyOGM1YTIzNjM0NWFlODM1YTZm",
              "url_producto": "https://www.petco.com.mx/MARCAS/Instinct/Instinct-Libre-de-Granos-Alimento-H%C3%BAmedo-para-Perro-Todas-las-Edades-Receta-Pollo%2C-156-g/p/117673",
              "precio_producto": "$74.25"
          }
      ],
      "carritoTotal": "$668.25",
      "idEmarsys": "78835346",
      "correo":"horaciorojas737@gmail.com",
      "tipoEnvio":"1",
      "idClubPetco": "000002920014079169",
      "tiempoPromesa": Date.today().addDays(3).toString('dd/MM/yyyy') + ' - ' + Date.today().addDays(5).toString('dd/MM/yyyy')
    },
    {
      "id": "17166582",
      "carrito": "1716658202",
      "datosOrden": [
          {
              "nombre_marca": "Instinct",
              "numero_marca": "117679",
              "descripcion_marca": "Instinct LID Libre de Granos Alimento Húmedo para Perro Adulto Receta Pavo, 374 g",
              "cantidad_producto": 4,
              "direccion": "Paseo de los Tamarindos , 17, 201, BOSQUES DE LAS LOMAS,, Ciudad de México, Cuajimalpa, 05120",
              "telefono": "5552812984",
              "tiempo_promesa": "CDMX y Área metropolitana es de 3 a 5 días hábiles. Guadalajara y Monterrey de 3 a 7 días hábiles, y para el resto de la República Mexicana hasta 15 días hábiles",
              "url_imagen": "https://www.petco.com.mx/petcowebservices/v2/medias/?context=bWFzdGVyfGltYWdlc3wxNjAyNDF8aW1hZ2UvanBlZ3xpbWFnZXMvaDkyL2g0Yi85NDI4OTA4OTY1OTE4LmpwZ3w4Y2Y2MmI3ODY1YzMxYjM4NWJkMjM2MjUyMWQ0MGVkNTM5ZTMyZDU2MmFmN2NmNzMyZjk2OTUwZGMxYTEwNjRk",
              "url_producto": "https://www.petco.com.mx/MARCAS/Instinct/Instinct-Alimento-Para-Perro-LID-Pavo/p/117679",
              "precio_producto": "$74.25"
          }
      ],
      "carritoTotal": "$668.25",
      "idEmarsys": "78835346",
      "correo":"horaciorojas737@gmail.com",
      "tipoEnvio":"1",
      "idClubPetco": "000002920014079169",
      "tiempoPromesa": Date.today().addDays(1).toString('dd/MM/yyyy')
    }
  ],
  "17165689": [
    {
        "id": "17165689",
        "carrito": "1716568901",
        "datosOrden": [
            {
                "nombre_marca": "Cunipic",
                "numero_marca": "114767",
                "descripcion_marca": "Cunipic Heno  Diente De León  500 grs",
                "cantidad_producto": 1,
                "direccion": "RETORNO DE CORREGGIO, 20, 205, SAN JUAN, Ciudad de México, CIUDAD DE MEXICO, 03730",
                "telefono": "5519571816",
                "url_imagen": "https://www.petco.com.mx/petcowebservices/v2/medias/?context=bWFzdGVyfGltYWdlc3w3MTYyM3xpbWFnZS9qcGVnfGltYWdlcy9oNzQvaGUyLzk0NDU4NjI2NzAzNjYuanBnfDc4MjFiY2M5ODk1NGY2MDNmOGU4Yzk5MmZiY2M2OGI0NDFjM2Q5NDUxMzRjYzMyYjk0M2FjYmY3ODFjMzkzZDg",
                "url_producto": "https://www.petco.com.mx/MARCAS/Cunipic/Cunipic-Heno/p/114767",
                "precio_producto": "$148.00"
            }
        ],
        "carritoTotal": "$360.50",
        "idEmarsys": "78835875",
        "correo":"horaciorojas737@gmail.com",
        "tipoEnvio":"1",
        "idClubPetco": "000002920014079145",
        "tiempoPromesa": Date.today().addDays(1).toString('dd/MM/yyyy')
    },
    {
        "id": "17165689",
        "carrito": "1716568903",
        "datosOrden": [
            {
                "nombre_marca": "Good 2 Go",
                "numero_marca": "113523",
                "descripcion_marca": "Good 2 Go Collar De Nylon Ajustable Rosa - Pedreria  20-30 cm",
                "cantidad_producto": 1,
                "direccion": "RETORNO DE CORREGGIO, 20, 205, SAN JUAN, Ciudad de México, CIUDAD DE MEXICO, 03730",
                "telefono": "5519571816",
                "url_imagen": "https://www.petco.com.mx/petcowebservices/v2/medias/?context=bWFzdGVyfGltYWdlc3w1MzI3MXxpbWFnZS9naWZ8aW1hZ2VzL2g3Yy9oMzUvODg0ODgxMjA0ODQxNC5naWZ8ZTRiOWI2ZTU2Mzc1MTE1ZjRhZGRjOTZiN2VkOGY5NGU0ZjdkM2ZhNDEwZjlmOWM4NjJkNzBkN2RjYzBjZjFmZQ",
                "url_producto": "https://www.petco.com.mx/MARCAS/Good2Go/Good-2-Go-Collar-De-Nylon-Ajustable/p/113523",
                "precio_producto": "$72.50"
            }
        ],
        "carritoTotal": "$360.50",
        "idEmarsys": "78835875",
        "correo":"horaciorojas737@gmail.com",
        "tipoEnvio":"1",
        "idClubPetco": "000002920014079145",
        "tiempoPromesa": Date.today().addDays(3).toString('dd/MM/yyyy') + ' - ' + Date.today().addDays(5).toString('dd/MM/yyyy')
    }
  ]
}

function generateBodyTriggerEmarsys(arregloOrden){
  console.log(JSON.stringify(arregloOrden[0]))
  var hora
  var minutos
  if(arregloOrden[0].uber_dropoff_eta){
    var fechaObj = new Date(arregloOrden[0].uber_dropoff_eta) 
    hora = fechaObj.toLocaleString('es-MX', { hour: 'numeric', hour12: false });
    minutos = fechaObj.getUTCMinutes();
  }
  return {
    nombre: arregloOrden[0].nombre_cliente ? arregloOrden[0].nombre_cliente.split(' ')[0] : arregloOrden[0].nombreCliente,
    splitTxt: arregloOrden[0].splitTxt,
    totalSplits: arregloOrden[0].cantidad_splits,
    statusEnvio: arregloOrden[0].status_envio,
    tipoEnvio: arregloOrden[0].tipoEnvio,
    statusId: arregloOrden[0].status_id,
    id: arregloOrden[0].id ? arregloOrden[0].id : '',
    tienda: arregloOrden[0].tienda,
    banco: arregloOrden[0].metodoPago.banco ? arregloOrden[0].metodoPago.banco : '',
    pago: arregloOrden[0].metodoPago.pago ? arregloOrden[0].metodoPago.pago : '',
    cardNumber: arregloOrden[0].metodoPago.cardNumber ? arregloOrden[0].metodoPago.cardNumber : '',
    nombreTarjeta: arregloOrden[0].metodoPago.nombreTarjeta ? f.capitalizeString(arregloOrden[0].metodoPago.nombreTarjeta) : '',
    cardType: arregloOrden[0].metodoPago.cardType ? arregloOrden[0].metodoPago.cardType : '',
    expiration: arregloOrden[0].metodoPago.expiration ? arregloOrden[0].metodoPago.expiration : '',
    idClubPetco: arregloOrden[0].idClubPetco,
    carritoTotal: arregloOrden[0].carritoTotal,
    split: arregloOrden[0].carrito.slice(-1),
    datosOrden: arregloOrden[0].datosOrden.map(obj => ({
      "descripcion_marca": obj.descripcion_marca,
      "urlImagen": obj.url_imagen,
      "numeroMarca": obj.numero_marca,
      "cantidadProducto": obj.cantidad_producto,
      "precioProducto": obj.precio_producto,
    })),
    direccion: arregloOrden[0].datosOrden[0].direccion,
    urlTienda: arregloOrden[0].url_tienda,
    paquetera:arregloOrden[0].paquetera,
    fotoRepartidor: arregloOrden[0].recoleccion ? 
    (arregloOrden[0].recoleccion.fotoRepartidor ? arregloOrden[0].recoleccion.fotoRepartidor : '') : '',
    correo: arregloOrden[0].correo,
    codigo: (arregloOrden[0].tokenOrden !== null && arregloOrden[0].tokenOrden !== undefined && arregloOrden[0].tokenOrden !== '') ? arregloOrden[0].tokenOrden : '',
    codigoConfirmacion: arregloOrden[0].pincode ? arregloOrden[0].pincode : "",
    codigoConfirmacionArr: arregloOrden[0].pincode ? arregloOrden[0].pincode.split('') : "",
    telefono:  arregloOrden[0].telefono ?  `(${arregloOrden[0].telefono.slice(0, 2)}) ${arregloOrden[0].telefono.slice(2, 6)}-${arregloOrden[0].telefono.slice(6)}` : "",
    created_at: arregloOrden[0].created_at ? arregloOrden[0].created_at : "",
    tipo_orden: arregloOrden[0].tipo_orden ? arregloOrden[0].tipo_orden : "",
    total: arregloOrden[0].total ? arregloOrden[0].total : "",
    totalDesc: arregloOrden[0].totalDesc ? arregloOrden[0].totalDesc : "",
    totalEnv: arregloOrden[0].totalEnv != '$0.00' ? arregloOrden[0].totalEnv : "GRATIS",
    porcen: arregloOrden[0].easyBuy && arregloOrden[0].easyBuy != 0 ? Math.floor((( arregloOrden[0].easyBuy/arregloOrden[0].totalSinDesc.replace('$', ''))*100))+'%' : '0%',
    descEasybuy: '$'+arregloOrden[0].easyBuy,
    totalSinDesc: arregloOrden[0].totalSinDesc,
    methodPay: arregloOrden[0].methodPay,
    card: arregloOrden[0].card,
    cardName: arregloOrden[0].cardName,
    url: arregloOrden[0].url,
    tokenBOPUS: arregloOrden[0].tokenBOPUS,
    uber_dropoff_hours: hora,
    uber_dropoff_minutes: minutos 

  }
}

function sendExternalEventEmarsys(bodyRequest, pais){
  return new Promise(resolve => {
    let externalEventId = 0
    let urlEmarsys = ''
    const key = 3

    let correoToSend = bodyRequest.correo

    let bodyActivateEmarsys = {}
    if(pais===config.MX) {
      //externalEventId = 11832//11401
      //if(bodyRequest.paquetera == 'Uber' && bodyRequest.codigoConfirmacion && bodyRequest.statusId=='A2' && bodyRequest.tipoEnvio == "BOSS" ){
      //  externalEventId= 14109;
      //}
      if(bodyRequest.paquetera == 'Uber' && bodyRequest.codigoConfirmacion && bodyRequest.statusId=='A2' && bodyRequest.tipoEnvio == "BOSS"){//para confirmar que ya mero llega
        externalEventId = 14477
      }else if(bodyRequest.statusId=='63' && bodyRequest.tipoEnvio == "BOSS"){
        externalEventId = 14463
      }else if(bodyRequest.statusId=='84' && bodyRequest.tipoEnvio == "BOSS"){
        externalEventId = 15939
      }else if(bodyRequest.statusId=='A2' && bodyRequest.tipoEnvio == "BOSS"){
        externalEventId = 14466
      }else if(bodyRequest.statusId=='90' && bodyRequest.tipoEnvio == "BOSS"){
        externalEventId = 14467
      }else if(bodyRequest.statusId=='A3' && bodyRequest.tipoEnvio == "BOSS"){
        externalEventId = 14468
      }else if(bodyRequest.statusId=='A4' && bodyRequest.tipoEnvio == "BOSS"){
        externalEventId = 14476
      }
      //else if(bodyRequest.statusId=='83' && bodyRequest.tipoEnvio == "BOPUS"){
      //  //confimracion bopus 14478 ?
      //  externalEventId = 14478
      //}
      else if(bodyRequest.statusId=='78' && bodyRequest.tipoEnvio == "BOPUS"){
        externalEventId = 14478
      }else if(bodyRequest.statusId=='83' && bodyRequest.tipoEnvio == "BOPUS"){
        //trabajando pedido 14479
        externalEventId = 14479
      }else if(bodyRequest.statusId=='84' && bodyRequest.tipoEnvio == "BOPUS"){
        //tu pedido esta listo 14480
        // externalEventId = 15940
        externalEventId = 14480
      }else if(bodyRequest.statusId=='91' && bodyRequest.tipoEnvio == "BOPUS"){
          //pedido entregado 14481
        externalEventId = 14481
      }

      console.log(bodyRequest.datosOrden[0])

      bodyActivateEmarsys = {
        key_id: key,
        external_id: correoToSend,
        data: bodyRequest
      }
      urlEmarsys = `${BASE_URL}/event/${externalEventId.toString()}/trigger`
    } else {
      if(bodyRequest.tipoEnvio == "E-COMMERCE" || bodyRequest.tipoEnvio == "BOSS")
        {
          if(bodyRequest.statusId=='63'){
            externalEventId =5850  /* (PED)Confirmacion de Orden Normal BOSS 	5850 */
          }else if(bodyRequest.statusId=='84'){
            externalEventId =5851  /* (PED) Preperando pedido BOSS	5851 */
          }else if(bodyRequest.statusId=='A2'){
            externalEventId =5852  /* (PED) Guia pedido BOSS	5852 */
          }else if(bodyRequest.statusId=='90'){
            externalEventId =5853  /* (PED) en camino BOSS	5853 */
          }else if(bodyRequest.statusId=='A3'){
            externalEventId =5855  /* (PED) Entregado  BOSS	5855 */
          }else if(bodyRequest.statusId=='A4'){
            externalEventId =5854  /* (PED) devuelto  BOSS	5854 */
          }

          console.log(bodyRequest.datosOrden[0])

          bodyActivateEmarsys = {
            key_id: key,
            external_id: correoToSend,
            data: bodyRequest
          }
          urlEmarsys = `${BASE_URL}/event/${externalEventId.toString()}/trigger`

          // externalEventId = 148925
          // bodyActivateEmarsys = {
          //                         email: correoToSend,
          //                         data: { global: bodyRequest }
          //                       }
        
          // urlEmarsys = `${BASE_URL}/email/${externalEventId.toString()}/broadcast` 
      }
        else if (bodyRequest.tipoEnvio == "BOPUS")
        {
          if(bodyRequest.statusId=='78'){
            //PEDConfirmaciondeordenNormal
            externalEventId = 5302
          } else if(bodyRequest.statusId=='83' ){
            //PEDConfirmacionOrdenBopusSalida
            externalEventId = 5306 
          } else if(bodyRequest.statusId=='84' ){
            //PEDConfirmacionOrdenBopusRecogerPedido
            externalEventId = 5307
          } else if(bodyRequest.statusId=='91' ){
            //PEDConfirmacionOrdenBopusEntregado
            externalEventId = 5308
          }
  
          console.log(bodyRequest.datosOrden[0])
  
          bodyActivateEmarsys = {
            key_id: key,
            external_id: correoToSend,
            data: bodyRequest
          }
          urlEmarsys = `${BASE_URL}/event/${externalEventId.toString()}/trigger`
  
        }
    }
     console.log(urlEmarsys)
     console.log(JSON.stringify(bodyActivateEmarsys))
    axios.post(urlEmarsys, bodyActivateEmarsys,{
      headers: {
        'X-WSSE': generateHeader(pais)
      } 
    })
    .then(response => {
      let respuesta = response.data
      resolve(respuesta)
    })
    .catch(err => {
      console.log(err)
      resolve({replyCode:'2008', replyText:'Error al enviar', data:{}})
    })
  })
}

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

let idOrden = myArgs[0]

async function iniciarOrdenes(pedidos) {

  let ordenes = await getOrders(pedidos);
  console.log("\nContinue!")
  console.log("a procesar",ordenes.length)
  let res = null
  wFileLog("inita")
  for (const orden of Object.keys(ordenes)) {
    if (ordenes[orden].length > 0) {
        if (config.tiendasProd.includes(ordenes[orden][0].tienda_id)) {
        //  if(true){
          let pais = /^7/.test(ordenes[orden][0].tienda_id) === true ? config.MX : config.CL
          console.log(pais)
          // console.log(ordenes[orden])
          let bodyTrigger = generateBodyTriggerEmarsys(ordenes[orden])
          console.log(JSON.stringify(bodyTrigger))
          res = await sendExternalEventEmarsys(bodyTrigger, pais)
          console.log('\nOrden '+ordenes[orden][0].id+' - Tienda '+ordenes[orden][0].tienda_id+' : '+ res.replyText)
              }
    } else {
      continue;
    }
  }
  process.exit()
}
iniciarOrdenes(idOrden);
