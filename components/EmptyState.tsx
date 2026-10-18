export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-[#eee0cf]">
      <p className="text-muted font-medium">{message}</p>
    </div>
  );
}
