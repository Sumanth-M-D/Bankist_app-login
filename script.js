'use strict';

/* BANKIST APP --> possible updates
  1. logout button
  2. transfer amount function -> convert the currency (value)
  3. functionality -> Open a new account.
*/

// Data ................................................................ ................................
// Usernames => js, jd, rc, cs
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    { mov: 200, date: '2019-11-18T21:31:17.178Z' },
    { mov: 450, date: '2019-12-23T07:42:02.383Z' },
    { mov: -400, date: '2020-01-28T09:15:04.904Z' },
    { mov: 3000, date: '2020-04-01T10:17:24.185Z' },
    { mov: -650, date: '2020-05-08T14:11:59.604Z' },
    { mov: -130, date: '2024-02-01T17:01:17.194Z' },
    { mov: 70, date: '2024-02-04T23:36:17.929Z' },
    { mov: 1300, date: '2024-02-08T10:51:36.790Z' },
  ],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'EUR',
  locale: 'en-UK', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    { mov: 5000, date: '2019-11-01T13:15:33.035Z' },
    { mov: 3400, date: '2019-11-30T09:48:16.867Z' },
    { mov: -150, date: '2019-12-25T06:04:23.907Z' },
    { mov: -790, date: '2020-01-25T14:18:46.235Z' },
    { mov: -3210, date: '2020-02-05T16:33:06.386Z' },
    { mov: -1000, date: '2024-02-01T14:43:26.374Z' },
    { mov: 8500, date: '2024-02-04T18:49:59.371Z' },
    { mov: -30, date: '2024-02-08T12:01:20.894Z' },
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Rama Chandra',
  movements: [
    { mov: 340, date: '2019-12-25T06:04:23.907Z' },
    { mov: -300, date: '2020-01-25T14:18:46.235Z' },
    { mov: -20, date: '2020-02-05T16:33:06.386Z' },
    { mov: 50, date: '2024-02-01T14:43:26.374Z' },
    { mov: 400, date: '2024-02-04T18:49:59.371Z' },
    { mov: -460, date: '2024-02-08T12:01:20.894Z' },
  ],
  interestRate: 0.7,
  pin: 3333,
  currency: 'INR',
  locale: 'en-IN',
};

const account4 = {
  owner: 'Chandra Shekhar',
  movements: [
    { mov: 2000, date: '2019-11-01T13:15:33.035Z' },
    { mov: 1450, date: '2019-11-30T09:48:16.867Z' },
    { mov: -2345, date: '2019-12-25T06:04:23.907Z' },
    { mov: -300, date: '2020-01-25T14:18:46.235Z' },
    { mov: -200, date: '2020-02-05T16:33:06.386Z' },
    { mov: 5000, date: '2024-02-01T14:43:26.374Z' },
  ],
  interestRate: 1,
  pin: 4444,
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3, account4];

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Dom Elements ****************************************************************************************
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                              functions
 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

//1. Function for Creating userNames
function createUserNames(accounts) {
  let userNames = [];
  accounts.forEach(account => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
}

//2. Function for Displaying movements
function displayMovements(account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort(({ mov: a }, { mov: b }) => a - b)
    : account.movements;

  movs.forEach(({ mov, date }, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const displayDate = formatMovementDate(new Date(date), account.locale);

    const formattedMovement = formatCurrencies(
      mov,
      account.locale,
      account.currency
    );

    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type} </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value"> ${formattedMovement} </div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

  document.querySelectorAll('.movements__row').forEach((row, i) => {
    if ((i + 1) % 2 === 0) {
      row.style.backgroundColor = 'grey';
    }
  });
}

//3. Function for display balance
function calcDisplayBalance(account) {
  account.balance = account.movements
    .map(({ mov }) => mov)
    .reduce((acc, value) => (acc += value), 0);
  labelBalance.textContent = formatCurrencies(
    account.balance,
    account.locale,
    account.currency
  );
}

//4. Function for Display of summary
function calcDisplaySummary(account) {
  const incomes = account.movements
    .map(({ mov }) => mov)
    .filter(movement => movement > 0)
    .reduce((acc, movement) => (acc += movement), 0);
  labelSumIn.innerHTML = formatCurrencies(
    incomes,
    account.locale,
    account.currency
  );

  const outcomes = account.movements
    .map(({ mov }) => mov)
    .filter(movement => movement < 0)
    .reduce((acc, movement) => (acc += movement), 0);
  labelSumOut.innerHTML = formatCurrencies(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .map(({ mov }) => mov)
    .filter(movement => movement > 0)
    .reduce(
      (acc, movement) => (acc += (movement * account.interestRate) / 100),
      0
    );
  labelSumInterest.innerHTML = formatCurrencies(
    interest,
    account.locale,
    account.currency
  );
}

//5. Function for Update UI
function updateUI(currentAccount) {
  //Display movements
  displayMovements(currentAccount);

  //DIsplay balance
  calcDisplayBalance(currentAccount);

  //Display summary
  calcDisplaySummary(currentAccount);
}

//6. Helper Function for formatted movement date
function formatMovementDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (24 * 60 * 60 * 1000)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);

  //Another method
  /* const day = `${date.getDate()}`.padStart(2, 0);
            const month = `${date.getMonth() + 1}`.padStart(2, 0);
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;   */
}

//7. Function formatting the currencies
function formatCurrencies(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value.toFixed(2));
}

//8. Timer function
function startLogoutTimer() {
  //set time to 10 min
  let time = 600;

  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call print remaining time to user interface
    labelTimer.textContent = `${min}:${sec}`;

    //when reach 0, stop timer and logout
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  }

  //call timer every second
  tick();
  return setInterval(tick, 1000);
}
/**
 






*/
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                       Modularized code       
 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

// 1. Creating the userNames for the accounts
createUserNames(accounts);
console.log(accounts);
//Fake always login
// updateUI(account1);
// containerApp.style.opacity= 100;

//2. Login Event handler
let currentAccount, timer;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); //to prevent the button form submitting
  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and wlecome message\
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Current date --> internationalised
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //ANOTHER MOTHOD for date
    /* const now = new Date();
            const day = `${now.getDate()}`.padStart(2, 0);
            const month = `${now.getMonth() + 1}`.padStart(2, 0);
            const year = now.getFullYear();
            const hour = `${now.getHours()}`.padStart(2, 0);
            const minutes = `${now.getMinutes()}`.padStart(2, 0);

            labelDate.textContent = `${day}/${month}/${year} ${hour}:${minutes}`;  */

    //clear the input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateUI(currentAccount);
  }
});

//3. transfer amount event handler
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount &&
    receiverAccount?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push({
      mov: -amount,
      date: new Date().toISOString(),
    });
    receiverAccount.movements.push({
      mov: amount,
      date: new Date().toISOString(),
    });

    updateUI(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

//4. event listner for adding the loan feature
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(({ mov }) => mov > amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push({
        mov: amount,
        date: new Date().toISOString(),
      });

      updateUI(currentAccount);

      // reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

//5. close Account event handler
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  console.log('delete');

  if (
    Number(inputClosePin.value) === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.userName
  ) {
    const index = accounts.findIndex(
      account => account.userName === currentAccount.userName
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
});

//6. sort event Listener
let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
