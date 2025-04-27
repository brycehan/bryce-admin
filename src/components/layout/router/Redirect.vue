<script lang="ts">
export default defineComponent({
  created() {
    const { params, query } = useRoute()
    const { path } = params
    const router = useRouter()
    router.replace({ path: '/' + path, query }).catch((error) => {
      console.warn(error)
    })
  },
  render() {
    return h('div')
  },
})
</script>
