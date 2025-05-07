// // MockRouter.tsx
// import { ReactNode } from 'react';
// import { render } from '@testing-library/react';
// import { useRouter } from 'next/router';

// const mockRouter = {
//   push: jest.fn(),
//   replace: jest.fn(),
//   route: '/',
//   pathname: '/',
//   query: {},
//   asPath: '/',
// };

// // Mocking the `next/router` module
// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));

// const MockRouter = ({ children }: { children: ReactNode }) => {
//   (useRouter as jest.Mock).mockReturnValue(mockRouter);
//   return <>{children}</>;
// };

// // Custom render function
// const customRender = (ui: ReactNode, options = {}) =>
//   render(<MockRouter>{ui}</MockRouter>, options);

// export * from '@testing-library/react';
// export { customRender as render };