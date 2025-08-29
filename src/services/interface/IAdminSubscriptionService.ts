
  export interface IAdminSubscriptionService {

  getSubscriptionPlan(): Promise<any>
  createSubscription(subscriptionData:any):Promise<any>
  deleteSubscription(id:string):Promise<any>

}
