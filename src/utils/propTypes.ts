import { type VueTypeValidableDef, VueTypesInterface, createTypes, toValidableType } from 'vue-types'
import { type CSSProperties } from 'vue'

type PropTypes = any & {
  readonly style: any
}
const newPropTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined
}) as PropTypes

class propTypes extends newPropTypes {
  static get style() {
    return toValidableType('style', {
      type: [String, Object]
    })
  }
}

export { propTypes }
