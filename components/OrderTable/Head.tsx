type Props = {
  showHeading: boolean;
  columns: string[];
};

export const Head = ({ showHeading = true, columns }: Props) => {
  return (
    <thead
      className={`${showHeading ? "" : "hidden"} border-b-1 border-secondary`}
    >
      <tr className="uppercase text-secondary">
        {columns.map((column) => (
          <th key={column}>{column}</th>
        ))}
      </tr>
    </thead>
  );
};
