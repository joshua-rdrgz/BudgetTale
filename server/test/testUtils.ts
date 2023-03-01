import { IUser } from '@models/userModel';
import { IMonth } from '@models/monthModel';
import { IBudget } from '@models/budgetModels/budgetModel';
import { ITransaction } from '@models/transactionModels/transactionModel';
import { IExpenseCategoryGroups } from '@models/budgetModels/expenseModels/expenseCategoryGroupModel';
import { IExpenseCategories } from '@models/budgetModels/expenseModels/expenseCategoryModel';
import { IIncomeCategoryGroups } from '@models/budgetModels/incomeModels/incomeCategoryGroupModel';
import { IIncomeCategories } from '@models/budgetModels/incomeModels/incomeCategoryModel';

type Level =
  | 'users'
  | 'months'
  | 'budgets'
  | 'transactions'
  | 'incomeCategoryGroups'
  | 'expenseCategoryGroups'
  | 'incomeCategories'
  | 'expenseCategories';

type TType =
  | IUser
  | IMonth
  | IBudget
  | ITransaction
  | IIncomeCategoryGroups
  | IIncomeCategories
  | IExpenseCategoryGroups
  | IExpenseCategories;

const modelObj: IUser = {
  name: 'Test User',
  email: 'testing@gmail.com',
  password: 'testpassword',
  passwordConfirm: 'testpassword',
  months: [
    {
      month: 'February 2023',
      budget: {
        incomes: [
          {
            name: 'Income Group 1',
            categories: [
              {
                name: 'Income 1',
                amount: 500,
              },
            ],
          },
        ] as IBudget['incomes'],
        expenses: [
          {
            name: 'Expense Group 1',
            categories: [
              {
                name: 'Expense 1',
                amount: -500,
              },
            ],
          },
        ] as IBudget['expenses'],
      },
      transactions: [
        {
          title: 'Title',
          amount: -100,
          description: 'This is a description of a transaction.',
          date: new Date(Date.now()),
          category: 'Category',
        },
      ] as IMonth['transactions'],
    },
  ] as IUser['months'],
};

export const generateObject = (level: Level, isCorrect = true) => {
  let returnedObj: TType | {};

  switch (level) {
    case 'users':
      if (isCorrect) {
        // Passes correct User Object
        returnedObj = { ...modelObj } as IUser;
      } else {
        // Passes empty User Object
        returnedObj = {};
      }
      break;
    case 'months':
      if (isCorrect) {
        // Passes correct Month Object
        returnedObj = { ...modelObj.months[0] } as IMonth;
      } else {
        // Passes Month Object with no Transactions
        returnedObj = { ...modelObj.months[0], transactions: [] };
      }
      break;
    case 'budgets':
      if (isCorrect) {
        // Passes correct Budget Object
        returnedObj = { ...modelObj.months[0].budget } as IBudget;
      } else {
        // Passes Budget Object w/no Incomes
        returnedObj = { ...modelObj.months[0].budget, incomes: [] };
      }
      break;
    case 'transactions':
      if (isCorrect) {
        // Passes correct Transaction Object
        returnedObj = { ...modelObj.months[0].transactions[0] } as ITransaction;
      } else {
        // Passes Transaction Object w/no Title
        returnedObj = {
          ...modelObj.months[0].transactions[0],
          title: '',
        } as ITransaction;
      }
      break;
    case 'incomeCategoryGroups':
      if (isCorrect) {
        returnedObj = {
          ...modelObj.months[0].budget.incomes[0],
        } as IIncomeCategoryGroups;
      } else {
        // Passes w/no categories
        returnedObj = {
          ...modelObj.months[0].budget.incomes[0],
          categories: [],
        } as IIncomeCategoryGroups;
      }
      break;
    case 'expenseCategoryGroups':
      if (isCorrect) {
        returnedObj = {
          ...modelObj.months[0].budget.expenses[0],
        } as IExpenseCategoryGroups;
      } else {
        // Passes w/no categories
        returnedObj = {
          ...modelObj.months[0].budget.expenses[0],
          categories: [],
        } as IExpenseCategoryGroups;
      }
      break;
    case 'incomeCategories':
      if (isCorrect) {
        returnedObj = {
          ...modelObj.months[0].budget.incomes[0].categories[0],
        } as IIncomeCategories;
      } else {
        // Passes w/negative amount
        returnedObj = {
          ...modelObj.months[0].budget.incomes[0].categories[0],
          amount: -500,
        } as IIncomeCategories;
      }
      break;
    case 'expenseCategories':
      if (isCorrect) {
        returnedObj = {
          ...modelObj.months[0].budget.expenses[0].categories[0],
        } as IExpenseCategories;
      } else {
        // passes w/positvie amount
        returnedObj = {
          ...modelObj.months[0].budget.expenses[0].categories[0],
          amount: 500,
        } as IExpenseCategories;
      }
      break;
    default:
      throw new Error(
        'Must be: "users", "months", "budgets", "transactions", "incomeCategoryGroups", "incomeCategories", "expenseCategoryGroups", or "expenseCategories".'
      );
  }

  return returnedObj;
};
