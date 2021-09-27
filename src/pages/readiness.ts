import { GetServerSideProps } from 'next';

const Readiness = () => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.end('OK');
  return { props: {} };
};

export default Readiness;
