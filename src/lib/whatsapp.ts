import { brand } from '../content/site'

/** Link para conversar com a Amanda. Com número cadastrado, já leva a mensagem escrita. */
export function whatsappLink(message?: string) {
  if (brand.whatsappNumber && message) {
    return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`
  }
  return brand.whatsappUrl
}

/** Abrir o link não envia nada: a pessoa ainda precisa tocar em enviar no WhatsApp. */
export const whatsappCanPrefill = () => Boolean(brand.whatsappNumber)
