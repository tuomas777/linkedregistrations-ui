import { GetServerSideProps } from 'next';

const Healthz = (): null => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.end('OK');
  return { props: {} };
};

export default Healthz;
