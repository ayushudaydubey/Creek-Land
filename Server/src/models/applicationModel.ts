export interface applicationModel {
  id?: number
  user_id: number
  amount: number
  status?: "pending" | "under_review" | "approved" | "rejected" | "funded"
  
}