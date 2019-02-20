export interface CheckoutURLParams {

  /**
   * Master Id
   */
  mid: string;
  
  /**
   * Service Id
   */
  sid: string;

  /**
   * Start of workday period, YYYY-MM-DDTHH-MM-SS
   */
  wdps: string;

  /**
   * End of workday period, YYYY-MM-DDTHH-MM-SS
   */
  wdpe: string;

  /**
   * Date of requested reservation
   */
  d: string;

  /**
   * Time of day, HH:MM, or HH:MM:SS
   */
  t: string;
}
