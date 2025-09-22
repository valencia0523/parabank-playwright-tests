export const selectors = {
  login: {
    form: 'form[action*="login.htm"]',
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    submit: 'input[type="submit"][value="Log In"], input[type="submit"]',
  },
  nav: {
    logout: 'a[href*="logout.htm"]',
    openAccount: 'a[href*="openaccount.htm"]',
  },
  accounts: {
    overviewHeader: 'h1, h2, h3',
    newAccount: {
      typeSelect: 'select#type',
      fromAccountSelect: 'select#fromAccountId',
      submit:
        'input[type="submit"][value="Open New Account"], input[type="submit"]',
      idLabel: '#newAccountId',
    },
    details: {
      link: (id: string) => `a[href*="activity.htm?id=${id}"]`,
      header: 'h1, h2, h3',
    },
  },
  register: {
    form: 'form[action*="register.htm"]',
    firstName: 'input[name="customer.firstName"]',
    lastName: 'input[name="customer.lastName"]',
    address: 'input[name="customer.address.street"]',
    city: 'input[name="customer.address.city"]',
    state: 'input[name="customer.address.state"]',
    zipCode: 'input[name="customer.address.zipCode"]',
    phone: 'input[name="customer.phoneNumber"]',
    ssn: 'input[name="customer.ssn"]',
    username: 'input[name="customer.username"]',
    password: 'input[name="customer.password"]',
    passwordRepeat: 'input[name="repeatedPassword"]',
    submit: 'input[type="submit"][value="Register"], input[type="submit"]',
  },
} as const;
