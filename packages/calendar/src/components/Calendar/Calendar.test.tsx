import * as React from 'react';
import { create } from 'react-test-renderer';

import { Calendar } from './Calendar';

it('renders correctly', () => {
  const tree = create(<Calendar />).toJSON();
  expect(tree).toMatchSnapshot();
});
