import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { object, string } from "zod"
 
export const signInSchema = object({
  username: string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  password: string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
})