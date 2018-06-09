
function tomb(el, binding){
  console.log(binding)
}

export default {
  bind: tomb,
  inserted: function () {},
  update: function () {},
  componentUpdated: function () {},
  unbind: function () {}
}
