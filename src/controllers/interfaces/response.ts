export type Response<D = null> = {
  message?: string
  code: number
  data?: D | any
  error?: any
}