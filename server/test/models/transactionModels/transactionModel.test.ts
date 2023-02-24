import { transactionErrors } from '@errorMessages';
import { dropTestDB } from 'test/setup.test';
import { validateMissingOrIncorrectProperty } from 'test/models/testModelUtils';
import Transaction, {
  ITransaction,
} from '@models/transactionModels/transactionModel';

const testRequirementOfTransactionProperty = async (
  propertyName: 'category' | 'amount' | 'title' | 'description' | 'date',
  errorName: string
) => {
  const transactionObj: ITransaction = {
    category: 'Category',
    amount: -5,
    title: 'Title',
    description: 'Description',
    date: new Date(Date.now()),
  };
  delete transactionObj[propertyName];

  const transaction = new Transaction(transactionObj);

  await validateMissingOrIncorrectProperty<ITransaction>(
    transaction,
    propertyName,
    errorName
  );
};

describe('Transaction Model', () => {
  afterEach(() => dropTestDB<ITransaction>(Transaction, 'Transaction'));

  describe('category property', () => {
    it('should be required', async () =>
      await testRequirementOfTransactionProperty(
        'category',
        transactionErrors.category
      ));
  });

  describe('amount property', () => {
    it('should be required', async () =>
      await testRequirementOfTransactionProperty(
        'amount',
        transactionErrors.amount
      ));
  });

  describe('title property', () => {
    it('should be required', async () =>
      await testRequirementOfTransactionProperty(
        'title',
        transactionErrors.title
      ));
  });

  describe('date property', () => {
    it('should be required', async () =>
      await testRequirementOfTransactionProperty(
        'date',
        transactionErrors.date
      ));
  });

  describe('description property', () => {
    it('should be required', async () =>
      await testRequirementOfTransactionProperty(
        'description',
        transactionErrors.description
      ));
  });
});
