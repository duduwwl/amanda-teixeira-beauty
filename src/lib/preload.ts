// Começa a baixar o código da agenda quando a pessoa sinaliza que vai clicar
// (mouse em cima ou foco no botão), para a página abrir sem espera.
let started = false
export function preloadBooking() {
  if (started) return
  started = true
  void import('../features/booking/BookingPage')
}
export const preloadProps = { onPointerEnter: preloadBooking, onFocus: preloadBooking, onTouchStart: preloadBooking }
