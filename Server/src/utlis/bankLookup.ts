import axios from "axios"

export const lookupBank = async (routing: string) => {
  const res = await axios.get(
    `https://www.routingnumbers.info/api/data.json?rn=${routing}`
  )

  return res.data
}