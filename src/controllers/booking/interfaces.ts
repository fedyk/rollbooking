export interface CheckoutURLParams {

  /**
   * Master Id
   */
  m: string;
  
  /**
   * Service Id
   */
  s: string;

  /**
   * Start of workday period, YYYY-MM-DDTHH-MM-SS
   */
  wdps: string;

  /**
   * End of workday period, YYYY-MM-DDTHH-MM-SS
   */
  wdpe: string;

  /**
   * Time of day, HH:MM, or HH:MM:SS
   */
  t: string;
}
