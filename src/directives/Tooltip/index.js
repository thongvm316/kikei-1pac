const init = (el, binding) => {
  let position = binding.arg || 'top'
  let title = binding.value || ''
  el.setAttribute('position', position)
  el.setAttribute('tooltip', title)
}

const tooltipDirective = (app) => {
  app.directive('tooltip', {
    mounted(el, binding) {
      init(el, binding)
    },
    updated(el, binding) {
      init(el, binding)
    }
  })
}

export default tooltipDirective
