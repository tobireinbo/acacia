const ListEntry: React.FC<{
  title: string;
  subtitle?: string;
  onClick?: () => void;
}> = ({ title, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-100  dark:border-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600  rounded-md cursor-pointer p-4"
    >
      <h3>{title}</h3>
      {subtitle && <h5>{subtitle}</h5>}
    </div>
  );
};
export default ListEntry;
