export class ContactModel {
  name: string;
  phone: string;
  email: string;
  countryCode: string;
  stateProvince: string;
  companyID?: number;
  contactCategory: string; // this is contact type, as in (vendor, customer, programmer, graphic artist... )
  isLoginUser: boolean;
}
