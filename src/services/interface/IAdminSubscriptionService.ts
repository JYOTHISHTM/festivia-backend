
  export interface IAdminSubscriptionService {

  getSubscriptionPlan(): Promise<object>
  createSubscription(subscriptionData:any):Promise<object>
  deleteSubscription(id:string):Promise<object>

}
