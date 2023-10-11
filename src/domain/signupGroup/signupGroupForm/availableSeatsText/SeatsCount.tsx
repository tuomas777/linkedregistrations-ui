type Props = {
  seats: number;
};

const SeatsCount: React.FC<Props> = ({ seats }) => <strong>{seats}</strong>;

export default SeatsCount;
