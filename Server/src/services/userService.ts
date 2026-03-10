import { createUser } from "../repositories/userRepository"
import { userModel} from "../models/userModel"

export const registerUser = async (data: userModel) => {
  const user = await createUser(data)

  return user
}