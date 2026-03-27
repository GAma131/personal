# Análisis: Datos enviados a Emarsys desde correosPedidos.js

## Flujo general

1. `getOrderDetail()` — consulta la orden en Hybris y arma el objeto `info`
2. `generateBodyTriggerEmarsys()` — construye el payload final (línea 2899)
3. `sendExternalEventEmarsys()` — hace `POST https://api.emarsys.net/api/v2/event/{id}/trigger`

El body que llega a Emarsys tiene la estructura:
```json
{
  "key_id": 3,
  "external_id": "correo@cliente.com",
  "data": { ...campos abajo... }
}
```

---

## Campos que el script manda en `data`

| Campo | Descripción | Ejemplo |
|---|---|---|
| `nombre` | Primer nombre del cliente | `"Erick"` |
| `id` | No. de pedido (8 dígitos) | `"12345678"` |
| `tipo_orden` | Tipo de entrega | `"Envío a domicilio"` / `"Entrega en tienda Petco"` |
| `created_at` | Fecha de creación de la orden (raw) | — |
| `carritoTotal` | Total con cupones | `"$399.00"` |
| `total` | Ídem a `carritoTotal` | `"$399.00"` |
| `totalSinDesc` | Total sin descuento | `"$499.00"` |
| `totalDesc` | Monto cubierto por cupones | `"$100.00"` |
| `totalEnv` | Costo de envío o `"GRATIS"` | `"GRATIS"` |
| `descEasybuy` | Monto de descuento EasyBuy | `"$50.00"` |
| `porcen` | Porcentaje de descuento EasyBuy | `"10%"` |
| `direccion` | Dirección de envío | `"Av. Ejército Nacional 769..."` |
| `telefono` | Teléfono formateado | `"(55) 8167-9201"` |
| `cardNumber` | Número de tarjeta enmascarado | `"************5868"` |
| `card` | Últimos 4 dígitos | `"5868"` |
| `cardName` | Nombre en tarjeta | `"Erick Espino R."` |
| `cardType` | Tipo de tarjeta | `"Visa"` |
| `banco` | Banco emisor | `"BANAMEX"` |
| `pago` | Método de pago | `"Tarjeta de crédito/débito"` / `"PayPal"` |
| `methodPay` | Método raw de Hybris | `"card"` / `"paypal"` |
| `datosOrden[n].urlImagen` | URL imagen del producto | `"https://www.petco.com.mx/..."` |
| `datosOrden[n].descripcion_marca` | Nombre del producto | `"Whole Hearted Adulto Pollo"` |
| `datosOrden[n].cantidadProducto` | Cantidad | `2` |
| `datosOrden[n].precioProducto` | Precio unitario formateado | `"$199.00"` |
| `datosOrden[n].numeroMarca` | SKU del producto | `"789456123"` |
| `tipoEnvio` | Tipo de orden sin formatear | `"BOSS"` / `"BOPUS"` |
| `statusId` | Estatus SAP | `"84"` / `"A2"` / `"90"` / `"A3"` |
| `statusEnvio` | Texto del estatus | `"Enviamos tu pedido 12345678"` |
| `paquetera` | Empresa de mensajería | `"Estafeta"` / `"Uber"` |
| `url` | URL de rastreo | `"https://..."` |
| `codigo` | Token BOPUS | — |
| `codigoConfirmacion` | PIN Uber | — |
| `idClubPetco` | ID del cliente | — |

---

## tusProductos.html — Variables vs. realidad

| Variable en el HTML | ¿Existe en el script? | Campo real a usar |
|---|---|---|
| `{{item.urlImagen}}` | ✅ | `datosOrden[n].urlImagen` |
| `{{item.titulo}}` | ❌ nombre incorrecto | `datosOrden[n].descripcion_marca` |
| `{{item.descripcion}}` | ❌ no existe | No se manda descripción corta |
| `{{event.cantidadProducto}}` | ⚠️ está dentro del array | `datosOrden[n].cantidadProducto` |
| `{{event.skuProducto}}` | ❌ nombre incorrecto | `datosOrden[n].numeroMarca` |
| `{{event.totalDesc}}` | ✅ | `totalDesc` |
| `{{event.carritoTotal}}` | ✅ | `carritoTotal` |
| `{{event.totalSinDesc}}` | ✅ | `totalSinDesc` |
| `{{event.subtotal}}` | ❌ no existe | No hay campo `subtotal` separado |
| `{{event.descuento}}` | ❌ no existe | `descEasybuy` o `totalDesc` |
| `{{event.cuponDesc}}` | ❌ no existe | `totalDesc` (no está separado de EasyBuy) |

---

## detallePedido.html — Todo hardcodeado

| Valor hardcodeado | Variable que debería usar |
|---|---|
| `00000000` (No. pedido) | `{{event.id}}` |
| `29 de febrero 2026` (fecha) | `{{event.created_at}}` |
| `Petco Easy Buy` (opción de compra) | `{{event.tipo_orden}}` |
| `Erick Espino` (destinatario) | `{{event.nombre}}` |
| Dirección completa | `{{event.direccion}}` |
| `5581679201` (teléfono) | `{{event.telefono}}` |
| `**** **** **** 5868` (tarjeta) | `{{event.cardNumber}}` |
| `Erick Espino R.` (nombre tarjeta) | `{{event.cardName}}` |
| Logo `visa.png` (fijo) | Debería ser dinámico según `{{event.pago}}` o `{{event.cardType}}` |

---

## Campos que faltan agregar al script

Para que los HTMLs funcionen tal como están diseñados, habría que agregar estos campos en `generateBodyTriggerEmarsys()`:

| Campo faltante | Cómo calcularlo |
|---|---|
| `subtotal` | Suma de `precioProducto * cantidadProducto` por item, o usar `totalSinDesc` |
| `descuento` (EasyBuy separado del cupón) | Ya existe `descEasybuy` — solo renombrar o agregar |
| `cuponDesc` (descuento cupón Club Petco) | Ya existe `totalDesc` — solo renombrar o agregar alias |
