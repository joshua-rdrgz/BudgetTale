export const categoryGroupErrors = {
  name: 'A category group must have a name.',
  notUniqueName: 'A category group name must be unique.',
  noCategories: 'A category group must have at least 1 category.',
} as const;

export const categoryErrors = {
  name: 'A category must have a name.',
  notUniqueName: 'A category must be unique.',
  amount: 'A category must have an amount.',
  expenseAmount:
    'An expense category must be budgeted to spend at least spend 1 penny: -0.01.',
  incomeAmount:
    'An income category must be budgeted to make at least 1 penny: 0.01.',
} as const;

export const budgetErrors = {
  incomes: 'A budget must have at least 1 income category group.',
  expenses: 'A budget must have at least 1 expense category group.',
} as const;

export const transactionErrors = {
  category: 'A transaction must have a category.',
  date: 'A transaction must have a date.',
  description: 'A transaction must have a description.',
  descriptionMinLength:
    'A transaction description must be at least 15 characters.',
  descriptionMaxLength:
    'A transaction description must only contain up to 100 characters.',
  amount: 'A transaction must have an amount.',
  title: 'A transaction must have a title.',
  titleMinLength: 'A transaction title must be at least 5 characters.',
  titleMaxLength: 'A transaction title must only contain up to 30 characters.',
} as const;

export const monthErrors = {
  name: 'A month must have name: [Month] [Year]',
  budget: 'A month must always contain a budget field.',
  transactions: 'A month must always have a transactions field.',
} as const;

export const userErrors = {
  mustContain1Month: 'A user must contain at least 1 month.',
} as const;
