import { checkoutView } from "../../../views/booking/checkout-view";
import { dateTimeToNativeDate } from "../../../helpers/date/date-time-to-native-date";
import { CheckoutContext } from "../middlewares/checkout-middleware";

export async function form(ctx: CheckoutContext) {
  const isAuthenticated = ctx.isAuthenticated();
  const userName = ctx.state.userName;
  const userEmail = ctx.state.userEmail;
  const bookingSlot = ctx.state.bookingSlot;
  const salonMaster = ctx.state.salonMaster;
  const salonService = ctx.state.salonService;

  ctx.assert(bookingSlot, 404, "Time is already booked");
  ctx.assert(salonMaster, 404, "Oops, something went wrong");
  ctx.assert(salonService, 400, "Invalid params");

  ctx.body = checkoutView({
    isAuthenticated: isAuthenticated,
    userName: userName,
    userEmail: userEmail,
    bookingMasterName: salonMaster.name,
    bookingServiceName: salonService.name,
    bookingDate: dateTimeToNativeDate(bookingSlot.start).toLocaleString()
  })
}
