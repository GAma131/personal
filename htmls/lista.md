## To-Do
- [x] Agregar imágenes a emarsys
- [x] Buscar nombres de campos a recibir
- [ ] Regresar tienda por cada entrega en lugar de en la orden

## Correos
en emarsys / asunto (estatus)
### BOSS
15962 - ped confirmado boss (promesa-entrega)    -> Tu pedido ha sido confirmado (83)
15964 - preparando ped boss (promesa-entrega)    -> Estamos preparando tu pedido (84)
15965 - ped guia generada boss (promesa-entrega) -> Tu pedido ya cuenta con guía (A2)
15966 - ped enviado boss (promesa-entrega)       -> Tu pedido esta en tránsito (90)
15967 - ped entregado boss (promesa-entrega)     -> Tu pedido fue entregado (A3)
15968 - ped pendiente reenvio (promesa-entrega)  -> Reprogramaremos tu entrega (85) - no en correosPedidos
15969 - ped devuelto boss (promesa-entrega)      -> No pudimos entregar tu pedido (A4)

### BOPUS
15963 - ped confirmado bopus (promesa-entrega)   -> Tu pedido ha sido confirmado (83)
15970 - ped listo recoger bopus (promesa-entrega)-> Tu pedido esta listo para recoger (84)
15971 - ped entregado bopus (promesa-entrega)    -> Tu pedido fue entregado (91)

### Entrega-Total
15972 - entrega total boss (promesa-entrega)     -> Hemos entregado exitosamente todos tus productos
15973 - entrega total bopus (promesa-entrega)    -> Hemos entregado exitosamente todos tus productos
15974 - entrega total split (promesa-entrega)    -> Hemos entregado exitosamente todos tus productos

### Split
15976 - ped confirmado split bopus (promesa-entrega) -> Tu pedido ha sido confirmado (83)
15977 - ped confirmado split boss/bopus (promesa-entrega) -> Tu pedido ha sido confirmado (83)
15978 - ped confirmado split boss tienda A/B (promesa-entrega) -> Tu pedido ha sido confirmado (83)
15979 - ped confirmado split boss/bopus tienda A/B (promesa-entrega) -> Tu pedido ha sido confirmado (83)

## Componentes
en emarsys / en repositorio
### Generales
header-petco           - headerPetco.html
ayuda-pedido           - ayudaPedido.html
ayuda-factura          - ayudaFactura.html
footer                 - footer.html
saludo-usuario         - saludo.html
mapa                   - mapa.html
productos-similares    - productosSimilares.html
texto-detalle-entregas - DetalleEntregas.html

### BOSS
detalle-pedido-boss      - detallePedidoBoss.html
tus-productos-boss       - tusProductos.html
ped-confirmado-boss      - pedidoConfirmadoBoss.html
preparando-pedido-boss   - preparandoPedidoBoss.html
guia-generada-boss       - pedidoConGuiaBoss.html
en-transito-boss         - pedidoEnTransitoBoss.html
entregado-boss           - pedidoEntregadoBoss.html
devuelto-boss            - pedidoDevueltoBoss.html
reprogramar-entrega-boss - reprogramarEntregaBoss.html

### BOPUS
codigo-qr-bopus      - codigoQrBopus.html
detalle-pedido-bopus - detallePedidoBopus.html
confirmado-bopus     - pedidoConfirmadoBopus.html
recoger-bopus        - listoRecogerBopus.html
entregado-bopus      - pedidoEntregadoBopus.html

### Entrega-Total
entrega-total-confirmado - pedidoConfirmadoTotal.html
entrega-total-domicilio  - entregaDomicilioTotal.html
entrega-total-tienda     - entregaTiendaTotal.html

### Split
preparando-pedido-split   - preparandoPedidoSplit.html
confirmado-split-bopus    - pedidoConfirmadoSplitBopus.html
tus-productos-split-bopus - tusProductosSplit-bopus.html
tus-productos-split-boss  - tusProductosSplit-boss.html

