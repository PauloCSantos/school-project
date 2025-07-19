import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';

describe('Address unit test', () => {
  describe('On fail', () => {
    it('should throw an error if any address field is missing', () => {
      const invalidAddressData = {
        street: 'Main Street',
        zip: '12345',
        number: 123,
        avenue: 'Central Avenue',
        state: 'California',
      };
      //@ts-expect-error
      expect(() => new Address(invalidAddressData)).toThrow(
        'All address fields are mandatory'
      );
    });
    it('should throw an error if any address field is empty', () => {
      const invalidAddressData = {
        street: 'Main Street',
        city: 'Cityville',
        number: 123,
        zip: undefined,
        avenue: 'Central Avenue',
        state: 'California',
      };
      //@ts-expect-error
      expect(() => new Address(invalidAddressData)).toThrow(
        'All address fields are mandatory'
      );
    });
    it('should throw an error when update an address object with invalid input', () => {
      const addressData = {
        street: 'Street A',
        city: 'City A',
        zip: '111111-111',
        number: 1,
        avenue: 'Avenue A',
        state: 'State A',
      };
      const address = new Address(addressData);
      const updateAddress = {
        street: 'S',
        city: '',
        zip: '111111-222',
        number: 'asd',
        avenue:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi turpis velit, lacinia ac leo eget, facilisis faucibus lectus. Integer in dolor ac ante tincidunt suscipit a vel purus. Suspendisse eu faucibus ipsum. Aliquam egestas pulvinar ultrices. Cras fusce.',
        state: 'State B',
      };

      expect(() => (address.street = updateAddress.street)).toThrow(
        'The street field was not filled in correctly'
      );
      expect(() => (address.city = updateAddress.city)).toThrow(
        'The city field was not filled in correctly'
      );
      expect(() => (address.avenue = updateAddress.avenue)).toThrow(
        'The avenue field was not filled in correctly'
      );
      //@ts-expect-error
      expect(() => (address.number = updateAddress.number)).toThrow(
        'The number field was not filled in correctly'
      );
    });
  });

  describe('On success', () => {
    it('should create an address object with valid input', () => {
      const addressData = {
        street: 'Street A',
        city: 'City A',
        zip: '111111-111',
        number: 1,
        avenue: 'Avenue A',
        state: 'State A',
      };

      const address = new Address(addressData);
      expect(address).toBeInstanceOf(Address);
      expect(address.street).toBe(addressData.street);
      expect(address.city).toBe(addressData.city);
      expect(address.zip).toBe(addressData.zip);
      expect(address.number).toBe(addressData.number);
      expect(address.avenue).toBe(addressData.avenue);
      expect(address.state).toBe(addressData.state);
    });
    it('should update an address object with valid input', () => {
      const addressData = {
        street: 'Street A',
        city: 'City A',
        zip: '111111-111',
        number: 1,
        avenue: 'Avenue A',
        state: 'State A',
      };
      const address = new Address(addressData);
      const updateAddress = {
        street: 'Street B',
        city: 'City B',
        zip: '111111-222',
        number: 2,
        avenue: 'Avenue B',
        state: 'State B',
      };
      address.street = updateAddress.street;
      address.city = updateAddress.city;
      address.zip = updateAddress.zip;
      address.number = updateAddress.number;
      address.avenue = updateAddress.avenue;
      address.state = updateAddress.state;

      expect(address).toBeInstanceOf(Address);
      expect(address.street).toBe(updateAddress.street);
      expect(address.city).toBe(updateAddress.city);
      expect(address.zip).toBe(updateAddress.zip);
      expect(address.number).toBe(updateAddress.number);
      expect(address.avenue).toBe(updateAddress.avenue);
      expect(address.state).toBe(updateAddress.state);
    });
  });
});
