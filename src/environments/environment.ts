/**
 * Name: WebTransactionController
 *
 * Description: THIS WILL PROCESS TRANSACTIONS THAT COME IN FROM THE WEB SITE.
 * !!IMPORTANT NOTE: EACH FUNCTION WILL NEED TO AGGREGATE TO THE RESPECTIVE GATEWAY.
 *
 *
 * Copyright (c) 2018. All Code is the property of FitnessFeed unless unless otherwise specified by contract.
 *
 *          (\ /)
 *          (O .o)
 *          (> "<)
 *          (_/\_)
 *      ]) o 0 []v[]
 *
 *
 *
 * @author Michael Rumack
 * @company FitnessFeed
 * User: climbican
 * Date: 2/5/16
 * Time: 2:35 PM
 * Last Mod:
 * Notes:
 *
 *      production: false,
 apiUrl: 'http://localhost/fitnessfeed.io/public/api/',
 stripePK: 'pk_test_5xRhnH6xIrUaGnB06HHsZ9Ri',
 |
 production: true,
 apiUrl: 'https://fitnessfeed.io/api/',
 stripePK: 'pk_live_PIvRWV9oHCs7OP3WlMZee6Sc',
 |
 // The file contents for the current environment will overwrite these during build.
 // The build system defaults to the dev environment which uses `environment.ts`, but if you do
 // `ng build --env=prod` then `environment.prod.ts` will be used instead.
 // The list of which env maps to which file can be found in `.angular-cli.json`.
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost/movemnt/public/api/',
  stripePK: 'pk_test_5xRhnH6xIrUaGnB06HHsZ9Ri',
};
