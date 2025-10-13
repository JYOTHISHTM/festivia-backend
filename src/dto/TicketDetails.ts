export interface TicketDetails {
  _id: string;
  eventName: string;
  location: string;
  image: string;
  date?: Date;     
  time: string;
  userName: string;
  email: string;
  seats: number[]
  status: string;
  eventType: string;
  price: number;
}
