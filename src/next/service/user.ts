import { z, ZodError } from "zod"
@HttpService()
class some {
    method = 'get'
    url = '/home/welcome'
}

@HttpService()
class testDeep {
    method = 'get'
    url = '/home/deep'
    resSchema = z.object({
      str: z.string(),
      arr: z.array(z.unknown()),
      boolean: z.boolean(),
      null: z.null(),
      obj: z.object({ num: z.number(), str: z.string(), isGood: z.boolean() }),
      num: z.number()
    }) 
}



export { some,testDeep }