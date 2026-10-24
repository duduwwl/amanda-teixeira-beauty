import { studioPhotos } from '../../content/media'

export const DECK = studioPhotos.map((p, i) => ({
  ...p,
  caption: ['A sala do laser', 'Gravação do Caminhos para o Sucesso', 'Cabelo cuidado no studio', 'O certificado do programa de TV'][i],
}))
/** Inclinação de cada foto da pilha, de cima para baixo. */
export const TILT = [0, -6, 5, -3]
